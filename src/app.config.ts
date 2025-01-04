import z from "zod"

export const Config = z.object({
  REDIS_URL: z.string().url(),
})

export type Config = z.infer<typeof Config>

export const validate = (config: unknown): Config => {
  return Config.parse(config)
}
