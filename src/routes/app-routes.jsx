import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../components/layout/public-layout";
import AuthLayout from "../components/layout/auth-layout";
import AdminLayout from "../components/layout/admin-layout";
import ProtectedRoute from "../components/common/protected-route";
import RoleRoute from "../components/common/role-route";
import Landing from "../pages/public/landing";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Dashboard from "../pages/dashboard/dashboard";
import CounselorHome from "../pages/counselor/counselor-home";
import ChangePassword from "../pages/account/change-password";
import AdminLogin from "../pages/admin/admin-login";
import Counselors from "../pages/admin/counselors";
import { ROLES } from "../utils/roles";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Client area */}
      <Route
        path="/dashboard"
        element={
          <RoleRoute role={ROLES.CLIENT}>
            <Dashboard />
          </RoleRoute>
        }
      />

      {/* Counselor area */}
      <Route
        path="/counselor"
        element={
          <RoleRoute role={ROLES.COUNSELOR}>
            <CounselorHome />
          </RoleRoute>
        }
      />

      {/* Any signed-in role */}
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      {/* Admin area */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RoleRoute role={ROLES.ADMIN} loginPath="/admin/login">
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/admin/counselors" replace />} />
        <Route path="counselors" element={<Counselors />} />
      </Route>
    </Routes>
  );
}