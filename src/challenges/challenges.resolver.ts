import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import type {
  MutationCreateChallengeArgs,
  MutationDeleteChallengeArgs,
  MutationResetChallengeArgs,
  MutationResetChallengeSpaceArgs,
  QueryChallengeSpaceArgs,
} from "src/app.graphql"
import { ChallengesService } from "./challenges.service"

@Resolver()
export class ChallengesResolver {
  constructor(private readonly challenges: ChallengesService) {}

  @Query("challengeSpace")
  async queryChallengeSpace(@Args() args: QueryChallengeSpaceArgs) {
    return this.challenges.findActiveChallenges(args.challenger)
  }

  @Mutation("createChallenge")
  async createChallenge(@Args() args: MutationCreateChallengeArgs) {
    return this.challenges.createChallenge({
      id: args.challenge.id,
      challenger: args.challenger,
    })
  }

  @Mutation("deleteChallenge")
  async deleteChallenge(@Args() args: MutationDeleteChallengeArgs) {
    return this.challenges.stopChallenge({
      id: args.challenge.id,
      challenger: args.challenger,
    })
  }

  @Mutation("resetChallenge")
  async resetChallenge(@Args() args: MutationResetChallengeArgs) {
    return this.challenges.resetChallenge(args.challenger)
  }

  @Mutation("resetChallengeSpace")
  async resetChallengeSpace(@Args() args: MutationResetChallengeSpaceArgs) {
    return this.challenges.resetChallengeSpace(args.challenger)
  }
}
