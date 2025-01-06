import { Mutation, Query, Resolver } from "@nestjs/graphql"
import { CollectionService } from "./collection.service"

@Resolver()
export class CollectionResolver {
  constructor(private readonly collection: CollectionService) {}

  @Query("challengesCollection")
  queryCollection() {
    return Object.values(this.collection.findChallenges())
  }

  @Mutation("reloadCollection")
  async reloadCollection() {
    const collection = await this.collection.loadChallenges()
    return Object.keys(collection).length
  }
}
