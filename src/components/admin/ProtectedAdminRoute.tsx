import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from './AdminLayout';
import { Loader2 } from 'lucide-react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      setChecking(false);
    }
  }, [loading]);

  if (checking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  // Not logged in at all
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Logged in but not admin
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin user - render with admin layout
  return <AdminLayout>{children}</AdminLayout>;
};

export default ProtectedAdminRoute;
