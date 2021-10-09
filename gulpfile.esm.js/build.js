import { series, parallel, src, dest } from "gulp";
import clean from "gulp-clean";
import CopyTask from "./copy";

// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
const empty = () => {
  return src("./build", { read: false, allowEmpty: true }).pipe(clean());
};

// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
const BuildTask = () => {
  return series(empty, CopyTask);
};

export { empty };
export default BuildTask();
