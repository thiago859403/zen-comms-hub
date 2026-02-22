// =============================================================================
// Release Config — Nuvia Customer Cloud
// =============================================================================
// Centraliza informações de versão e ambiente da aplicação.
// Valores injetados em build time pelo Vite via import.meta.env.
// =============================================================================

/** Versão do deploy (ex: "netlify-a1b2c3d"). Vazio em dev local. */
export const APP_VERSION: string =
  import.meta.env.VITE_APP_VERSION || 'local-dev';

/** Ambiente da aplicação (production, preview, development). */
export const APP_ENV: string =
  import.meta.env.VITE_APP_ENV || 'development';

// Log no boot — executa apenas 1 vez no import do módulo
console.log(`[Nuvia] version: ${APP_VERSION} env: ${APP_ENV}`);
