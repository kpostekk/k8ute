import { KubeConfig } from "@kubernetes/client-node"
import { ConfigurableModuleBuilder } from "@nestjs/common"

export type KubernetesModuleOptions = {
  kubeConfig: KubeConfig
}

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<KubernetesModuleOptions>({
  moduleName: "Kubernetes",
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
