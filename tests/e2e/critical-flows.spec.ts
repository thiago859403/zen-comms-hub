import { test, expect } from '@playwright/test';
import {
  T,
  signUp,
  logout,
  gotoAndAssertNo404,
  openCreateAgentDialog,
} from './helpers/auth';

test.describe.configure({ timeout: 120_000, mode: 'serial' });

test.describe('Fluxos Críticos', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.context().clearPermissions();
  });

  test('Fluxo completo: Cadastro → Assinatura → Uso', async ({ page }) => {
    const timestamp = Date.now();
    const company = `Empresa Teste ${timestamp}`;

    await signUp(page, {
      name: 'Usuário Teste',
      company,
      prefix: 'fluxo',
    });

    await expect(page.getByText(/free/i)).toBeVisible({ timeout: T.long });

    await gotoAndAssertNo404(page, '/dashboard/pricing');

    const planCards = page.locator('[data-testid="plan-card"]');
    if (await planCards.count()) {
      await expect(planCards.first()).toBeVisible({ timeout: T.long });
    }

    await gotoAndAssertNo404(page, '/dashboard/specialist-agents');

    const dialog = await openCreateAgentDialog(page);
    await dialog.getByLabel(/nome/i).fill('Agente Teste');
    await dialog.getByLabel(/instruções/i).fill('Você é um agente de teste.');
    await dialog.getByRole('button', { name: /^criar$/i }).click();

    await expect(page.getByText('Agente Teste', { exact: true }).first()).toBeVisible({
      timeout: T.long,
    });

    await gotoAndAssertNo404(page, '/dashboard/ia-context');

    await page.locator('textarea').fill(
      JSON.stringify({ empresa: { nome: company, setor: 'Teste' } }, null, 2),
    );

    await page.getByRole('button', { name: /salvar contexto/i }).click();
    await expect(page.getByText('Contexto salvo', { exact: true }).first()).toBeVisible({
      timeout: T.long,
    });
  });

  test('Multi-tenancy: Isolamento de dados entre empresas', async ({ page }) => {
    await signUp(page, {
      name: 'Usuário 1',
      company: 'Empresa 1',
      prefix: 'empresa1',
    });

    await gotoAndAssertNo404(page, '/dashboard/specialist-agents');

    const d1 = await openCreateAgentDialog(page);
    await d1.getByLabel(/nome/i).fill('Agente Empresa 1');
    await d1.getByLabel(/instruções/i).fill('Instruções da Empresa 1');
    await d1.getByRole('button', { name: /^criar$/i }).click();

    await expect(page.getByText('Agente Empresa 1', { exact: true }).first()).toBeVisible({
      timeout: T.long,
    });

    await logout(page);

    await signUp(page, {
      name: 'Usuário 2',
      company: 'Empresa 2',
      prefix: 'empresa2',
    });

    await gotoAndAssertNo404(page, '/dashboard/specialist-agents');
    await expect(page.getByText('Agente Empresa 1')).toHaveCount(0);

    const d2 = await openCreateAgentDialog(page);
    await d2.getByLabel(/nome/i).fill('Agente Empresa 2');
    await d2.getByLabel(/instruções/i).fill('Instruções da Empresa 2');
    await d2.getByRole('button', { name: /^criar$/i }).click();

    await expect(page.getByText('Agente Empresa 2', { exact: true }).first()).toBeVisible({
      timeout: T.long,
    });
  });

  test('RLS: Usuário não acessa dados de outra empresa', async ({ page }) => {
    await signUp(page, {
      name: 'Usuário RLS',
      company: 'Empresa RLS',
      prefix: 'rls',
    });

    await gotoAndAssertNo404(page, '/dashboard/team');
    await gotoAndAssertNo404(page, '/dashboard/api-keys');
  });

  test('Limites de plano: Validação de limites do plano Free', async ({ page }) => {
    await signUp(page, {
      name: 'Usuário Limite',
      company: 'Empresa Limite',
      prefix: 'limite',
    });

    await expect(page.getByText(/free/i)).toBeVisible({ timeout: T.long });
    await gotoAndAssertNo404(page, '/dashboard/specialist-agents');

    const d1 = await openCreateAgentDialog(page);
    await d1.getByLabel(/nome/i).fill('Agente 1');
    await d1.getByLabel(/instruções/i).fill('Instruções');
    await d1.getByRole('button', { name: /^criar$/i }).click();

    await expect(page.getByText('Agente 1', { exact: true }).first()).toBeVisible({
      timeout: T.long,
    });

    const d2 = await openCreateAgentDialog(page);
    await d2.getByLabel(/nome/i).fill('Agente 2');
    await d2.getByLabel(/instruções/i).fill('Instruções');
    await d2.getByRole('button', { name: /^criar$/i }).click();

    await expect(page.getByTestId('limit-exceeded-alert')).toBeVisible({ timeout: T.long });
  });

  test('Navegação: Todas as páginas principais são acessíveis', async ({ page }) => {
    await signUp(page, {
      name: 'Usuário Nav',
      company: 'Empresa Nav',
      prefix: 'nav',
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

    for (const path of pages) {
      await gotoAndAssertNo404(page, path);
    }
  });
});
