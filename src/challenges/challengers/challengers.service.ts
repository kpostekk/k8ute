import { Injectable, OnApplicationBootstrap } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { Challenger as PrismaChallenger } from "@prisma/client"
import { ChallengerAuthService } from "./challenger-auth/challenger-auth.service"

export type Challenger = {
  id: string
  name: string
}

@Injectable()
export class ChallengersService implements OnApplicationBootstrap {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: ChallengerAuthService,
  ) {}

  async onApplicationBootstrap() {
    await this.populateSystemUsers()
  }

  private async populateSystemUsers() {
    const user1: PrismaChallenger = {
      id: "1663a2f5-02ea-4a81-8212-96d5a01d975f",
      name: "alexia",
      argon2Digest: await this.auth.createPassword("dzambo_ctf"),
    }

    await this.prisma.challenger.upsert({
      where: { id: user1.id },
      update: {},
      create: user1,
    })
  }
}
