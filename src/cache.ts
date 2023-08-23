import * as fs from "fs";
import * as path from "path";
import { UnsupportedOsError } from "./error";

const osCacheDirectory = () => {
  switch (true) {
    case ['linux', 'freebsd', 'openbsd'].includes(process.platform):
      return process.env.XDG_CACHE_HOME ?? path.join(process.env.HOME, ".cache");
    case process.platform === 'darwin':
      return path.join(
        process.env.HOME,
        "Library",
        "Caches",
      );
    default:
      throw new UnsupportedOsError();
  }
}
const cacheDirectory = path.join(osCacheDirectory(), "proton-mail-viewer");

export const store = (
  fileName: string,
  contents: string | NodeJS.ArrayBufferView,
  options?: fs.WriteFileOptions,
): void => {
  fs.mkdirSync(cacheDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(cacheDirectory, fileName),
    contents,
    options,
  );
}

export const load = (fileName: string, options?: unknown) =>
  fs.readFileSync(
    path.join(cacheDirectory, fileName),
    options,
  );
