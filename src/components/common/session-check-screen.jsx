import { AlertCircle, Loader2 } from "lucide-react";
import Button from "../ui/button";

export default function SessionCheckScreen({ error = false, onRetry }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(to_bottom,#dbeafe,#e8efff,#eef2ff)] px-6">
      {error ? (
        <div className="w-full max-w-sm rounded-3xl border border-white/60 bg-white/70 p-8 text-center shadow-xl backdrop-blur-xl">
          <AlertCircle size={32} className="mx-auto text-red-500" />
          <h1 className="mt-4 text-xl font-extrabold text-blue-950">
            Couldn't verify your session
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Please check your connection and try again.
          </p>
          <Button onClick={onRetry} className="mt-6">
            Try again
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <Loader2 size={20} className="animate-spin text-indigo-600" />
          Checking your session...
        </div>
      )}
    </div>
  );
}