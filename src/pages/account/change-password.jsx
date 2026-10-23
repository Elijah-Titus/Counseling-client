import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "../../components/ui/logo";
import ChangePasswordForm from "../../features/account/change-password-form";
import { getStoredUser } from "../../utils/token";
import { getHomePath } from "../../utils/roles";

export default function ChangePassword() {
  const home = getHomePath(getStoredUser()?.role);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[linear-gradient(to_bottom,#dbeafe,#e8efff,#eef2ff)] px-6 py-8 text-slate-700">
      <div className="absolute -left-20 top-40 h-64 w-64 rounded-full bg-indigo-300/40" />
      <div className="absolute -right-16 bottom-24 h-56 w-56 rounded-[40%_60%_55%_45%] bg-violet-300/40" />

      <Link to="/" className="relative w-fit">
        <Logo />
      </Link>

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
    </div>
  );
}