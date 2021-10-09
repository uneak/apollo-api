import { makeExecutableSchema } from "@graphql-tools/schema";

import typeDefs from "../../../var/type-defs.graphql.js";
import resolvers from "../../../var/resolvers.graphql.js";

export default (options) => {
  // do Something with options
  return makeExecutableSchema({
    typeDefs,
    resolvers,
    // logger, // optional
    // resolverValidationOptions: {}, // optional
    // parseOptions: {},  // optional
    // inheritResolversFromInterfaces: false  // optional
  });
};
