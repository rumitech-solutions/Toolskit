import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const staleFiles = ["_redirects"];

await Promise.all(
  staleFiles.map(async (file) => {
    const path = resolve("dist", file);
    await rm(path, { force: true });
    console.log(`Removed stale Cloudflare special file: dist/${file}`);
  }),
);
