import { Navigate } from "react-router-dom";
import LoginForm from "../../features/auth/login-form";
import { isLoggedIn } from "../../utils/token";

export default function Login() {
  if (isLoggedIn()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginForm />;
}