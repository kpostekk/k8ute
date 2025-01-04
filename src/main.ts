import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { PinoLogger } from "./app.logger"
import { ConfigService } from "@nestjs/config"
import { setTimeout } from "node:timers/promises"
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify"

const logger = new PinoLogger()

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
  {
    logger,
  },
)

const config = app.get(ConfigService)

process.on("SIGTERM", async () => {
  logger.log({
    msg: "SIGTERM signal received. Closing the app gracefully...",
  })

  const timeout = async () => {
    await setTimeout(500)
    logger.warn("Failed to close the app gracefully.")
    process.exit(0)
  }

  await Promise.race([app.close(), timeout()])
})

await app.listen(config.get<number>("NEST_PORT") ?? 3000)
