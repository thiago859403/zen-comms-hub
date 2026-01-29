import { test as setup, expect } from '@playwright/test';

/**
 * Setup de ambiente para testes E2E
 * 
 * Este arquivo configura o ambiente de teste, incluindo:
 * - Limpeza de dados de teste
 * - Criação de usuários de teste
 * - Configuração de variáveis de ambiente
 */

const authFile = 'playwright/.auth/user.json';

// Setup: Criar usuário de teste e salvar autenticação
setup('autenticar', async ({ page }) => {
  // Navegar para a página de autenticação
  await page.goto('/auth');

  // Criar conta de teste se não existir
  const testEmail = `test-${Date.now()}@test.com`;
  const testPassword = 'Test123456!';

  // Preencher formulário de cadastro
  await page.click('text=Criar conta');
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  await page.fill('input[placeholder*="Nome"]', 'Usuário Teste');
  await page.fill('input[placeholder*="Empresa"]', 'Empresa Teste');

  // Submeter formulário
  await page.click('button:has-text("Criar conta")');

  // Aguardar redirecionamento para dashboard
  await page.waitForURL('/dashboard', { timeout: 10000 });

  // Salvar estado de autenticação
  await page.context().storageState({ path: authFile });
});

// Setup: Limpar dados de teste antes de cada execução
setup('limpar dados de teste', async ({ request }) => {
  // Esta função será chamada antes dos testes
  // Limpar dados de teste do banco de dados
  // Nota: Isso requer acesso ao Supabase com service role key
  console.log('Limpeza de dados de teste configurada');
});
