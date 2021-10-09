import { MongoClient } from "mongodb";

export default ({ url = "mongodb://localhost:27017/test" }) => {
  const client = new MongoClient(url);

  return client;
};