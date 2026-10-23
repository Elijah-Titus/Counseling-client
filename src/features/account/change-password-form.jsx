import { useState } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock } from "lucide-react";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import PasswordChecklist from "../../components/ui/password-checklist";
import { changePassword } from "../../api/auth";
import { getErrorMessage } from "../../api/axios";
import { isStrongPassword } from "../../utils/password-rules";

const emptyForm = { oldPassword: "", newPassword: "", confirmPassword: "" };

export default function ChangePasswordForm() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccess(false);
  };

  const validate = () => {
    const found = {};

    if (!form.oldPassword) found.oldPassword = "Please enter your current password.";

    if (!form.newPassword) found.newPassword = "Please enter a new password.";
    else if (!isStrongPassword(form.newPassword))
      found.newPassword = "Your new password doesn't meet all the requirements yet.";
    else if (form.newPassword === form.oldPassword)
      found.newPassword = "Your new password must be different from your current one.";

    if (!form.confirmPassword) found.confirmPassword = "Please confirm your new password.";
    else if (form.confirmPassword !== form.newPassword)
      found.confirmPassword = "Passwords do not match.";

    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccess(false);

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    try {
      setLoading(true);
      await changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword });
      setForm(emptyForm);
      setSuccess(true);
    } catch (err) {
      setServerError(getErrorMessage(err, "Could not change your password. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const type = showPasswords ? "text" : "password";

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-blue-950">
        Change <span className="text-indigo-500">password</span>
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Choose a strong password that you don't use anywhere else.
      </p>

      {success && (
        <div
          role="status"
          className="mt-6 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"
        >
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>Your password has been updated.</p>
        </div>
      )}

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
          id="oldPassword"
          name="oldPassword"
          type={type}
          label="Current password"
          placeholder="Your current password"
          autoComplete="current-password"
          icon={KeyRound}
          value={form.oldPassword}
          onChange={handleChange}
          error={errors.oldPassword}
          right={
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
              className="text-slate-400 transition hover:text-indigo-600"
            >
              {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <div>
          <Input
            id="newPassword"
            name="newPassword"
            type={type}
            label="New password"
            placeholder="Create a new password"
            autoComplete="new-password"
            icon={Lock}
            value={form.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
          />
          <PasswordChecklist password={form.newPassword} />
        </div>

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={type}
          label="Confirm new password"
          placeholder="Repeat the new password"
          autoComplete="new-password"
          icon={Lock}
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Updating...
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </form>
    </div>
  );
}