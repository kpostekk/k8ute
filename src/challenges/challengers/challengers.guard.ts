import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { Challenger, ChallengersService } from "./challengers.service"

export type ChallengerContext = {
  challenger: Challenger
}

@Injectable()
export class ChallengersGuard implements CanActivate {
  constructor(private readonly challengers: ChallengersService) {}

  async canActivate(execContext: ExecutionContext): Promise<boolean> {
    const context = GqlExecutionContext.create(execContext)

    const gqlContext = context.getContext<ChallengerContext>()
    // const challenger = await this.challengers.findChallenger()

    // if (!challenger) throw new Error("No challenger found!")

    // gqlContext.challenger = challenger

    return true
  }
}
