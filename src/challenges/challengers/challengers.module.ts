import { Module } from "@nestjs/common"
import { ChallengersService } from "./challengers.service"
import { ChallengersGuard } from "./challengers.guard"
import { PrismaModule } from "src/prisma/prisma.module"
import { ChallengersResolver } from "./challengers.resolver"
import { ChallengerAuthService } from "./challenger-auth/challenger-auth.service"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { ChallengerAuthGuard } from "./challenger-auth/challenger-auth.guard"

@Module({
  // imports: [RedisModule],
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("NEST_JWT_SECRET"),
      }),
    }),
  ],
  providers: [
    ChallengersService,
    ChallengersResolver,
    ChallengerAuthService,
    ChallengerAuthGuard,
  ],
  exports: [ChallengersService, ChallengerAuthService, ChallengerAuthGuard],
})
export class ChallengersModule {}
