import { Navigate } from "react-router-dom";
import LoginForm from "../../features/auth/login-form";
import { getStoredUser, isLoggedIn } from "../../utils/token";
import { getHomePath } from "../../utils/roles";

export default function Login() {
  const user = getStoredUser();

  if (isLoggedIn() && user?.role) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return <LoginForm />;
}