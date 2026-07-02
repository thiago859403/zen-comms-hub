import { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireMaster?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false, requireMaster = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, checkRole } = useAuth();
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean | null>(null);
  const [roleCheckDone, setRoleCheckDone] = useState(false);
  const location = useLocation();
  const checkingRef = useRef(false);
  const needsRoleCheck = requireAdmin || requireMaster;

  useEffect(() => {
    if (!needsRoleCheck) {
      setHasRequiredRole(true);
      setRoleCheckDone(true);
      return;
    }

    if (!isLoading && isAuthenticated && !checkingRef.current) {
      checkingRef.current = true;

      const roleToCheck = requireMaster ? 'master' : 'admin';

      checkRole(roleToCheck)
        .then((result) => {
          setHasRequiredRole(result);
          setRoleCheckDone(true);
        })
        .catch((error) => {
          console.error('[ProtectedRoute] Error checking role:', error);
          setHasRequiredRole(false);
          setRoleCheckDone(true);
        })
        .finally(() => {
          checkingRef.current = false;
        });
    }
  }, [isAuthenticated, isLoading, needsRoleCheck, requireAdmin, requireMaster, checkRole]);

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

  if (needsRoleCheck && !roleCheckDone) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (needsRoleCheck && !hasRequiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
