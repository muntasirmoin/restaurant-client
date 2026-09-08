import { useMeQuery } from "@/redux/features/Auth/auth.api";
import type { TRole } from "@/types";
import { type ComponentType } from "react";
import { Navigate } from "react-router-dom";
export const withAuth = (Component: ComponentType, allowedRoles?: TRole[]) => {
  return function AuthWrapper() {
    const { data, isLoading } = useMeQuery(undefined);
    if (isLoading) return null;
    if (!data?.data?.username) {
      return <Navigate to="/login" />;
    }
    if (allowedRoles && !allowedRoles.includes(data.data.role)) {
      return <Navigate to="/unauthorized" />;
    }
    return <Component />;
  };
};
