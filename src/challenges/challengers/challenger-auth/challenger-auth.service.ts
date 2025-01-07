import { Injectable } from "@nestjs/common"
import * as argon2 from "argon2"
import { PrismaService } from "src/prisma/prisma.service"
import { Challenger } from "@prisma/client"
import { JwtService } from "@nestjs/jwt"
import z from "zod"

@Injectable()
export class ChallengerAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async validateChallenger(name: string, password: string) {
    const existingUser = await this.prisma.challenger.findUnique({
      where: { name },
    })

    if (!existingUser) return false

    const isPasswordValid = await this.checkPassword(
      password,
      existingUser.argon2Digest,
    )

    if (!isPasswordValid) return false

    return existingUser
  }

  createPassword(password: string) {
    return argon2.hash(password)
  }

  checkPassword(maybePassword: string, hash: string) {
    return argon2.verify(hash, maybePassword)
  }

  createChallengerSessionToken(user: Pick<Challenger, "id">) {
    return this.jwt.sign(
      {
        challenger: user.id,
      },
      {
        expiresIn: "2d",
        subject: user.id,
      },
    )
  }

  exchangeTokenForChallenger(token: string) {
    const signedUnsafe = this.jwt.verify(token) as unknown
    const signed = z.object({ challenger: z.string() }).parse(signedUnsafe)

    return this.prisma.challenger.findUnique({
      where: { id: signed.challenger },
    })
  }
}
