import { useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "../../components/ui/modal";
import Textarea from "../../components/ui/textarea";
import Button from "../../components/ui/button";

export default function DeclineLeaveModal({
  counselorName,
  initialNote = "",
  loading,
  onSubmit,
  onClose,
}) {
  const [note, setNote] = useState(initialNote);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(note.trim());
  };

  return (
    <Modal open title="Decline leave request" onClose={loading ? () => {} : onClose}>
      <p className="text-sm leading-relaxed text-slate-600">
        {counselorName} will be notified that this request was declined. You can add a short
        note to explain why (optional).
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <Textarea
          id="decline-note"
          label="Note to the counselor"
          rows={4}
          maxLength={300}
          placeholder="For example: Please pick another day"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            disabled={loading}
            className="disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Declining...
              </>
            ) : (
              "Decline request"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}