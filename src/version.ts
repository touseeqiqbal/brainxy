import { createRequire } from "node:module";

declare const __BRAINYX_VERSION__: string | undefined;

function readVersionFromPackageJson(): string | null {
  try {
    const require = createRequire(import.meta.url);
    const pkg = require("../package.json") as { version?: string };
    return pkg.version ?? null;
  } catch {
    return null;
  }
}

// Single source of truth for the current Brainyx version.
// - Embedded/bundled builds: injected define or env var.
// - Dev/npm builds: package.json.
export const VERSION =
  (typeof __BRAINYX_VERSION__ === "string" && __BRAINYX_VERSION__) ||
  process.env.BRAINYX_BUNDLED_VERSION ||
  readVersionFromPackageJson() ||
  "0.0.0";
