/**
 * Audita tabelas no Supabase remoto via REST (anon key).
 * Uso: node scripts/audit-remote-db.mjs
 * Lê VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY ou VITE_SUPABASE_PUBLISHABLE_KEY de .env.local
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  const files = [".env.local", ".env.local.new", ".env"];
  const env = {};
  for (const f of files) {
    const p = resolve(root, f);
    if (!existsSync(p)) continue;
    const raw = readFileSync(p, "utf8").replace(/^\uFEFF/, "");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!env[m[1]]) env[m[1]] = v;
    }
  }
  return env;
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (ou PUBLISHABLE) em .env.local");
  process.exit(1);
}

const tables = [
  "planos", "empresas", "profiles", "user_roles", "agentes_ia", "auditoria", "uso_recursos",
  "org_to_empresa_mapping", "conversations", "messages", "agents", "whatsapp_config",
  "bot_config", "bot_keywords", "api_keys", "organizations", "admin_activity_logs",
];

const headers = { apikey: key, Authorization: `Bearer ${key}` };

console.log(`\nAuditoria remota: ${url}\n`);

for (const table of tables) {
  try {
    const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, { headers });
    if (res.status === 404 || res.status === 406) {
      console.log(`  ${table.padEnd(28)} AUSENTE (${res.status})`);
      continue;
    }
    if (!res.ok) {
      const body = await res.text();
      console.log(`  ${table.padEnd(28)} ERRO ${res.status} ${body.slice(0, 80)}`);
      continue;
    }
    const data = await res.json();
    const countRes = await fetch(`${url}/rest/v1/${table}?select=*`, {
      headers: { ...headers, Prefer: "count=exact", Range: "0-0" },
    });
    const range = countRes.headers.get("content-range") || "";
    const count = range.includes("/") ? range.split("/")[1] : "?";
    console.log(`  ${table.padEnd(28)} OK (registros: ${count})`);
  } catch (e) {
    console.log(`  ${table.padEnd(28)} FALHA ${e.message}`);
  }
}
