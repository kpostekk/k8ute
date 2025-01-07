import { Module } from "@nestjs/common"
import { ChallengesService } from "./challenges.service"
import { CollectionModule } from "./collection/collection.module"
import { ChallengersModule } from "./challengers/challengers.module"
import { ChallengesResolver } from "./challenges.resolver"
import { KubernetesModule } from "src/kubernetes/kubernetes.module"
import { SecretFlagsModule } from "./secret-flags/secret-flags.module"

@Module({
  providers: [ChallengesService, ChallengesResolver],
  imports: [
    CollectionModule,
    ChallengersModule,
    KubernetesModule,
    SecretFlagsModule,
  ],
})
export class ChallengesModule {}
