// =============================================================================
// SentryRouteTracker — Atualiza tag `route` no Sentry a cada navegação
// =============================================================================

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { updateSentryRoute } from '@/lib/sentryContext';

/**
 * Componente invisível que escuta mudanças de rota e
 * atualiza a tag `route` no Sentry automaticamente.
 *
 * Deve ser colocado dentro do BrowserRouter no App.tsx.
 */
const SentryRouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    updateSentryRoute(location.pathname);
  }, [location.pathname]);

  return null;
};

export default SentryRouteTracker;
