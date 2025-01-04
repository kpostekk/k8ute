import { Module } from "@nestjs/common"
import { ChallengesService } from "./challenges.service"
import { CollectionModule } from "./collection/collection.module"
import { ChallengersModule } from "./challengers/challengers.module"
import { APP_GUARD } from "@nestjs/core"
import { ChallengersGuard } from "./challengers/challengers.guard"
import { ChallengesResolver } from "./challenges.resolver"
import { KubernetesModule } from "src/kubernetes/kubernetes.module"

@Module({
  providers: [
    ChallengesService,
    { provide: APP_GUARD, useClass: ChallengersGuard },
    ChallengesResolver,
  ],
  imports: [CollectionModule, ChallengersModule, KubernetesModule],
})
export class ChallengesModule {}
