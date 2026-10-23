import { Navigate, useLocation } from "react-router-dom";
import SessionCheckScreen from "./session-check-screen";
import useVerifiedUser from "../../hooks/use-verified-user";
import { getHomePath } from "../../utils/roles";

export default function RoleRoute({ role, loginPath = "/login", children }) {
  const location = useLocation();
  const { status, user, retry } = useVerifiedUser();

  if (status === "signed-out") {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (status === "checking" || status === "error") {
    return <SessionCheckScreen error={status === "error"} onRetry={retry} />;
  }

  if (user.role !== role) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return children;
}