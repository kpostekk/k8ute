import { Query, Resolver } from "@nestjs/graphql"

@Resolver()
export class AppResolver {
  @Query("hello")
  hello() {
    return "Hello, World!"
  }

  @Query("now")
  now() {
    return new Date()
  }
}
