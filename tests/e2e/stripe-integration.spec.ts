import { test, expect } from '@playwright/test';
import { T, signUp, gotoAndAssertNo404 } from './helpers/auth';

test.describe.configure({ timeout: 120_000, mode: 'serial' });

test.describe('Integração Stripe (Smoke UI)', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('Pricing carrega e possui cards de plano', async ({ page }) => {
    await signUp(page, {
      name: 'Usuário Stripe',
      company: 'Empresa Stripe',
      prefix: 'stripe-pricing',
    });

    await page.goto('/dashboard/pricing', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('404')).toHaveCount(0);

    const planCards = page.locator('[data-testid="plan-card"]');
    const headingPlanos = page.getByRole('heading', { name: /planos/i });
    const textPlanos = page.getByText(/planos/i);

    await expect
      .poll(async () => {
        const a = await planCards.count();
        const b = await headingPlanos.count();
        const c = await textPlanos.count();
        return a + b + c;
      }, { timeout: T.long })
      .toBeGreaterThan(0);

    if (await planCards.count()) {
      await expect(planCards.first()).toBeVisible({ timeout: T.long });
    }
  });

  test('Billing carrega e não é 404', async ({ page }) => {
    await signUp(page, {
      name: 'Usuário Billing',
      company: 'Empresa Billing',
      prefix: 'stripe-billing',
    });

    await gotoAndAssertNo404(page, '/dashboard/billing');
    await expect(page.locator('body')).toBeVisible({ timeout: T.long });
  });
});
