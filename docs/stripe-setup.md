# Configuração Stripe - Nuvia Customer Cloud

## Variáveis de Ambiente Necessárias

### Frontend (.env.local)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... ou pk_live_...
```

### Supabase Edge Functions (Secrets)
As seguintes secrets devem ser configuradas no Supabase Dashboard:

1. **STRIPE_SECRET_KEY**: Chave secreta do Stripe (sk_test_... ou sk_live_...)
2. **STRIPE_WEBHOOK_SECRET**: Secret do webhook do Stripe (whsec_...)
3. **SITE_URL**: URL base do site (ex: https://nuvia.com.br)

## Edge Functions Deployadas

### 1. stripe-create-checkout-session
- **Endpoint**: `https://[project].supabase.co/functions/v1/stripe-create-checkout-session`
- **Método**: POST
- **Autenticação**: Requerida (JWT)
- **Função**: Cria sessão de checkout do Stripe para assinatura

**Request Body:**
```json
{
  "plano_id": 1,
  "success_url": "https://nuvia.com.br/dashboard/settings?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "https://nuvia.com.br/dashboard/settings?canceled=true"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

### 2. stripe-webhook
- **Endpoint**: `https://[project].supabase.co/functions/v1/stripe-webhook`
- **Método**: POST
- **Autenticação**: Não requerida (verificação via assinatura Stripe)
- **Função**: Processa webhooks do Stripe

**Eventos Processados:**
- `checkout.session.completed`: Atualiza empresa com plano após checkout
- `customer.subscription.updated`: Atualiza plano quando subscription muda
- `customer.subscription.deleted`: Rebaixa empresa para plano Free
- `invoice.payment_failed`: Suspende empresa por falha no pagamento

## Configuração no Stripe Dashboard

1. Acesse https://dashboard.stripe.com/webhooks
2. Adicione endpoint: `https://[project].supabase.co/functions/v1/stripe-webhook`
3. Selecione eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copie o "Signing secret" e configure como `STRIPE_WEBHOOK_SECRET` no Supabase

## Configuração de Planos no Stripe

1. Crie Products no Stripe Dashboard
2. Crie Prices (mensais) para cada produto
3. Atualize a tabela `planos` com os `stripe_price_id` correspondentes

## Testes

Use o Stripe CLI para testar webhooks localmente:
```bash
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
stripe trigger checkout.session.completed
```
