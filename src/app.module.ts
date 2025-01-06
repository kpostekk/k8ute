import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { AppResolver } from "./app.resolver"
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import * as scalars from "graphql-scalars"
import { BullModule } from "@nestjs/bullmq"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { validate } from "./app.config"
import { KubernetesModule } from "./kubernetes/kubernetes.module"
import { ChallengesModule } from "./challenges/challenges.module"
import { RedisModule } from "./redis/redis.module"
import { PrismaModule } from "./prisma/prisma.module"

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ["./**/*.graphql"],
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      typeDefs: [...scalars.typeDefs],
      resolvers: { ...scalars.resolvers },
    }),
    ConfigModule.forRoot({
      validate,
    }),
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     connection: {
    //       url: config.getOrThrow<string>("REDIS_URL"),
    //     },
    //   }),
    // }),
    // RedisModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     url: config.getOrThrow<string>("REDIS_URL"),
    //   }),
    // }),
    KubernetesModule.forRootAsync({
      useFactory: async () => {
        const k = await import("@kubernetes/client-node")
        const kc = new k.KubeConfig()
        kc.loadFromDefault()

        return {
          kubeConfig: kc,
        }
      },
    }),
    ChallengesModule,
    PrismaModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
