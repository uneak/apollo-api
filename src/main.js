import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";

// internal
import getSchema from "./lib/core/apollo-server/executable-schema";
import getCache from "./lib/core/apollo-server/cache.js";
import getDataSources from "./lib/core/apollo-server/datasources";
import getMongoClient from "./lib/core/mongo/mongo-client";

const expressApp = express();
const httpServer = http.createServer(expressApp);
const mongoClient = getMongoClient({ url: "mongodb://mongo:27017/api" });
const cache = getCache({ host: "redis", port: "6379" });

const dataSources = getDataSources({ mongoClient });
const schema = getSchema();

const apolloServer = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  cache,
  dataSources,
});

mongoClient.connect(() => {
  console.log(`🚀 Mongo Server ready`);
});

apolloServer.start().then(() => {
  apolloServer.applyMiddleware({
    app: expressApp,
    path: "/",
  });

  httpServer.listen({ port: 4000 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
    );
  });
});
