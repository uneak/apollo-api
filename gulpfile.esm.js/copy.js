import { parallel, src, dest } from "gulp";
import CopyGraphqlTask, {
  copyGraphqlSchemas,
  copyGraphqlResolvers,
  copyGraphqlMiddleware,
} from "./copy-graphql";

const copyLib = () => {
  return src("src/lib/**/*").pipe(dest("build/lib"));
};

const copyMain = () => {
  return src(["src/main.js", "src/index.js"]).pipe(dest("build"));
};

const CopyTask = () => {
  return parallel(CopyGraphqlTask, copyLib, copyMain);
};

export {
  copyLib,
  copyMain,
  copyGraphqlSchemas,
  copyGraphqlResolvers,
  copyGraphqlMiddleware,
  CopyGraphqlTask,
};
export default CopyTask();
