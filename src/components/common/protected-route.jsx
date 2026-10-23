import { Navigate, useLocation } from "react-router-dom";
import SessionCheckScreen from "./session-check-screen";
import useVerifiedUser from "../../hooks/use-verified-user";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { status, retry } = useVerifiedUser();

  if (status === "signed-out") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (status !== "verified") {
    return <SessionCheckScreen error={status === "error"} onRetry={retry} />;
  }

  return children;
}