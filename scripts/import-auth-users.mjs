/**
 * Importa usuários via Auth Admin API (service role).
 * Ajusta handle_new_user para ON CONFLICT antes do import.
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const env = {};
  const p = resolve(root, ".env.local");
  if (!existsSync(p)) return env;
  for (const line of readFileSync(p, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY + .env.local necessários");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEMP_PASSWORD = "NuviaCloud@Restore2026!";

const users = [
  {
    id: "2f6a658e-51cb-411f-8d4f-60316cfe491a",
    email: "marcioteste1@gmail.com",
    user_metadata: {
      full_name: "Marcio Vinicios Santos",
      company: "WorkShopping",
    },
  },
  {
    id: "f893837c-d4b8-40da-9729-0b8c988fac56",
    email: "nuviaadmcloud859402@nuvia.com",
    user_metadata: {},
  },
  {
    id: "755ac4fc-2b9f-4f13-a97d-103cd32e5cf2",
    email: "amilton@gmail.com",
    user_metadata: { full_name: "Amillton santos", company: "ppWord" },
  },
  {
    id: "740e9942-1742-4743-a450-f9efacc73bf4",
    email: "henriquesantos@gmail.com",
    user_metadata: { full_name: "Matheus Henrique Santos", company: "HenriWORK" },
  },
];

console.log("\n=== Import auth.users (Admin API) ===\n");

const { data: list } = await admin.auth.admin.listUsers({ perPage: 100 });
const existing = new Map((list?.users ?? []).map((u) => [u.id, u]));

for (const u of users) {
  if (existing.has(u.id)) {
    console.log(`  SKIP ${u.email} (auth já existe)`);
    continue;
  }

  const { data, error } = await admin.auth.admin.createUser({
    id: u.id,
    email: u.email,
    password: TEMP_PASSWORD,
    email_confirm: true,
    user_metadata: u.user_metadata,
  });

  if (error) {
    console.log(`  ERRO ${u.email}: ${error.message}`);
  } else {
    console.log(`  OK   ${u.email}`);
    existing.set(u.id, data.user);
  }
}

// Sync master roles
for (const id of ["2f6a658e-51cb-411f-8d4f-60316cfe491a", "f893837c-d4b8-40da-9729-0b8c988fac56"]) {
  const { data: row } = await admin.from("user_roles").select("id, role").eq("user_id", id).maybeSingle();
  if (row) {
    await admin.from("user_roles").update({ role: "master" }).eq("user_id", id);
  } else {
    await admin.from("user_roles").insert({ user_id: id, role: "master" });
  }
}

const { data: final } = await admin.auth.admin.listUsers({ perPage: 100 });
console.log(`\nTotal Auth: ${final?.users?.length ?? 0}`);
console.log(`Senha temporária para todos os novos usuários: ${TEMP_PASSWORD}`);
console.log("(Altere após primeiro login ou use reset de senha no Dashboard)\n");
