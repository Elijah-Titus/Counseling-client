import { Navigate } from "react-router-dom";
import RegisterForm from "../../features/auth/register-form";
import { isLoggedIn } from "../../utils/token";

export default function Register() {
  if (isLoggedIn()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <RegisterForm />;
}