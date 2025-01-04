import { SetMetadata } from "@nestjs/common"

export const Challengers = (...args: string[]) =>
  SetMetadata("challengers", args)
