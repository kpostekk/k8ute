import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import type {
  MutationCreateChallengeArgs,
  MutationDeleteChallengeArgs,
} from "src/app.graphql"
import { ChallengesService } from "./challenges.service"
import type { Challenger } from "@prisma/client"
import { CurrentChallenger } from "./challengers/challenger-auth/challenger-auth.param"
import { UseGuards } from "@nestjs/common"
import { ChallengerAuthGuard } from "./challengers/challenger-auth/challenger-auth.guard"

@Resolver()
export class ChallengesResolver {
  constructor(private readonly challenges: ChallengesService) {}

  @UseGuards(ChallengerAuthGuard)
  @Query("challengeSpace")
  async queryChallengeSpace(@CurrentChallenger() challenger: Challenger) {
    return this.challenges.findActiveChallenges(challenger)
  }

  @UseGuards(ChallengerAuthGuard)
  @Mutation("createChallenge")
  async createChallenge(
    @Args() args: MutationCreateChallengeArgs,
    @CurrentChallenger() challenger: Challenger,
  ) {
    return this.challenges.createChallenge({
      id: args.challenge.id,
      challenger: challenger,
    })
  }

  @UseGuards(ChallengerAuthGuard)
  @Mutation("deleteChallenge")
  async deleteChallenge(
    @Args() args: MutationDeleteChallengeArgs,
    @CurrentChallenger() challenger: Challenger,
  ) {
    return this.challenges.stopChallenge({
      id: args.challenge.id,
      challenger: challenger,
    })
  }

  @UseGuards(ChallengerAuthGuard)
  @Mutation("resetChallenge")
  async resetChallenge(@CurrentChallenger() challenger: Challenger) {
    return this.challenges.resetChallenge(challenger)
  }

  @UseGuards(ChallengerAuthGuard)
  @Mutation("resetChallengeSpace")
  async resetChallengeSpace(@CurrentChallenger() challenger: Challenger) {
    return this.challenges.resetChallengeSpace(challenger)
  }
}
