import { Inject, Injectable } from "@nestjs/common"
import Redis from "ioredis"
import {
  MODULE_OPTIONS_TOKEN,
  type RedisModuleOptions,
} from "./redis.module-definition"

@Injectable()
export class RedisService extends Redis {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) config: RedisModuleOptions) {
    super(config.url)
  }
}
