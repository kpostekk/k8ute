import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { PinoLogger } from "./app.logger"
import { ConfigService } from "@nestjs/config"

const logger = new PinoLogger()

const app = await NestFactory.create(AppModule, {
  logger,
})

const config = app.get(ConfigService)

await app.listen(config.get<number>("NEST_PORT") ?? 3000)
