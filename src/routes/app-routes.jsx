import { Routes, Route } from "react-router-dom";
import PublicLayout from "../components/layout/public-layout";
import AuthLayout from "../components/layout/auth-layout";
import ProtectedRoute from "../components/common/protected-route";
import Landing from "../pages/public/landing";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Dashboard from "../pages/dashboard/dashboard";

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

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}