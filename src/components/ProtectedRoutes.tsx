import { Navigate } from 'react-router-dom';

function ProtectedRoutes({ authenticated, children }: { authenticated: boolean; children: React.ReactNode }) {
  if (!authenticated) {
    return <Navigate to="/login" replace={true} />;
  }
  return <>{children}</>;
}

export default ProtectedRoutes;
