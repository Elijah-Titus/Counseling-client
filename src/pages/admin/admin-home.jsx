import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";
import Button from "../../components/ui/button";
import { logout } from "../../api/auth";
import { getStoredUser } from "../../utils/token";

export default function AdminHome() {
  const navigate = useNavigate();
  const name = getStoredUser()?.name;

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(to_bottom,#dbeafe,#e8efff,#eef2ff)] px-6">
      <div className="w-full max-w-lg rounded-3xl border border-white/60 bg-white/70 p-10 text-center shadow-xl backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <ShieldCheck size={30} />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold text-blue-950">
          Admin area <span className="text-indigo-500">coming next</span>
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          {name ? `You're signed in as ${name}. ` : "You're signed in. "}
          The counselor management tools are the next thing we're building.
        </p>
        <Button onClick={handleLogout} className="mt-8">
          <LogOut size={16} /> Sign out
        </Button>
      </div>
    </div>
  );
}