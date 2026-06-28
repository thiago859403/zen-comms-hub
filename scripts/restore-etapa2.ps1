# ETAPA 2 — Restauração Supabase (Nuvia Cloud)
# Projeto alvo: dztevycwxlnrrvnvutyc
#
# Pré-requisitos (defina antes de executar):
#   $env:SUPABASE_ACCESS_TOKEN = "<token do supabase.com/dashboard/account/tokens>"
#   $env:SUPABASE_DB_PASSWORD  = "<senha do banco>"   # alternativa ao token para db push
#
# Uso:
#   pwsh -File scripts/restore-etapa2.ps1

$ErrorActionPreference = "Stop"
$ProjectRef = "dztevycwxlnrrvnvutyc"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$SupabaseCli = "npx --yes supabase@2.108.0"

Write-Host "`n=== ETAPA 2: Restauracao Supabase ===" -ForegroundColor Cyan
Write-Host "Projeto: $ProjectRef`n"

# 1. Auditoria remota (anon key via .env.local)
Write-Host "[1/8] Auditoria remota..." -ForegroundColor Yellow
node scripts/audit-remote-db.mjs
if ($LASTEXITCODE -ne 0) { throw "Auditoria falhou" }

# 2. Link ao projeto
Write-Host "`n[2/8] Link Supabase CLI..." -ForegroundColor Yellow
if ($env:SUPABASE_ACCESS_TOKEN) {
  if ($env:SUPABASE_DB_PASSWORD) {
    Invoke-Expression "$SupabaseCli link --project-ref $ProjectRef --password `"$env:SUPABASE_DB_PASSWORD`""
  } else {
    Invoke-Expression "$SupabaseCli link --project-ref $ProjectRef"
  }
} elseif ($env:SUPABASE_DB_PASSWORD) {
  $DbUrl = "postgresql://postgres.$ProjectRef`:$($env:SUPABASE_DB_PASSWORD)@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  Write-Host "  Sem access token — usando db-url direto para push" -ForegroundColor DarkYellow
} else {
  throw @"
Credenciais ausentes. Defina uma das opcoes:
  `$env:SUPABASE_ACCESS_TOKEN = '<token>'
  `$env:SUPABASE_DB_PASSWORD  = '<senha DB>'  (Settings > Database no dashboard)
"@
}

# 3. Listar migrations
Write-Host "`n[3/8] Estado das migrations..." -ForegroundColor Yellow
if ($env:SUPABASE_ACCESS_TOKEN) {
  Invoke-Expression "$SupabaseCli migration list"
}

# 4. Baseline: marcar migrations PRD ja aplicadas (restore parcial do backup)
# Evita recriar planos/empresas/profiles e falha de INSERT duplicado
$BaselineMigrations = @(
  "20251103115147",
  "20260109120000",
  "20260109120001",
  "20260109120002",
  "20260109120003",
  "20260109120005",
  "20260109120006",
  "20260109120010",
  "20260110120000",
  "20260110130000"
)

Write-Host "`n[4/8] Baseline migrations (restore parcial)..." -ForegroundColor Yellow
if ($env:SUPABASE_ACCESS_TOKEN) {
  foreach ($v in $BaselineMigrations) {
    Write-Host "  repair applied: $v"
    Invoke-Expression "$SupabaseCli migration repair --status applied $v" 2>$null
  }
}

# 5. db push — aplica apenas migrations operacionais pendentes
Write-Host "`n[5/8] supabase db push..." -ForegroundColor Yellow
if ($env:SUPABASE_ACCESS_TOKEN) {
  Invoke-Expression "$SupabaseCli db push"
} else {
  Invoke-Expression "$SupabaseCli db push --db-url `"$DbUrl`""
}
if ($LASTEXITCODE -ne 0) { throw "db push falhou — verifique conflitos de schema" }

# 6. Sincronizar roles master (nao sobrescreve dados)
Write-Host "`n[6/8] Sync roles master..." -ForegroundColor Yellow
$SyncSql = @"
UPDATE public.user_roles ur
SET role = 'master'::public.app_role
FROM public.profiles p
WHERE p.id = ur.user_id AND p.role = 'master' AND ur.role <> 'master'::public.app_role;

INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'master'::public.app_role
FROM public.profiles p
WHERE p.role = 'master'
ON CONFLICT (user_id, role) DO NOTHING;
"@

if ($env:SUPABASE_DB_PASSWORD) {
  $SyncSql | & "C:\Program Files\PostgreSQL\18\bin\psql.exe" $DbUrl -v ON_ERROR_STOP=1
} else {
  Write-Host "  SQL de sync salvo em scripts/sync-master-roles.sql (aplicar manualmente se necessario)" -ForegroundColor DarkYellow
}

# 7. Regenerar types
Write-Host "`n[7/8] Regenerar types TypeScript..." -ForegroundColor Yellow
$TypesPath = "src/integrations/supabase/types.ts"
if ($env:SUPABASE_ACCESS_TOKEN) {
  Invoke-Expression "$SupabaseCli gen types typescript --project-id $ProjectRef --schema public > $TypesPath"
} else {
  Invoke-Expression "$SupabaseCli gen types typescript --db-url `"$DbUrl`" --schema public > $TypesPath"
}

# 8. Auditoria pos-restore
Write-Host "`n[8/8] Auditoria pos-restore..." -ForegroundColor Yellow
node scripts/audit-remote-db.mjs

Write-Host "`n=== Restauracao concluida ===" -ForegroundColor Green
Write-Host "Verifique .env.local aponta para $ProjectRef"
Write-Host "Pendencia: auth.users — importar do backup requer service role + psql (scripts/import-auth-users.sql)"
