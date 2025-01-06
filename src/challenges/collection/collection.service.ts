import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common"
import fastGlob from "fast-glob"
import YAML from "yaml"
import fs from "node:fs"
import type { V1Deployment, V1Service } from "@kubernetes/client-node"
import path from "node:path"
import { z } from "zod"

export type ChallengeDefinitionComponent = V1Deployment | V1Service
export type ChallengeDefinitionComponents = ChallengeDefinitionComponent[]
export type ChallengeDefinition = {
  id: string
  components: ChallengeDefinitionComponents
  description?: string
  manifest?: Record<string, unknown>
}

@Injectable()
export class CollectionService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CollectionService.name)
  private challenges: Record<string, ChallengeDefinition> = {}

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

      this.challenges[challengeId] = { id: challengeId, components: cx }

      this.logger.log({
        msg: `Loaded challenge ${challengeId}`,
        components: cx.map((c) => `${c.kind}/${c.metadata?.name}`),
      })

      // check if the challenge has description (README.md)
      try {
        const readmePath = path.join(path.dirname(c), "README.md")
        const readmeContent = await fs.promises.readFile(readmePath, "utf-8")
        this.challenges[challengeId].description = readmeContent
      } catch (e) {
        const validation = z
          .object({
            code: z.literal("ENOENT"),
          })
          .safeParse(e)

        if (validation.success) {
          this.logger.warn({
            msg: `Missing description (README.md) for challenge ${challengeId}`,
            path: path.join(path.dirname(c), "README.md"),
            challengeId,
          })
        } else {
          this.logger.warn(e)
        }
      }
    }

    return this.challenges
  }

  async onApplicationBootstrap() {
    this.challenges = {}
    await this.loadChallenges()
  }

  findChallenge(id: string) {
    return this.challenges[id]
  }

  findChallenges() {
    return this.challenges
  }
}
