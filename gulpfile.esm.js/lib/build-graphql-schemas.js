import through from "through2";
import PluginError from "plugin-error";
import Vinyl from "vinyl";

import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { print } from "graphql";

const { transpileSchema } = require("graphql-s2s").graphqls2s;

export default function buildGraphqlSchemas(options) {
  const sourcesPath = [];
  // creating a stream through which each file will pass
  const stream = through.obj(function (file, enc, cb) {
    sourcesPath.push(file.path);
    cb();
  },
  function (cb) {
    // flush function
    const typeArray = loadFilesSync(sourcesPath);
    const printedTypeArray = typeArray.reduce((acc, type) => {
      if (typeof type !== "string") {
        type = print(type);
      }
      return acc + type;
    }, "");

    const transpiledSchema = transpileSchema(printedTypeArray);
    const typeDefs = mergeTypeDefs(transpiledSchema);
    const schemas = print(typeDefs);

    const file = new Vinyl({
      cwd: "/",
      base: "/src/",
      path: "/src/schemas.graphql",
      contents: Buffer.from(schemas),
      typeDefs,
    });

    cb(null, file);
  });

  // returning the file stream
  return stream;
}
