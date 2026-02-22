# Otimizações de Performance — Nuvia Customer Cloud

**Data**: 2026-01-10  
**Epic**: 6.3.2 — Segurança e Performance  
**Status**: ✅ Concluído

---

## 1. Índices Estratégicos no Banco de Dados

### ✅ Índices Criados

#### **profiles**
```sql
-- Índice composto para listar usuários por empresa e role
CREATE INDEX idx_profiles_empresa_role_active 
  ON profiles(empresa_id, role, created_at DESC) 
  WHERE empresa_id IS NOT NULL;
```
**Uso**: Listagem de usuários por empresa, filtro por role, ordenação por data.

#### **agentes_ia**
```sql
-- Índice composto para listagem ordenada por empresa
CREATE INDEX idx_agentes_ia_empresa_status_created 
  ON agentes_ia(empresa_id, status, created_at DESC) 
  WHERE empresa_id IS NOT NULL;
```
**Uso**: Listagem de agentes por empresa e status, ordenação por data.

#### **conversations**
```sql
-- Índice para listagem recente por empresa
CREATE INDEX idx_conversations_empresa_created 
  ON conversations(empresa_id, created_at DESC) 
  WHERE empresa_id IS NOT NULL;

-- Índice para conversas ativas por empresa
CREATE INDEX idx_conversations_empresa_status_created 
  ON conversations(empresa_id, status, created_at DESC) 
  WHERE empresa_id IS NOT NULL AND status IN ('open', 'pending');
```
**Uso**: Listagem de conversas recentes, filtro por status ativo.

#### **auditoria**
```sql
-- Índice composto para logs ordenados por empresa
CREATE INDEX idx_auditoria_empresa_created_desc 
  ON auditoria(empresa_id, created_at DESC) 
  WHERE empresa_id IS NOT NULL;
```
**Uso**: Listagem de logs de auditoria por empresa, ordenação por data.

#### **empresas**
```sql
-- Índice composto para listagem com filtros comuns
CREATE INDEX idx_empresas_status_active_created 
  ON empresas(status, is_active, created_at DESC) 
  WHERE is_active = true;
```
**Uso**: Listagem de empresas ativas, filtro por status.

### 📊 Impacto Esperado

- **Queries de listagem**: Redução de 50-80% no tempo de execução
- **Queries com ordenação**: Redução de 60-90% no tempo de execução
- **Queries com filtros compostos**: Redução de 70-95% no tempo de execução

### ⚠️ Monitoramento

- Monitorar uso de índices via `pg_stat_user_indexes`
- Verificar se índices não utilizados podem ser removidos
- Ajustar índices conforme padrões de acesso mudam

---

## 2. React Query — Configuração Global

### ✅ Configuração Otimizada

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutos - dados considerados frescos
      gcTime: 10 * 60 * 1000,          // 10 minutos - tempo de cache
      retry: (failureCount, error) => {
        // Não retry em erros 4xx (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry até 2 vezes para erros de rede/5xx
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,      // Evitar refetch desnecessário
      refetchOnMount: true,            // Refetch ao montar (garante dados atualizados)
      refetchOnReconnect: true,        // Refetch ao reconectar
    },
    mutations: {
      retry: 0,                        // Nunca retry mutations
    },
  },
});
```

### 📊 Benefícios

- **Redução de requisições**: Cache de 5 minutos reduz requisições duplicadas
- **Melhor UX**: Dados carregam instantaneamente do cache quando disponíveis
- **Retry inteligente**: Não tenta novamente em erros de validação (4xx)
- **Sem loops**: `refetchOnWindowFocus: false` evita refetch excessivo

### ⚠️ Boas Práticas

1. **Usar `queryKey` específicos**
   ```typescript
   // ✅ Bom
   ['empresa', empresaId]
   ['agentes', empresaId, status]
   
   // ❌ Ruim
   ['data']
   ```

2. **Invalidar cache quando necessário**
   ```typescript
   queryClient.invalidateQueries({ queryKey: ['agentes', empresaId] });
   ```

3. **Usar `enabled` para queries condicionais**
   ```typescript
   enabled: !!empresaId && isAuthenticated
   ```

---

## 3. Lazy Loading de Rotas

### ✅ Implementação

**Antes** (carregamento síncrono):
```typescript
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
// ... todas as páginas carregadas no bundle inicial
```

**Depois** (lazy loading):
```typescript
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));
// ... páginas carregadas sob demanda
```

### 📊 Páginas com Lazy Loading

✅ **Todas as páginas protegidas** (exceto Landing, Auth, NotFound)

- Dashboard
- Settings
- Admin
- Analytics
- Billing
- TeamManagement
- E todas as outras páginas do dashboard

### 📊 Impacto Esperado

- **Bundle inicial**: Redução de 60-80% no tamanho
- **Tempo de carregamento inicial**: Redução de 50-70%
- **Time to Interactive (TTI)**: Redução de 40-60%

### ⚠️ Fallback de Loading

```typescript
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
    <p>Carregando...</p>
  </div>
);
```

Todas as rotas lazy-loaded usam `<Suspense fallback={<PageLoader />}>` para melhor UX durante o carregamento.

---

## 4. Otimizações Adicionais

### ✅ Code Splitting Automático

- Vite faz code splitting automático por rotas (lazy loading)
- Chunks separados por página reduzem bundle inicial

### ⚠️ Recomendações Futuras

1. **Image Optimization**
   - Usar `vite-imagetools` para otimizar imagens
   - Lazy load de imagens abaixo da dobra

2. **Bundle Analysis**
   - Rodar `pnpm build --analyze` periodicamente
   - Identificar e remover dependências não utilizadas

3. **Service Worker (PWA)**
   - Implementar service worker para cache offline
   - Reduzir requisições de rede para assets estáticos

4. **Virtual Scrolling**
   - Implementar virtual scrolling em listas longas (ex: conversas, logs)
   - Reduzir renderização de componentes fora da viewport

5. **Memoização de Componentes Pesados**
   - Usar `React.memo()` em componentes que renderizam frequentemente
   - Usar `useMemo()` e `useCallback()` para evitar recálculos

---

## 5. Métricas de Performance

### 📊 Métricas Esperadas

| Métrica | Antes | Depois | Melhoria |
|---|---|---|---|
| Bundle inicial | ~800KB | ~300KB | 62% ↓ |
| First Contentful Paint | ~2.5s | ~1.2s | 52% ↓ |
| Time to Interactive | ~4.0s | ~2.0s | 50% ↓ |
| Query response time | ~200ms | ~50ms | 75% ↓ |

### ⚠️ Como Medir

1. **Lighthouse** (Chrome DevTools)
   - Rodar em modo Production
   - Verificar Performance score

2. **React DevTools Profiler**
   - Identificar componentes que renderizam frequentemente
   - Otimizar com memoização

3. **Network Tab**
   - Verificar tamanho dos chunks
   - Verificar tempo de carregamento de assets

---

## 6. Checklist de Performance

- [x] Índices estratégicos criados no banco
- [x] React Query configurado com cache inteligente
- [x] Lazy loading implementado em todas as rotas protegidas
- [x] Fallback de loading para melhor UX
- [ ] Image optimization (pendente)
- [ ] Bundle analysis periódico (pendente)
- [ ] Service Worker / PWA (pendente)
- [ ] Virtual scrolling em listas longas (pendente)

---

## 7. Próximos Passos

1. **Monitorar métricas de performance em produção**
2. **Implementar image optimization**
3. **Configurar bundle analysis no CI/CD**
4. **Considerar PWA para melhor experiência offline**

---

**Conclusão**: As otimizações implementadas (índices, React Query, lazy loading) devem resultar em melhorias significativas de performance. Monitorar métricas em produção e iterar conforme necessário.
