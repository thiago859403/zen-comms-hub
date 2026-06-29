import { expect, type Page } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

export const T = {
  short: 15_000,
  medium: 30_000,
  long: 60_000,
};

const DEFAULT_PASSWORD = 'Test123456!';

/** Domínio aceito pelo Auth do projeto restaurado (test.com e example.com são bloqueados). */
export function uniqueTestEmail(prefix = 'e2e'): string {
  const domain = process.env.E2E_EMAIL_DOMAIN || 'nuvia.com';
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${suffix}@${domain}`;
}

function getSupabaseConfig() {
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { url, anonKey, serviceKey };
}

/** Cria usuário via Admin API (CI) — evita bloqueio de @test.com e rate limit do signup público. */
export async function createUserViaAdmin(options: {
  email: string;
  password: string;
  fullName: string;
  company?: string;
}): Promise<boolean> {
  const { url, serviceKey } = getSupabaseConfig();
  if (!url || !serviceKey) return false;

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error } = await admin.auth.admin.createUser({
    email: options.email,
    password: options.password,
    email_confirm: true,
    user_metadata: {
      full_name: options.fullName,
      company: options.company || '',
    },
  });

  if (error) {
    if (/already|registered|exists/i.test(error.message)) return true;
    throw new Error(`Admin createUser falhou: ${error.message}`);
  }

  // Aguardar trigger handle_new_user + profile
  await new Promise((r) => setTimeout(r, 800));
  return true;
}

export async function waitForAppReady(page: Page) {
  const verifying = page.getByText(/verificando autenticação/i);
  if (await verifying.count()) {
    await expect(verifying).toBeHidden({ timeout: T.long });
  }
  await page.waitForURL(/\/dashboard(\/|$)/, { timeout: T.long }).catch(() => null);
  await expect(page.getByText('404')).toHaveCount(0, { timeout: T.medium });
  await expect(page.locator('body')).toBeVisible({ timeout: T.short });
}

export async function goToAuth(page: Page) {
  await page.goto('/auth', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: /nuvia customer cloud/i })).toBeVisible({
    timeout: T.long,
  });
}

export async function waitForDashboard(page: Page) {
  await expect(page.getByRole('navigation', { name: 'Menu principal' })).toBeVisible({
    timeout: T.long,
  });
  await expect(page.getByText('404')).toHaveCount(0, { timeout: T.medium });
}

export async function loginViaUi(page: Page, email: string, password: string) {
  await goToAuth(page);
  await page.getByRole('tab', { name: /login/i }).click();
  await page.locator('#login-email').fill(email);
  await page.locator('#login-password').fill(password);
  await page.getByRole('button', { name: /^entrar$/i }).click();
  await page.waitForURL(/\/dashboard(\/|$)/, { timeout: T.long });
  await waitForDashboard(page);
  await waitForAppReady(page);
}

async function signUpViaUi(
  page: Page,
  options: { email: string; password: string; name: string; company: string },
) {
  await goToAuth(page);
  await page.getByRole('tab', { name: /criar conta/i }).click();

  await page.locator('#signup-name').fill(options.name);
  await page.locator('#signup-company').fill(options.company);
  await page.locator('#signup-email').fill(options.email);
  await page.locator('#signup-password').fill(options.password);

  await page.getByRole('button', { name: /^criar conta$/i }).click();

  const dashboardPromise = page.waitForURL(/\/dashboard(\/|$)/, { timeout: T.long });
  const errorLocator = page.getByText(/erro ao criar conta|invalid|rate limit|não é válido/i);

  const outcome = await Promise.race([
    dashboardPromise.then(() => 'ok' as const),
    errorLocator.first().waitFor({ state: 'visible', timeout: T.long }).then(() => 'error' as const),
  ]).catch(() => 'timeout' as const);

  if (outcome === 'error' || outcome === 'timeout') {
    const toastText = (await errorLocator.first().textContent().catch(() => null)) || outcome;
    throw new Error(`Signup UI falhou para ${options.email}: ${toastText}`);
  }

  await waitForDashboard(page);
  await waitForAppReady(page);
}

/** Registra usuário de teste: Admin API (preferencial no CI) ou signup UI. */
export async function signUp(
  page: Page,
  options: {
    email?: string;
    password?: string;
    name: string;
    company: string;
    prefix?: string;
  },
) {
  const email = options.email ?? uniqueTestEmail(options.prefix ?? 'e2e');
  const password = options.password ?? DEFAULT_PASSWORD;

  const viaAdmin = await createUserViaAdmin({
    email,
    password,
    fullName: options.name,
    company: options.company,
  });

  if (viaAdmin) {
    await loginViaUi(page, email, password);
  } else {
    await signUpViaUi(page, { email, password, name: options.name, company: options.company });
  }

  return { email, password };
}

export async function logout(page: Page) {
  await page.getByTestId('user-menu').click();
  await page.getByRole('menuitem', { name: /sair/i }).click();
  await expect(page.getByRole('tab', { name: /login/i })).toBeVisible({ timeout: T.medium });
}

export async function gotoAndAssertNo404(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await waitForAppReady(page);
}

export async function openCreateAgentDialog(page: Page) {
  await waitForAppReady(page);

  const candidates = [
    page.getByTestId('create-agent'),
    page.getByTestId('create-agent-empty'),
    page.getByRole('button', { name: /criar agente/i }).first(),
  ];

  await Promise.race(
    candidates.map((locator) => locator.waitFor({ state: 'visible', timeout: T.long })),
  ).catch(() => {
    throw new Error('Botão "Criar Agente" não encontrado em /dashboard/specialist-agents');
  });

  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click();
      break;
    }
  }

  const dialog = page.getByTestId('agent-dialog');
  await expect(dialog).toBeVisible({ timeout: T.long });
  return dialog;
}
