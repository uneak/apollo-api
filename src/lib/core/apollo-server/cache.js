// gestion cache
import { BaseRedisCache } from "apollo-server-cache-redis";
import Redis from "ioredis";

export default ({ host = "redis://cache:6379" }) => {
  // do Something with options
  return new BaseRedisCache({
    client: new Redis({ host }),
  });
};
