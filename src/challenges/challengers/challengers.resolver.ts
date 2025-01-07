import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { ChallengersService } from "./challengers.service"
import { PrismaService } from "src/prisma/prisma.service"
import type {
  MutationLoginChallengerArgs,
  QueryChallengerArgs,
} from "src/app.graphql"
import { ChallengerAuthService } from "./challenger-auth/challenger-auth.service"
import { UnauthorizedException, UseGuards } from "@nestjs/common"
import { ChallengerAuthGuard } from "./challenger-auth/challenger-auth.guard"
import { CurrentChallenger } from "./challenger-auth/challenger-auth.param"
import type { Challenger } from "@prisma/client"

@Resolver()
export class ChallengersResolver {
  constructor(
    private readonly challengers: ChallengersService,
    private readonly auth: ChallengerAuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Query("challenger")
  queryChallenger(@Args() args: QueryChallengerArgs) {
    return this.prisma.challenger.findFirst({
      where: { id: args.id },
    })
  }

  @UseGuards(ChallengerAuthGuard)
  @Query("me")
  queryMe(@CurrentChallenger() challenger: Challenger) {
    return challenger
  }

  @Mutation("loginChallenger")
  async loginChallenger(@Args() args: MutationLoginChallengerArgs) {
    const userCanLogin = await this.auth.validateChallenger(
      args.challenger.name,
      args.challenger.password,
    )

    if (!userCanLogin) throw new UnauthorizedException()

    const token = this.auth.createChallengerSessionToken(userCanLogin)

    return {
      token,
      challenger: userCanLogin,
    }
  }
}
