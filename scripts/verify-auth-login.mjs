/** Verifica login dos usuários importados (anon key). */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const env = {};
const p = resolve(root, ".env.local");
if (existsSync(p)) {
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
}

const url = env.VITE_SUPABASE_URL;
const anon = env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const tempPass = "NuviaCloud@Restore2026!";

const client = createClient(url, anon);
const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

const masterEmail = "nuviaadmcloud859402@nuvia.com";

const { data: signIn, error: signErr } = await client.auth.signInWithPassword({
  email: masterEmail,
  password: tempPass,
});
console.log("Login master:", signErr ? `ERRO ${signErr.message}` : `OK session=${signIn.session?.access_token?.slice(0, 20)}…`);

const { data: roles } = await admin.from("user_roles").select("user_id, role").in("user_id", [
  "f893837c-d4b8-40da-9729-0b8c988fac56",
  "2f6a658e-51cb-411f-8d4f-60316cfe491a",
]);
console.log("user_roles masters:", roles);

const { data: profiles } = await admin.from("profiles").select("email, role").in("email", [masterEmail, "marcioteste1@gmail.com"]);
console.log("profiles:", profiles);
