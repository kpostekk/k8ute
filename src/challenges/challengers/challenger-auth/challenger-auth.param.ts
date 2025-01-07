import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"

export const CurrentChallenger = createParamDecorator(
  (data: unknown, executionContext: ExecutionContext) => {
    const context = GqlExecutionContext.create(executionContext)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const platformContext = context.getContext()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return platformContext.challenger
  },
)
