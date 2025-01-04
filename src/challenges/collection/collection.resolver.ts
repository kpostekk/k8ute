import { Mutation, Query, Resolver } from "@nestjs/graphql"
import { CollectionService } from "./collection.service"

@Resolver()
export class CollectionResolver {
  constructor(private readonly collection: CollectionService) {}

  @Query("collection")
  queryCollection() {
    return Object.keys(this.collection.findChallenges())
  }

  @Mutation("reloadCollection")
  async reloadCollection() {
    const collection = await this.collection.loadChallenges()
    return Object.keys(collection).length
  }
}
