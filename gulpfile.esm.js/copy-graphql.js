import { parallel, src, dest } from "gulp";
import mergeStream from "merge-stream";
import gap from "gulp-append-prepend";
import concat from "gulp-concat";
import rename from "gulp-rename";
import buildGraphqlSchemas from "./lib/build-graphql-schemas";
import buildGraphqlScalarsSchema from "./lib/build-graphql-scalars-schema";
import buildGraphqlResolvers from "./lib/build-graphql-resolvers";

const copyGraphqlSchemas = () => {
  return (
    mergeStream(
      src("./src/graphql/types/**/*.graphql*").pipe(buildGraphqlSchemas()),
      src("src/graphql/scalars/**/*.scalar*").pipe(buildGraphqlScalarsSchema())
    )
      .pipe(concat("type-defs.graphql"))
      .pipe(dest("build/var"))
      .pipe(
        gap.prependText(
          'import { gql } from "apollo-server-express";\nexport default gql`\n'
        )
      )
      .pipe(gap.appendText("\n`"))
      .pipe(rename({ basename: "type-defs.graphql", extname: ".js" }))
      .pipe(dest("build/var"))
  );
};

const copyGraphqlResolvers = () => {
  return mergeStream(
    src("src/graphql/resolvers/**/*.resolver*"),
    src("src/graphql/scalars/**/*.scalar*")
  )
    .pipe(dest("build/graphql/resolvers"))
    .pipe(buildGraphqlResolvers())
    .pipe(rename({ basename: "resolver.graphql", extname: ".js" }))
    .pipe(dest("build/var"));
};

const copyGraphqlMiddleware = () => {
  return src("src/graphql/middleware/**/*").pipe(
    dest("build/graphql/middleware")
  );
};


const CopyGraphqlTask = () => {
  return parallel(
    copyGraphqlSchemas,
    copyGraphqlResolvers,
    copyGraphqlMiddleware,
  );
};

export {
  copyGraphqlSchemas,
  copyGraphqlResolvers,
  copyGraphqlMiddleware,
};

export default CopyGraphqlTask();
