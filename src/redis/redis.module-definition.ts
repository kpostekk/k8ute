import { ConfigurableModuleBuilder } from "@nestjs/common"

export type RedisModuleOptions = {
  url: string
}

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<RedisModuleOptions>({
  moduleName: "Redis",
})
  .setClassMethodName("forRoot")
  .setExtras({}, (dynamicModule) => {
    return {
      ...dynamicModule,
      exports: dynamicModule.providers,
      global: true,
    }
  })
  .build()
