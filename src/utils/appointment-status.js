const styles = {
  indigo: "bg-indigo-100 text-indigo-700",
  emerald: "bg-emerald-100 text-emerald-700",
  slate: "bg-slate-200 text-slate-600",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
};

const hasEnded = (appointment) => Date.now() > new Date(appointment.endAt).getTime();

// A session that is still booked and hasn't finished yet
export const isUpcoming = (appointment) =>
  appointment.status === "AWAITING" && !hasEnded(appointment);

// The label and colour to show for an appointment. `viewer` is "CLIENT", "COUNSELOR" or "ADMIN".
export const getAppointmentBadge = (appointment, viewer = "CLIENT") => {
  const staff = viewer !== "CLIENT";

  switch (appointment.status) {
    case "COMPLETED":
      return { label: "Completed", style: styles.emerald };
    case "CANCELLED":
      return { label: "Cancelled", style: styles.slate };
    case "NO_SHOW":
      return { label: staff ? "Client didn't attend" : "Missed", style: styles.amber };
    default:
      break;
  }

  // Still AWAITING
  if (!hasEnded(appointment)) return { label: "Scheduled", style: styles.indigo };
  if (!staff) return { label: "Awaiting update", style: styles.amber };
  if (appointment.overdue) return { label: "Report overdue", style: styles.red };
  return { label: "Report due", style: styles.amber };
};

// A counselor can record or correct the outcome once the session has started
export const canRecordOutcome = (appointment) =>
  ["AWAITING", "COMPLETED", "NO_SHOW"].includes(appointment.status) &&
  Date.now() >= new Date(appointment.startAt).getTime();