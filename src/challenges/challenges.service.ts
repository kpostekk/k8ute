import { Injectable, Logger } from "@nestjs/common"
import { CollectionService } from "./collection/collection.service"
import { KubernetesService } from "src/kubernetes/kubernetes.service"
import { ApiException } from "@kubernetes/client-node"
import { Challenger } from "./challengers/challengers.service"
import * as dateFns from "date-fns"
import { toKebabCase } from "remeda"

export type ChallengeOptions = {
  challenger: Challenger
  id: string
}

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name)

  constructor(
    private readonly collection: CollectionService,
    private readonly k8s: KubernetesService,
  ) {}

  private createNamespaceName(challenger: Pick<Challenger, "id" | "name">) {
    return `chngr-${challenger.id}`
  }

  async createChallenge(opts: ChallengeOptions) {
    const firstChallenge = this.collection.findChallenge(opts.id)
    if (!firstChallenge) throw new Error("Challenge not found!")

    const namespaceName = this.createNamespaceName(opts.challenger)
    const expire = dateFns.add(new Date(), { minutes: 10 })

    // check if user's namespace exists
    try {
      await this.k8s.api.readNamespace({
        name: namespaceName,
      })
    } catch (e) {
      if (e instanceof ApiException && e.code === 404) {
        // create namespace
        const createResponse = await this.k8s.api.createNamespace({
          body: {
            metadata: {
              name: namespaceName,
              labels: {
                "k8ute/challengespace": "true",
                "k8ute/challenger": opts.challenger.id,
              },
              annotations: {
                "k8ute/challenger-name": opts.challenger.name,
              },
            },
          },
        })
        this.logger.log(createResponse)
      } else {
        throw e
      }
    }

    const secret = `k8ute_{${Buffer.from(Date.now().toString()).toString("base64url")}}`
    const secretName = `secret-${toKebabCase(opts.id)}`

    // inject secret into namespace
    try {
      await this.k8s.api.createNamespacedSecret({
        namespace: namespaceName,
        body: {
          metadata: {
            name: secretName,
          },
          stringData: {
            secret,
          },
        },
      })
    } catch (e) {
      if (e instanceof ApiException && e.code === 409) {
        // secret already exists
        await this.k8s.api.replaceNamespacedSecret({
          namespace: namespaceName,
          name: secretName,
          body: {
            metadata: {
              name: secretName,
            },
            stringData: {
              secret,
            },
          },
        })
      } else {
        throw e
      }
    }

    this.logger.verbose({
      msg: "Created secret for challenge " + opts.id,
      challenge: opts.id,
      secret,
      secretName,
    })

    // check if resources already exist, if not create them
    for (const c of firstChallenge) {
      c.metadata = {
        ...c.metadata,
        namespace: namespaceName, // inject namespace into resource
        deletionTimestamp: expire, // inject expiration timestamp
        labels: {
          ...c.metadata?.labels,
          "k8ute/challenge": opts.id, // inject challenge label
          "k8ute/challenger": opts.challenger.id, // inject challenger label
        },
      }

      try {
        await this.k8s.kObjApi.read(c)
      } catch (e) {
        // resource does not exist, create it
        if (e instanceof ApiException && e.code === 404) {
          await this.k8s.kObjApi.create(c)
        } else {
          throw e
        }
      }

      this.logger.verbose({
        msg: `Created ${c.kind}/${c.metadata.name}`,
        namespace: c.metadata.namespace,
        resourceKind: c.kind,
        resourceName: c.metadata.name,
      })
    }

    // return services where label challengerId matches
    const services = await this.k8s.api.listNamespacedService({
      namespace: namespaceName,
      labelSelector: `k8ute/challenge=${opts.id},k8ute/expose`,
    })

    return services.items
      .map((s) => ({
        desc: s.metadata?.labels?.["k8ute/expose"],
        ip: s.spec?.clusterIP,
      }))
      .filter((s) => !!s.desc)
  }

  async stopChallenge(opts: ChallengeOptions) {
    let removals = 0

    const namespaceName = this.createNamespaceName(opts.challenger)

    const challengeResources = this.collection.findChallenge(opts.id)

    if (!challengeResources) throw new Error("Challenge not found!")

    for (const c of challengeResources) {
      c.metadata = {
        ...c.metadata,
        namespace: namespaceName,
      }

      try {
        await this.k8s.kObjApi.delete(c)
        removals += 1
      } catch (e) {
        if (e instanceof ApiException && e.code === 404) {
          continue
        } else {
          throw e
        }
      }
    }

    return removals
  }

  async resetChallenge(challenger: Pick<Challenger, "id" | "name">) {
    const namespace = this.createNamespaceName(challenger)

    // delete all pods in namespace if is controlled by replica set
    const pods = await this.k8s.api.listNamespacedPod({
      namespace,
      labelSelector: "pod-template-hash",
    })

    for (const pod of pods.items) {
      if (!pod.metadata?.name) continue

      await this.k8s.api.deleteNamespacedPod({
        name: pod.metadata.name,
        namespace,
      })

      this.logger.log(`Deleted pod ${pod.metadata.name}`)
    }

    return true
  }

  async resetChallengeSpace(challenger: Pick<Challenger, "id" | "name">) {
    const namespaceName = this.createNamespaceName(challenger)

    try {
      await this.k8s.api.deleteNamespace({
        name: namespaceName,
      })
    } catch (e) {
      if (e instanceof ApiException && e.code === 404) {
        return true
      } else {
        throw e
      }
    }

    return true
  }
}
