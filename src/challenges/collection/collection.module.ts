import { Module } from "@nestjs/common"
import { CollectionService } from "./collection.service"
import { CollectionResolver } from "./collection.resolver"

@Module({
  providers: [CollectionService, CollectionResolver],
  exports: [CollectionService],
})
export class CollectionModule {}
