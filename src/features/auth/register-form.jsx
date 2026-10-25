import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Check,
  Circle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { register } from "../../api/auth";
import { getErrorMessage } from "../../api/axios";

const passwordRules = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /\d/.test(p) },
];

export default function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAgree = (e) => {
    setAgreed(e.target.checked);
    setErrors((prev) => ({ ...prev, agreed: "" }));
  };

  const validate = () => {
    const found = {};

    if (form.name.trim().length < 2) found.name = "Please enter your full name.";

    if (!form.email.trim()) found.email = "Please enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) found.email = "Enter a valid email address.";

    if (!form.password) found.password = "Please create a password.";
    else if (!passwordRules.every((rule) => rule.test(form.password)))
      found.password = "Your password doesn't meet all the requirements yet.";

    if (!form.confirmPassword) found.confirmPassword = "Please confirm your password.";
    else if (form.confirmPassword !== form.password)
      found.confirmPassword = "Passwords do not match.";

    if (!agreed) found.agreed = "You need to accept the terms to continue.";

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
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err, "Unable to create your account. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-blue-950">
        Create <span className="text-indigo-500">account</span>
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Take the first step towards a healthier, happier you.
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

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <Input
          id="name"
          name="name"
          type="text"
          label="Full name"
          placeholder="Your full name"
          autoComplete="name"
          icon={User}
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          icon={Mail}
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <div>
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Create a password"
            autoComplete="new-password"
            icon={Lock}
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            right={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                className="text-slate-400 transition hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {form.password && (
            <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
              {passwordRules.map((rule) => {
                const met = rule.test(form.password);
                return (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                      met ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    {met ? <Check size={13} /> : <Circle size={13} />}
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          label="Confirm password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          icon={Lock}
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <div>
          <label className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
            <input
              type="checkbox"
              checked={agreed}
              onChange={handleAgree}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-indigo-600"
            />
            <span>
              I agree to the{" "}
              <Link
                to="/terms"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.agreed && <p className="mt-1.5 text-xs text-red-600">{errors.agreed}</p>}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}