import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import Button from "../../components/ui/button";
import Textarea from "../../components/ui/textarea";
import StarRating from "../../components/ui/star-rating";
import {
  createTestimonial,
  deleteTestimonial,
  getMyTestimonial,
  updateTestimonial,
} from "../../api/testimonials";
import { getErrorMessage } from "../../api/axios";
import { getServerError } from "../../utils/server-error";
import { formatLagosDate } from "../../utils/lagos-time";

const MIN = 10;
const MAX = 1000;

export default function MyTestimonial() {
  const [mine, setMine] = useState(null); // { testimonial, canCreate }
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoadError("");
        setLoading(true);
        const data = await getMyTestimonial();
        if (cancelled) return;
        setMine(data);
        setRating(data.testimonial?.rating ?? 0);
        setContent(data.testimonial?.content ?? "");
      } catch (err) {
        if (!cancelled) {
          setLoadError(getErrorMessage(err, "Could not load your testimonial."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const existing = mine?.testimonial;
  const trimmed = content.trim();
  const unchanged = existing && rating === existing.rating && trimmed === existing.content;

  const showNotice = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(""), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating < 1) {
      setError("Please choose a rating from 1 to 5 stars.");
      return;
    }
    if (trimmed.length < MIN || trimmed.length > MAX) {
      setError(`Your testimonial must be between ${MIN} and ${MAX} characters.`);
      return;
    }

    try {
      setSaving(true);

      if (existing) {
        // Send only what changed
        const body = {};
        if (rating !== existing.rating) body.rating = rating;
        if (trimmed !== existing.content) body.content = trimmed;
        const updated = await updateTestimonial(existing.id, body);
        setMine({ testimonial: updated, canCreate: false });
        showNotice("Your testimonial was updated.");
      } else {
        const created = await createTestimonial({ rating, content: trimmed });
        setMine({ testimonial: created, canCreate: false });
        showNotice("Thank you! Your testimonial is now public.");
      }
    } catch (err) {
      setError(getServerError(err, "Could not save your testimonial."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError("");
      await deleteTestimonial(existing.id);
      setConfirmDelete(false);
      setRating(0);
      setContent("");
      showNotice("Your testimonial was deleted.");
      setReloadKey((key) => key + 1); // re-check canCreate from the server
    } catch (err) {
      setError(getServerError(err, "Could not delete your testimonial."));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 size={16} className="animate-spin" /> Loading...
      </p>
    );
  }

  if (loadError) {
    return (
      <div
        role="alert"
        className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"
      >
        <AlertCircle size={18} className="mt-0.5 shrink-0" />
        <p>{loadError}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {notice && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          <CheckCircle2 size={18} /> {notice}
        </div>
      )}

      {!existing && !mine?.canCreate ? (
        <div className="rounded-3xl bg-white/80 p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-blue-950">Share your experience</h2>
          <p className="mt-2 text-sm text-slate-600">
            You can leave a testimonial after your first completed session.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="rounded-3xl bg-white/80 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-blue-950">
            {existing ? "Your testimonial" : "Share your experience"}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Testimonials are public and show only your first name.
            {existing && ` Last updated ${formatLagosDate(existing.updatedAt)}.`}
          </p>

          {error && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="mt-5">
            <p className="mb-1.5 text-sm font-semibold text-blue-950">Rating</p>
            <div className="flex items-center gap-3">
              <StarRating
                value={rating}
                size={28}
                onChange={(value) => {
                  setRating(value);
                  setError("");
                }}
              />
              <span className="text-sm text-slate-500">
                {rating > 0 ? `${rating} / 5` : "Tap a star"}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <Textarea
              id="testimonial-content"
              label="Your words"
              rows={5}
              maxLength={MAX}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError("");
              }}
            />
          </div>

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            {existing ? (
              confirmDelete ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Delete for good?</span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setConfirmDelete(false)}
                    disabled={deleting}
                  >
                    Keep it
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Yes, delete"}
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:underline"
                >
                  <Trash2 size={15} /> Delete
                </button>
              )
            ) : (
              <span />
            )}

            <Button
              type="submit"
              disabled={saving || unchanged}
              className="disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : existing ? (
                "Save changes"
              ) : (
                "Post testimonial"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}