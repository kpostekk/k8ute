import { ConsoleLogger, LogLevel } from "@nestjs/common"
import pino from "pino"

export class PinoLogger extends ConsoleLogger {
  public readonly pino: ReturnType<typeof this.createPino>
  public readonly nestLevels: Record<LogLevel, pino.Level> = {
    log: "info", // pino's default/info level
    error: "error", // pino's error level
    warn: "warn", // pino's warn level
    debug: "debug", // pino's debug level
    verbose: "trace", // pino's trace level
    fatal: "fatal", // pino's fatal level
  }

  constructor() {
    super()

    this.pino = this.createPino()
    this.pino.info("Logger initialized!")
  }

  private createPino() {
    const basePinoArgs: Parameters<typeof pino>[0] = {}

    if (process.env.NODE_ENV === "production") {
      return pino({ ...basePinoArgs, level: "info" })
    }

    return pino({
      ...basePinoArgs,
      transport: { target: "pino-pretty", options: { colorize: true } },
      level: "trace",
    })
  }

  protected printMessages(
    messages: unknown[],
    context?: string,
    logLevel?: LogLevel,
  ): void {
    const level = this.nestLevels[logLevel ?? "log"]
    const logger = this.pino.child({
      name: context,
    })

    for (const message of messages) {
      logger[level](message)
    }
  }
}
