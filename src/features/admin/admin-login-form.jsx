import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { login, logout } from "../../api/auth";
import { getErrorMessage } from "../../api/axios";
import { ROLES } from "../../utils/roles";

export default function AdminLoginForm() {
  const navigate = useNavigate();
  const redirectTo = useLocation().state?.from?.pathname || "/admin";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const found = {};
    if (!form.email.trim()) found.email = "Please enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) found.email = "Enter a valid email address.";
    if (!form.password) found.password = "Please enter your password.";
    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    try {
      setLoading(true);
      const user = await login({ email: form.email.trim(), password: form.password });

      if (user.role !== ROLES.ADMIN) {
        await logout();
        setServerError("This account does not have admin access.");
        return;
      }

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err, "Unable to sign in. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-extrabold text-blue-950">Admin sign in</h1>
      <p className="mt-2 text-center text-sm text-slate-600">
        Sign in with your administrator account to manage MindWell.
      </p>

      {serverError && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="admin@example.com"
          autoComplete="email"
          icon={Mail}
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          icon={Lock}
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          right={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="text-slate-400 transition hover:text-indigo-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Signing in...
            </>
          ) : (
            "Sign in to admin"
          )}
        </Button>
      </form>
    </div>
  );
}