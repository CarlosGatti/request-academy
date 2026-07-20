#!/usr/bin/env node
/**
 * Start Next.js on 3000, or 3001 if 3000 is already in use.
 */
import { createServer } from "node:net";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PREFERRED_PORT = 3000;
const FALLBACK_PORT = 3001;

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.unref();
    server.on("error", () => resolve(false));
    server.listen(port, "0.0.0.0", () => {
      server.close(() => resolve(true));
    });
  });
}

async function main() {
  const preferredFree = await isPortFree(PREFERRED_PORT);
  const port = preferredFree ? PREFERRED_PORT : FALLBACK_PORT;

  if (!preferredFree) {
    console.log(
      `Port ${PREFERRED_PORT} is in use — starting on ${FALLBACK_PORT} instead.`,
    );
  }

  const nextBin = path.join(
    __dirname,
    "..",
    "node_modules",
    "next",
    "dist",
    "bin",
    "next",
  );

  const child = spawn(
    process.execPath,
    [nextBin, "dev", "--port", String(port)],
    { stdio: "inherit", env: process.env },
  );

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
