import { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, checkRole } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminCheckDone, setAdminCheckDone] = useState(false);
  const location = useLocation();
  const checkingRef = useRef(false);


  useEffect(() => {
    // Se não requer admin, marcar como feito
    if (!requireAdmin) {
      setIsAdmin(true);
      setAdminCheckDone(true);
      return;
    }

    // Se requer admin, verificar apenas quando autenticado e não estiver loading
    if (!isLoading && isAuthenticated && !checkingRef.current) {
      checkingRef.current = true;
      
      checkRole('admin')
        .then((result) => {
          setIsAdmin(result);
          setAdminCheckDone(true);
        })
        .catch((error) => {
          console.error('[ProtectedRoute] Error checking admin role:', error);
          setIsAdmin(false);
          setAdminCheckDone(true);
        })
        .finally(() => {
          checkingRef.current = false;
        });
    }
  }, [isAuthenticated, isLoading, requireAdmin, checkRole]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirecionar para auth se não autenticado
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Mostrar loading enquanto verifica admin (se necessário)
  if (requireAdmin && !adminCheckDone) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Redirecionar para dashboard se requer admin mas não é admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
