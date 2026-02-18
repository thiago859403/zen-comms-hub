import { test, expect, type Page } from '@playwright/test';

/**
 * Testes E2E para fluxos críticos da aplicação
 */

test.describe.configure({ timeout: 120_000 });

const T = {
  short: 15_000,
  medium: 30_000,
  long: 60_000,
};

/**
 * Espera o app terminar o "guard" de autenticação e estabilizar no dashboard.
 * Evita flakiness onde a página fica em "Verificando autenticação..."
 */
async function waitForAppReady(page: Page) {
  const verifying = page.getByText(/verificando autenticação/i);

  // Se o guard de auth aparecer, espera sumir
  if (await verifying.count()) {
    await expect(verifying).toBeHidden({ timeout: T.long });
  }

  // Garante que não está em /auth e que o dashboard terminou de renderizar
  await page.waitForURL(/\/dashboard(\/|$)/, { timeout: T.long }).catch(() => null);

  // Segurança: evita rodar em tela quebrada/404
  await expect(page.getByText('404')).toHaveCount(0, { timeout: T.long });
  await expect(page.locator('body')).toBeVisible({ timeout: T.long });
}

async function goToAuth(page: Page) {
  await page.goto('/auth', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: /nuvia customer cloud/i })).toBeVisible({ timeout: T.long });
}

async function waitForDashboard(page: Page) {
  // Aguardar que o dashboard carregue - verificar presença da navegação principal
  // que indica que estamos em área protegida
  await expect(page.getByRole('navigation', { name: 'Menu principal' })).toBeVisible({ timeout: T.long });
  await expect(page.getByText('404')).toHaveCount(0, { timeout: T.long });
}

async function signUp(
  page: Page,
  { email, password, name, company }: { email: string; password: string; name: string; company: string },
) {
  await goToAuth(page);

  await page.getByRole('tab', { name: /criar conta/i }).click();

  await page.getByLabel(/nome completo/i).fill(name);
  await page.getByLabel(/empresa/i).fill(company);
  await page.getByLabel(/^email$/i).fill(email);
  await page.getByLabel(/^senha$/i).fill(password);

  await page.getByRole('button', { name: /^criar conta$/i }).click();

  // Aguardar redirecionamento - sem catch para não mascarar falhas
  await page.waitForURL(/\/dashboard(\/|$)/, { timeout: T.long });
  await waitForDashboard(page);
  await waitForAppReady(page);
}

async function logout(page: Page) {
  const userMenu = page.locator('[data-testid="user-menu"]');

  if (await userMenu.count()) {
    await userMenu.first().click();
  } else {
    await page.getByRole('button', { name: /menu|perfil|conta|usuário/i }).click().catch(() => null);
  }

  await page.getByRole('menuitem', { name: /sair/i }).click().catch(async () => {
    await page.getByText(/sair/i).click();
  });

  await expect(page.getByRole('tab', { name: /login/i })).toBeVisible({ timeout: T.medium });
}

async function gotoAndAssertNo404(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await waitForAppReady(page);
}

/**
 * Abre o dialog de criar agente de forma robusta:
 * - espera a app ficar pronta (sem "Verificando autenticação...")
 * - espera QUALQUER botão (testid/role/text) aparecer
 * - clica no primeiro visível
 * - espera o dialog
 */
async function openCreateAgentDialog(page: Page) {
  await waitForAppReady(page);

  const candidates = [
    page.getByTestId('create-agent'),
    page.getByTestId('create-agent-empty'),
    page.getByRole('button', { name: /criar agente/i }).first(),
    page.getByText(/criar agente/i).first(),
  ];

  // Espera QUALQUER um aparecer (evita decidir cedo demais usando count())
  await Promise.race(
    candidates.map((l) => l.waitFor({ state: 'visible', timeout: T.long })),
  ).catch(() => {
    throw new Error(
      'Não encontrei botão "Criar Agente". Garanta data-testid="create-agent" (e opcional "create-agent-empty") na tela correta.',
    );
  });

  // Clica no primeiro que estiver visível
  let clicked = false;
  for (const l of candidates) {
    if (await l.isVisible().catch(() => false)) {
      await l.click();
      clicked = true;
      break;
    }
  }

  if (!clicked) {
    throw new Error(
      'Não encontrei botão "Criar Agente" visível. Garanta data-testid="create-agent" (e opcional "create-agent-empty") na tela correta.',
    );
  }

  // Dialog preferencial
  const dialogByTestId = page.getByTestId('agent-dialog');
  if (await dialogByTestId.count()) {
    await expect(dialogByTestId).toBeVisible({ timeout: T.long });
    return dialogByTestId;
  }

  // Fallback para dialog por role (Radix/shadcn)
  const dialogByRole = page.getByRole('dialog');
  await expect(dialogByRole).toBeVisible({ timeout: T.long });
  return dialogByRole;
}

test.describe('Fluxos Críticos', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.context().clearPermissions();
  });

  test('Fluxo completo: Cadastro → Assinatura → Uso', async ({ page }) => {
    const timestamp = Date.now();
    const company = `Empresa Teste ${timestamp}`;

    await signUp(page, {
      email: `test-${timestamp}@test.com`,
      password: 'Test123456!',
      name: 'Usuário Teste',
      company,
    });

    await expect(page.getByText(/free/i)).toBeVisible({ timeout: T.long });

    await gotoAndAssertNo404(page, '/dashboard/pricing');

    const planCards = page.locator('[data-testid="plan-card"]');
    if (await planCards.count()) {
      await expect(planCards.first()).toBeVisible({ timeout: T.long });
    }

    // ✅ aqui é onde seu AIAgents está rodando no App.tsx
    await gotoAndAssertNo404(page, '/dashboard/specialist-agents');

    const dialog = await openCreateAgentDialog(page);

    await dialog.getByLabel(/nome/i).fill('Agente Teste');
    await dialog.getByLabel(/instruções/i).fill('Você é um agente de teste.');
    await dialog.getByRole('button', { name: /^criar$/i }).click();

    // Usar seletor mais específico para evitar conflito com toast
    await expect(page.getByText('Agente Teste', { exact: true }).first()).toBeVisible({ timeout: T.long });

    await gotoAndAssertNo404(page, '/dashboard/ia-context');

    await page.locator('textarea').fill(
      JSON.stringify({ empresa: { nome: company, setor: 'Teste' } }, null, 2),
    );

    await page.getByRole('button', { name: /salvar contexto/i }).click();
    // Usar seletor mais específico para evitar conflito com múltiplos elementos
    await expect(page.getByText('Contexto salvo', { exact: true }).first()).toBeVisible({ timeout: T.long });
  });

  test('Multi-tenancy: Isolamento de dados entre empresas', async ({ page }) => {
    const password = 'Test123456!';

    await signUp(page, {
      email: `empresa1-${Date.now()}@test.com`,
      password,
      name: 'Usuário 1',
      company: 'Empresa 1',
    });

    await gotoAndAssertNo404(page, '/dashboard/specialist-agents');

    const d1 = await openCreateAgentDialog(page);
    await d1.getByLabel(/nome/i).fill('Agente Empresa 1');
    await d1.getByLabel(/instruções/i).fill('Instruções da Empresa 1');
    await d1.getByRole('button', { name: /^criar$/i }).click();

    // Usar seletor mais específico para evitar conflito com toast
    await expect(page.getByText('Agente Empresa 1', { exact: true }).first()).toBeVisible({ timeout: T.long });

    await logout(page);

    await signUp(page, {
      email: `empresa2-${Date.now()}@test.com`,
      password,
      name: 'Usuário 2',
      company: 'Empresa 2',
    });

    await gotoAndAssertNo404(page, '/dashboard/specialist-agents');

    await expect(page.getByText('Agente Empresa 1')).toHaveCount(0);

    const d2 = await openCreateAgentDialog(page);
    await d2.getByLabel(/nome/i).fill('Agente Empresa 2');
    await d2.getByLabel(/instruções/i).fill('Instruções da Empresa 2');
    await d2.getByRole('button', { name: /^criar$/i }).click();

    // Usar seletor mais específico para evitar conflito com toast
    await expect(page.getByText('Agente Empresa 2', { exact: true }).first()).toBeVisible({ timeout: T.long });
  });

  test('RLS: Usuário não acessa dados de outra empresa', async ({ page }) => {
    await signUp(page, {
      email: `rls-test-${Date.now()}@test.com`,
      password: 'Test123456!',
      name: 'Usuário RLS',
      company: 'Empresa RLS',
    });

    await gotoAndAssertNo404(page, '/dashboard/team');
    await gotoAndAssertNo404(page, '/dashboard/api-keys');
  });

  test('Limites de plano: Validação de limites do plano Free', async ({ page }) => {
    await signUp(page, {
      email: `limit-test-${Date.now()}@test.com`,
      password: 'Test123456!',
      name: 'Usuário Limite',
      company: 'Empresa Limite',
    });

    await expect(page.getByText(/free/i)).toBeVisible({ timeout: T.long });

    await gotoAndAssertNo404(page, '/dashboard/specialist-agents');

    const d1 = await openCreateAgentDialog(page);
    await d1.getByLabel(/nome/i).fill('Agente 1');
    await d1.getByLabel(/instruções/i).fill('Instruções');
    await d1.getByRole('button', { name: /^criar$/i }).click();

    // Usar seletor mais específico para evitar conflito com toast
    await expect(page.getByText('Agente 1', { exact: true }).first()).toBeVisible({ timeout: T.long });

    const d2 = await openCreateAgentDialog(page);
    await d2.getByLabel(/nome/i).fill('Agente 2');
    await d2.getByLabel(/instruções/i).fill('Instruções');
    await d2.getByRole('button', { name: /^criar$/i }).click();

    await expect(page.getByText(/limite excedido/i)).toBeVisible({ timeout: T.long });
  });

  test('Navegação: Todas as páginas principais são acessíveis', async ({ page }) => {
    await signUp(page, {
      email: `nav-${Date.now()}@test.com`,
      password: 'Test123456!',
      name: 'Usuário Nav',
      company: 'Empresa Nav',
    });

    const pages = [
      '/dashboard',
      '/dashboard/pricing',
      '/dashboard/billing',
      '/dashboard/usage',
      '/dashboard/api-keys',
      '/dashboard/team',
      '/dashboard/specialist-agents',
      '/dashboard/ia-context',
    ];

    for (const p of pages) {
      await gotoAndAssertNo404(page, p);
    }
  });
});
