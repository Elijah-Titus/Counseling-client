import { Link, Navigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import Logo from "../../components/ui/logo";
import AdminLoginForm from "../../features/admin/admin-login-form";
import { getStoredUser, isLoggedIn } from "../../utils/token";
import { ROLES } from "../../utils/roles";

export default function AdminLogin() {
  if (isLoggedIn() && getStoredUser()?.role === ROLES.ADMIN) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#0f172a,#1e1b4b_55%,#312e81)] px-6 py-10">
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-indigo-500/10" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-[40%_60%_55%_45%] bg-violet-500/10" />
      <div className="absolute right-24 top-16 h-20 w-20 rounded-full border-[6px] border-white/10" />
      <div className="absolute bottom-16 left-16 h-24 w-28 bg-[radial-gradient(circle,white_2.5px,transparent_2.5px)] bg-[length:16px_16px] opacity-10" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
          <div className="flex flex-col items-center gap-4">
            <Logo />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold tracking-widest text-indigo-700">
              <ShieldCheck size={14} /> ADMIN PORTAL
            </span>
          </div>

          <div className="mt-6">
            <AdminLoginForm />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-indigo-200/80">
          Restricted area. Authorised staff only.
        </p>
        <Link
          to="/"
          className="mt-2 block text-center text-xs font-semibold text-indigo-200 hover:text-white"
        >
          Back to website
        </Link>
      </div>
    </div>
  );
}