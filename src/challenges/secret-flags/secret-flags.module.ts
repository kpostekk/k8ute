import { Module } from "@nestjs/common"
import { SecretFlagsService } from "./secret-flags.service"
import { SecretFlagsResolver } from "./secret-flags.resolver"
import { PrismaModule } from "src/prisma/prisma.module"

@Module({
  imports: [PrismaModule],
  providers: [SecretFlagsService, SecretFlagsResolver],
  exports: [SecretFlagsService],
})
export class SecretFlagsModule {}
