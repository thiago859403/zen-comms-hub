import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireMasterAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false, requireMasterAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, checkRole } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (requireMasterAdmin) {
        checkRole('master')
          .then(setIsAdmin)
          .catch((error) => {
            console.error('Error checking master admin role:', error);
            setIsAdmin(false);
          });
      } else if (requireAdmin) {
        checkRole('admin')
          .then(setIsAdmin)
          .catch((error) => {
            console.error('Error checking admin role:', error);
            setIsAdmin(false);
          });
      } else {
        setIsAdmin(true);
      }
    }
  }, [isAuthenticated, isLoading, requireAdmin, requireMasterAdmin, checkRole]);

  // Show loading spinner while checking authentication
  if (isLoading || ((requireAdmin || requireMasterAdmin) && isAdmin === null)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to dashboard if admin access required but user is not admin
  if ((requireAdmin || requireMasterAdmin) && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
