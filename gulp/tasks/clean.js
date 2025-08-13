import { rm } from "node:fs/promises";

export function clean(root) {
  return async function cleanTask() {
    await rm(root, { recursive: true, force: true });
  };
}
