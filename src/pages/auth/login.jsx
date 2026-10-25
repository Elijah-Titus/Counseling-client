import { Navigate } from "react-router-dom";
import LoginForm from "../../features/auth/login-form";
import { getStoredUser, isLoggedIn } from "../../utils/token";
import { getHomePath, ROLES } from "../../utils/roles";

export default function Login() {
  const user = getStoredUser();

  if (isLoggedIn() && user?.role) {
    if (user.role === ROLES.ADMIN) {
      return <Navigate to="/" replace />;
    }

    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return <LoginForm />;
}