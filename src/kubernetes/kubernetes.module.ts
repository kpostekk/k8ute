import { Module } from "@nestjs/common"
import { KubernetesService } from "./kubernetes.service"
import { ConfigurableModuleClass } from "./kubernetes.module-definition"

@Module({
  providers: [KubernetesService],
  exports: [KubernetesService],
})
export class KubernetesModule extends ConfigurableModuleClass {}
