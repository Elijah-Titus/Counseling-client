import {
  AlarmClock,
  AlertTriangle,
  Bell,
  CalendarCheck,
  CalendarClock,
  CalendarOff,
  CalendarPlus,
  CalendarX,
  FileText,
  MessageCircle,
  Shuffle,
  Video,
} from "lucide-react";

// The docs say: rely on `type`, not on the wording of `message`.
export const notificationMeta = {
  NEW_APPOINTMENT: { label: "New appointment", icon: CalendarPlus, tone: "bg-indigo-100 text-indigo-700" },
  RESCHEDULED: { label: "Rescheduled", icon: CalendarClock, tone: "bg-amber-100 text-amber-700" },
  CANCELLED: { label: "Cancelled", icon: CalendarX, tone: "bg-slate-200 text-slate-600" },
  REMINDER: { label: "Reminder", icon: AlarmClock, tone: "bg-sky-100 text-sky-700" },
  REPORT_ADDED: { label: "Report added", icon: FileText, tone: "bg-emerald-100 text-emerald-700" },
  LEAVE_APPROVED: { label: "Leave approved", icon: CalendarCheck, tone: "bg-emerald-100 text-emerald-700" },
  LEAVE_DECLINED: { label: "Leave declined", icon: CalendarOff, tone: "bg-rose-100 text-rose-700" },
  LEAVE_REQUESTED: { label: "Leave requested", icon: CalendarOff, tone: "bg-amber-100 text-amber-700" },
  REASSIGNED: { label: "Reassigned", icon: Shuffle, tone: "bg-violet-100 text-violet-700" },
  NEW_MESSAGE: { label: "New message", icon: MessageCircle, tone: "bg-indigo-100 text-indigo-700" },
  MEET_LINK_ADDED: { label: "Meet link added", icon: Video, tone: "bg-sky-100 text-sky-700" },
  REPORT_OVERDUE: { label: "Report overdue", icon: AlertTriangle, tone: "bg-rose-100 text-rose-700" },
};

export const getMeta = (type) =>
  notificationMeta[type] || { label: "Update", icon: Bell, tone: "bg-slate-100 text-slate-600" };

const leaveTypes = ["LEAVE_APPROVED", "LEAVE_DECLINED", "LEAVE_REQUESTED"];

const homeByRole = {
  CLIENT: "/dashboard",
  COUNSELOR: "/counselor",
  ADMIN: "/admin",
};

export const inboxPath = (role) => `${homeByRole[role] || "/dashboard"}/notifications`;

// Where a notification should take the person.
// Leave notifications carry no leave id, so they go to the leave list.
// New messages open that conversation.
// Admins have no appointment details page, so they go to the appointments list.
export const notificationLink = (n, role) => {
  const home = homeByRole[role] || "/dashboard";

  if (leaveTypes.includes(n.type)) {
    return role === "ADMIN" ? "/admin/leave" : "/counselor/leave";
  }
  if (!n.appointmentId) return null;
  if (n.type === "NEW_MESSAGE" && role !== "ADMIN") {
    return `${home}/messages?appointment=${n.appointmentId}`;
  }
  if (role === "ADMIN") return "/admin/appointments";
  return `${home}/appointments/${n.appointmentId}`;
};

export const timeAgo = (iso) => {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};