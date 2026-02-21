# Monitoramento — Nuvia

## Sourcemaps

### O que são e por que habilitamos

Sourcemaps (`.map`) são arquivos gerados pelo Vite durante o build que mapeiam o código minificado/bundled de volta ao código-fonte original. Com eles, stack traces no Sentry (e no DevTools do browser) mostram **linhas reais do código TypeScript/React** em vez de referências genéricas a chunks minificados.

### O que mudou

| Arquivo | Alteração |
|---|---|
| `vite.config.ts` | Adicionado `build: { sourcemap: true }` |
| `netlify.toml` | Redirect `/*.map → 404` em produção |
| `netlify.toml` | Header `X-Robots-Tag: noindex` para `/*.map` |

### Como validar

1. **Build local:**

   ```bash
   pnpm build
   ```

   Verifique que os arquivos `.map` foram gerados em `dist/assets/`:

   ```bash
   ls dist/assets/*.map
   ```

2. **Stack trace no Sentry:**

   Após deploy, provoque um erro de teste (ex: `/debug/sentry` se disponível). No painel do Sentry, o stack trace deve mostrar nomes de arquivo e linhas reais (ex: `useAuth.tsx:142`) em vez de `index-abc123.js:1:45678`.

3. **Deploy-preview / Branch-deploy:**

   Os sourcemaps ficam **acessíveis** em previews e branch deploys para facilitar debug. Teste acessando `https://<preview-url>/assets/<file>.js.map` — deve retornar o conteúdo JSON do mapa.

4. **Produção:**

   Em produção, acessar `https://<prod-url>/assets/<file>.js.map` deve retornar **404**, confirmando que o bloqueio está ativo.

### Nota de segurança

Sourcemaps contêm uma representação do código-fonte original. Expô-los publicamente em produção permitiria que qualquer pessoa visualize a lógica interna da aplicação.

Por isso:

- **Produção:** Arquivos `*.map` são bloqueados via redirect no `netlify.toml` (retornam 404).
- **Preview / Staging:** Sourcemaps ficam acessíveis para facilitar debug de deploys de teste.
- **Header `X-Robots-Tag: noindex`:** Aplicado globalmente para impedir indexação por motores de busca, mesmo em previews.

### Próximos passos (não implementados ainda)

- **Upload automático de sourcemaps para o Sentry** via `@sentry/vite-plugin` — permitiria stack traces completos no Sentry mesmo sem servir os `.map` publicamente.
- Quando implementado, os sourcemaps poderão ser removidos do bundle de deploy (`sourcemapUploadOptions.deleteAfterUpload: true`).
