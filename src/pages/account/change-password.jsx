import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import ConfirmDialog from "../../components/common/confirm-dialog";
import Button from "../../components/ui/button";
import Logo from "../../components/ui/logo";
import ChangePasswordForm from "../../features/account/change-password-form";
import { logout } from "../../api/auth";
import { getStoredUser } from "../../utils/token";
import { getHomePath, ROLES } from "../../utils/roles";

export default function ChangePassword() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const home = getHomePath(user?.role);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      navigate(user?.role === ROLES.ADMIN ? "/admin/login" : "/login", { replace: true });
    } finally {
      setLogoutLoading(false);
      setLogoutDialogOpen(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[linear-gradient(to_bottom,#dbeafe,#e8efff,#eef2ff)] px-6 py-8 text-slate-700">
      <div className="absolute -left-20 top-40 h-64 w-64 rounded-full bg-indigo-300/40" />
      <div className="absolute -right-16 bottom-24 h-56 w-56 rounded-[40%_60%_55%_45%] bg-violet-300/40" />

      <div className="relative flex w-full items-center justify-between">
        <Link to="/" className="w-fit">
          <Logo />
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLogoutDialogOpen(true)}
        >
          <LogOut size={16} /> Sign out
        </Button>
      </div>

      <div className="relative flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-xl sm:p-10">
          <Link
            to={home}
            className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
          >
            <ArrowLeft size={14} /> Back
          </Link>
          <ChangePasswordForm />
        </div>
      </div>

      <ConfirmDialog
        open={logoutDialogOpen}
        title="Sign out?"
        message="Are you sure you want to sign out of your account?"
        confirmLabel="Sign out"
        danger
        loading={logoutLoading}
        onConfirm={handleLogout}
        onCancel={() => setLogoutDialogOpen(false)}
      />
    </div>
  );
}