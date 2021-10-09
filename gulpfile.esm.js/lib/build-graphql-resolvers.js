import through from "through2";
import PluginError from "plugin-error";
import Vinyl from "vinyl";

export default function buildGraphqlResolvers(options) {
  const sourcesPath = [];
  // creating a stream through which each file will pass
  const stream = through.obj(
    function (file, enc, cb) {
      sourcesPath.push(file.relative);
      cb();
    },
    function (cb) {
      // flush function
      let resolverImportContent = "";
      const resolverExportModule = [];
      sourcesPath.forEach((path, index) => {
        resolverImportContent = `${resolverImportContent}\nimport r${index} from '../graphql/resolvers/${path}';`;
        resolverExportModule.push(`r${index}`);
      });
      let resolverContent =
        resolverImportContent +
        `\n\nexport default [${resolverExportModule.join(", ")}];`;

      const file = new Vinyl({
        cwd: "/",
        base: "/",
        path: "/index.js",
        contents: Buffer.from(resolverContent),
      });

      cb(null, file);
    }
  );

  // returning the file stream
  return stream;
}
