import { Inject, Injectable, Logger } from "@nestjs/common"
import * as k from "@kubernetes/client-node"
import {
  MODULE_OPTIONS_TOKEN,
  type KubernetesModuleOptions,
} from "./kubernetes.module-definition"

@Injectable()
export class KubernetesService {
  private readonly logger = new Logger()

  private readonly kc: k.KubeConfig
  public readonly api: k.CoreV1Api
  public readonly appApi: k.AppsV1Api
  public readonly kObjApi: k.KubernetesObjectApi

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    opts: KubernetesModuleOptions,
  ) {
    this.kc = opts.kubeConfig
    this.api = this.kc.makeApiClient(k.CoreV1Api)
    this.appApi = this.kc.makeApiClient(k.AppsV1Api)
    this.kObjApi = k.KubernetesObjectApi.makeApiClient(this.kc)
  }
}
