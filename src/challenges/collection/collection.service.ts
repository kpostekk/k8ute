import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common"
import fastGlob from "fast-glob"
import YAML from "yaml"
import fs from "node:fs"
import type { V1Deployment, V1Service } from "@kubernetes/client-node"
import path from "node:path"

export type ChallengeDefinitionComponent = V1Deployment | V1Service
export type ChallengeDefinitionComponents = ChallengeDefinitionComponent[]

@Injectable()
export class CollectionService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CollectionService.name)
  private readonly challenges: Record<string, ChallengeDefinitionComponents> =
    {}

  async loadChallenges() {
    const challenges = await fastGlob("examples/**/challenge.yaml")

    this.logger.log(`Found ${String(challenges.length)} challenges.`)

    for (const c of challenges) {
      const challengeId = path.basename(path.dirname(c))
      const cContent = await fs.promises.readFile(c)
      const cDocs = YAML.parseAllDocuments(cContent.toString())
      const cx = cDocs.map(
        (d) => d.toJS() as unknown,
      ) as ChallengeDefinitionComponents

      this.challenges[challengeId] = cx

      this.logger.log({
        msg: `Loaded challenge ${challengeId}`,
        components: cx.map((c) => `${c.kind}/${c.metadata?.name}`),
      })
    }

    return this.challenges
  }

  async onApplicationBootstrap() {
    await this.loadChallenges()
  }

  findChallenge(id: string) {
    return this.challenges[id]
  }

  findChallenges() {
    return this.challenges
  }
}
