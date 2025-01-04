import { Args, Mutation, Resolver } from "@nestjs/graphql"
import type {
  MutationCreateChallengeArgs,
  MutationDeleteChallengeArgs,
  MutationResetChallengeArgs,
  MutationResetChallengeSpaceArgs,
} from "src/app.graphql"
import { ChallengesService } from "./challenges.service"

@Resolver()
export class ChallengesResolver {
  constructor(private readonly challenges: ChallengesService) {}

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
