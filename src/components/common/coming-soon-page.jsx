import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, KeyRound, LogOut } from "lucide-react";
import Logo from "../ui/logo";
import Button from "../ui/button";
import ConfirmDialog from "./confirm-dialog";
import { logout } from "../../api/auth";
import { getStoredUser } from "../../utils/token";

export default function ComingSoonPage({ heading, accent, message }) {
  const navigate = useNavigate();
  const firstName = getStoredUser()?.name?.split(" ")[0];
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLogoutLoading(false);
      setLogoutDialogOpen(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[linear-gradient(to_bottom,#dbeafe,#e8efff,#eef2ff)] px-6 py-8 text-slate-700">
      <div className="absolute -left-20 top-40 h-64 w-64 rounded-full bg-indigo-300/40" />
      <div className="absolute -right-16 bottom-24 h-56 w-56 rounded-[40%_60%_55%_45%] bg-violet-300/40" />

      <Link to="/" className="relative w-fit">
        <Logo />
      </Link>

      <div className="relative flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-lg rounded-3xl border border-white/60 bg-white/70 p-8 text-center shadow-xl backdrop-blur-xl sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <Clock size={30} />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-blue-950">
            {heading} <span className="text-indigo-500">{accent}</span>
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {firstName ? `Welcome to MindWell, ${firstName}. ` : "Welcome to MindWell. "}
            {message}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/change-password" variant="outline">
              <KeyRound size={16} /> Change password
            </Button>
            <Button onClick={() => setLogoutDialogOpen(true)}>
              <LogOut size={16} /> Sign out
            </Button>
          </div>
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