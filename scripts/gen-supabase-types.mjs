/**
 * Regenera src/integrations/supabase/types.ts via Supabase CLI.
 * Requer SUPABASE_ACCESS_TOKEN no ambiente.
 */
import { execFileSync } from "child_process";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "src/integrations/supabase/types.ts");
const projectId = "dztevycwxlnrrvnvutyc";

const isWin = process.platform === "win32";
const cmd = isWin ? "cmd.exe" : "npx";
const args = isWin
  ? ["/c", "npx", "--yes", "supabase@2.108.0", "gen", "types", "typescript", "--project-id", projectId, "--schema", "public"]
  : ["--yes", "supabase@2.108.0", "gen", "types", "typescript", "--project-id", projectId, "--schema", "public"];

const types = execFileSync(cmd, args, {
  cwd: root,
  encoding: "utf8",
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
});

writeFileSync(out, types.replace(/^\uFEFF/, ""), "utf8");
console.log(`types.ts regenerado (${types.split("\n").length} linhas)`);
