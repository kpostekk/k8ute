import { Module } from "@nestjs/common"
import { ChallengersService } from "./challengers.service"
import { ChallengersGuard } from "./challengers.guard"
import { RedisModule } from "src/redis/redis.module"

@Module({
  imports: [RedisModule],
  providers: [ChallengersService, ChallengersGuard],
  exports: [ChallengersService, ChallengersGuard],
})
export class ChallengersModule {}
