import { Injectable } from "@nestjs/common"
import type { ChallengeDefinition } from "../collection/collection.service"
import type { Challenger } from "@prisma/client"
import { randomBytes } from "node:crypto"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class SecretFlagsService {
  constructor(private readonly prisma: PrismaService) {}

  async createFlag(
    challenge: Pick<ChallengeDefinition, "id">,
    challenger: Pick<Challenger, "id">,
  ) {
    const randomPayload = randomBytes(24).toString("base64url")
    const flag = `k8ute_{${randomPayload}}`

    const newFlag = await this.prisma.challengeDynamicFlag.upsert({
      where: {
        challengeId_challengerId: {
          challengeId: challenge.id,
          challengerId: challenger.id,
        },
      },
      update: { flag },
      create: {
        challengeId: challenge.id,
        challengerId: challenger.id,
        flag,
      },
    })

    return newFlag.flag
  }

  async validateChallengeFlag(
    challenge: Pick<ChallengeDefinition, "id">,
    challenger: Pick<Challenger, "id">,
    flag: string,
  ) {
    const flagExists = await this.prisma.challengeDynamicFlag.findFirst({
      where: {
        challengeId: challenge.id,
        challengerId: challenger.id,
        flag,
      },
    })

    return !!flagExists
  }
}
