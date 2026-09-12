import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);

test(
  "the product seed runs against the current Prisma schema",
  { skip: process.env.RUN_DB_TESTS !== "1" },
  async () => {
    await execFileAsync("npm", ["run", "db:seed"], {
      cwd: process.cwd(),
      env: process.env,
    });
  },
);
