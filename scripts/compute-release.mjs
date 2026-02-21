#!/usr/bin/env node
// =============================================================================
// compute-release.mjs — Calcula VITE_APP_VERSION e executa o build
// =============================================================================
// Usado pelo Netlify (e CI) para injetar a versão do deploy automaticamente.
//
// Lógica:
//   1. Lê COMMIT_REF (Netlify) ou GITHUB_SHA (GitHub Actions) ou git rev-parse
//   2. Gera VITE_APP_VERSION=netlify-<short_sha>
//   3. Executa `pnpm build` com a env var setada
// =============================================================================

import { execSync } from 'node:child_process';

function getShortSha() {
  // 1. Netlify — COMMIT_REF
  if (process.env.COMMIT_REF) {
    return process.env.COMMIT_REF.slice(0, 7);
  }

  // 2. GitHub Actions — GITHUB_SHA
  if (process.env.GITHUB_SHA) {
    return process.env.GITHUB_SHA.slice(0, 7);
  }

  // 3. Fallback — git local
  try {
    const sha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    return sha.slice(0, 7);
  } catch {
    return 'unknown';
  }
}

const shortSha = getShortSha();
const version = `netlify-${shortSha}`;

console.log(`[compute-release] VITE_APP_VERSION=${version}`);
console.log(`[compute-release] VITE_APP_ENV=${process.env.VITE_APP_ENV || 'production'}`);

// Injetar env var e executar build
const env = {
  ...process.env,
  VITE_APP_VERSION: version,
};

try {
  execSync('pnpm build', {
    stdio: 'inherit',
    env,
  });
} catch (error) {
  process.exit(error.status || 1);
}
