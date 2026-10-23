import { useState } from "react";
import { AlertCircle, Loader2, Mail, User } from "lucide-react";
import Modal from "../../components/ui/modal";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { createCounselor } from "../../api/admin";
import { getErrorMessage } from "../../api/axios";

export default function AddCounselorModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setForm({ name: "", email: "" });
    setErrors({});
    setServerError("");
  };

  const handleClose = () => {
    if (loading) return;
    reset();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const found = {};
    if (form.name.trim().length < 2) found.name = "Please enter the counselor's full name.";
    if (!form.email.trim()) found.email = "Please enter an email address.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) found.email = "Enter a valid email address.";
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
      const data = await createCounselor({ name: form.name.trim(), email: form.email.trim() });
      reset();
      onCreated(data);
    } catch (err) {
      setServerError(getErrorMessage(err, "Could not create the counselor. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} title="Add counselor" onClose={handleClose}>
      <p className="text-sm text-slate-600">
        A temporary password will be generated for the new counselor.
      </p>

      {serverError && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <Input
          id="counselor-name"
          name="name"
          label="Full name"
          placeholder="Counselor's full name"
          autoComplete="off"
          icon={User}
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          id="counselor-email"
          name="email"
          type="email"
          label="Email address"
          placeholder="counselor@example.com"
          autoComplete="off"
          icon={Mail}
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Creating...
              </>
            ) : (
              "Create counselor"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}