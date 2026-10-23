import { Check, Circle } from "lucide-react";
import { passwordRules } from "../../utils/password-rules";

export default function PasswordChecklist({ password }) {
  if (!password) return null;

  return (
    <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
      {passwordRules.map((rule) => {
        const met = rule.test(password);
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
  );
}