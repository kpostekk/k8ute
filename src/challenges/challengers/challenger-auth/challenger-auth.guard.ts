import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { ChallengerAuthService } from "./challenger-auth.service"
import { GqlExecutionContext } from "@nestjs/graphql"
import type { FastifyRequest } from "fastify"
import z from "zod"

@Injectable()
export class ChallengerAuthGuard implements CanActivate {
  constructor(private readonly auth: ChallengerAuthService) {}

  async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const context = GqlExecutionContext.create(executionContext)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const request = context.getContext().req as FastifyRequest
    const headers = request.headers
    const authorization = headers.authorization

    if (!authorization) throw new UnauthorizedException()

    const headerPayload = authorization.split(" ")

    const [, token] = z
      .tuple([z.literal("Bearer"), z.string()])
      .parse(headerPayload)

    const challenger = await this.auth.exchangeTokenForChallenger(token)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    context.getContext().challenger = challenger

    return true
  }
}
