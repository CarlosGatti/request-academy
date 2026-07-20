import type { CodegenConfig } from "@graphql-codegen/cli";

const schema = process.env.GRAPHQL_SCHEMA_URL
  ? process.env.GRAPHQL_SCHEMA_URL
  : ["src/graphql/schema/schema.graphql", "src/graphql/schema/admin.graphql"];

const config: CodegenConfig = {
  schema,
  documents: [
    "src/graphql/operations/**/*.graphql",
    "src/graphql/fragments/**/*.graphql",
  ],
  ignoreNoDocuments: true,
  generates: {
    "src/graphql/generated/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "graphql",
        fragmentMasking: false,
      },
      config: {
        skipTypename: false,
      },
    },
  },
};

export default config;
