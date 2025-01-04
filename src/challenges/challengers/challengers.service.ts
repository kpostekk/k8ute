import { Injectable, OnApplicationBootstrap } from "@nestjs/common"
import { RedisService } from "src/redis/redis.service"

export type Challenger = {
  id: string
  name: string
}

@Injectable()
export class ChallengersService {
  private readonly redisKeyPrefix = "challengers"

  constructor(private readonly redis: RedisService) {}
}
