import { mergeTypeDefs } from "@graphql-tools/merge";
import { print } from "graphql";

import through from "through2";
import PluginError from "plugin-error";
import Vinyl from "vinyl";

export default function buildGraphqlScalarsSchema(options) {
  const sourcesPath = [];

  const stream = through.obj(
    function (file, enc, cb) {
      // transform function
      sourcesPath.push(file.path);
      cb();
    },
    function (cb) {
      // flush function
      const scalarsArray = [];
      sourcesPath.forEach((scalar, index) => {
        scalarsArray.push(require(scalar));
      });

      let scalars = "";
      scalarsArray.forEach((scalar) => {
        for (const key in scalar.default) {
          if (scalar.default.hasOwnProperty(key)) {
            scalars = `${scalars}\nscalar ${key}`;
          }
        }
      });

      const typeDefs = mergeTypeDefs(scalars);
      const schemas = print(typeDefs);

      const file = new Vinyl({
        cwd: "/",
        base: "/src/",
        path: "/src/scalars.graphql",
        contents: Buffer.from(schemas),
        typeDefs,
      });

      cb(null, file);
    }
  );

  // returning the file stream
  return stream;
}
