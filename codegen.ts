import type { CodegenConfig } from "@graphql-codegen/cli"
import * as scalars from "graphql-scalars"

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/**/*.schema.{graphql,gql}",
  silent: true,
  generates: {
    "src/app.graphql.ts": {
      plugins: [
        {
          typescript: {
            avoidOptionals: true,
            enumsAsConst: true,
            defaultScalarType: "unknown",

          },
        },
      ],
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write src/app.graphql.ts"],
  },
}

export default config
