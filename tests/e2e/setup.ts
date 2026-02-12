import { test as setup } from '@playwright/test';

/**
 * Setup de ambiente para testes E2E
 *
 * Cada spec faz seu próprio signUp(), então o setup global
 * serve apenas para validações de pré-condição do ambiente.
 */

setup('ambiente pronto', async () => {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://127.0.0.1:4173';
  console.log(`[setup] PLAYWRIGHT_TEST_BASE_URL = ${baseURL}`);
  console.log('[setup] Ambiente de teste configurado — cada spec faz seu próprio signUp().');
});
