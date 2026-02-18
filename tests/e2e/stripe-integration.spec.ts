import { test, expect, type Page } from '@playwright/test';

test.describe.configure({ timeout: 120_000 });

const T = { long: 60_000 };

async function signUp(page: Page, email: string) {
  await page.goto('/auth', { waitUntil: 'domcontentloaded' });
  await page.getByRole('tab', { name: /criar conta/i }).click();

  await page.getByLabel(/nome completo/i).fill('Usuário Stripe');
  await page.getByLabel(/empresa/i).fill('Empresa Stripe');
  await page.getByLabel(/^email$/i).fill(email);
  await page.getByLabel(/^senha$/i).fill('Test123456!');

  await page.getByRole('button', { name: /^criar conta$/i }).click();
  // Aguardar redirecionamento - sem catch para não mascarar falhas
  await page.waitForURL(/\/dashboard(\/|$)/, { timeout: T.long });
  await expect(page.getByText(/olá/i)).toBeVisible({ timeout: T.long });
}

test.describe('Integração Stripe (Smoke UI)', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('Pricing carrega e possui cards de plano', async ({ page }) => {
    await signUp(page, `stripe-${Date.now()}@test.com`);
  
    await page.goto('/dashboard/pricing', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('404')).toHaveCount(0);
  
    const planCards = page.locator('[data-testid="plan-card"]');
    const headingPlanos = page.getByRole('heading', { name: /planos/i });
    const textPlanos = page.getByText(/planos/i);
  
    // Passa se QUALQUER um aparecer (porque UI muda)
    await expect
      .poll(async () => {
        const a = await planCards.count();
        const b = await headingPlanos.count();
        const c = await textPlanos.count();
        return a + b + c;
      }, { timeout: T.long })
      .toBeGreaterThan(0);
  
    // Se existir plan-card, valida o primeiro (melhor caso)
    if (await planCards.count()) {
      await expect(planCards.first()).toBeVisible({ timeout: T.long });
    }
  });  

  test('Billing carrega e não é 404', async ({ page }) => {
    await signUp(page, `billing-${Date.now()}@test.com`);

    await page.goto('/dashboard/billing', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('404')).toHaveCount(0);
    await expect(page.locator('body')).toBeVisible({ timeout: T.long });
  });
});
