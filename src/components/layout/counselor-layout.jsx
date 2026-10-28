import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, CalendarPlus, CalendarOff, MessageCircle } from "lucide-react";
import PortalSidebar from "./portal-sidebar";
import PortalHeader from "./portal-header";
import ConfirmDialog from "../common/confirm-dialog";
import { logout } from "../../api/auth";
import { getStoredUser } from "../../utils/token";
import useUnreadMessages from "../../hooks/use-unread-messages";

export default function CounselorLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const unread = useUnreadMessages();

  const navItems = [
    { label: "My appointments", to: "/counselor/appointments", icon: CalendarDays },
    { label: "New appointment", to: "/counselor/appointments/new", icon: CalendarPlus },
    { label: "Messages", to: "/counselor/messages", icon: MessageCircle, badge: unread },
    { label: "Leave", to: "/counselor/leave", icon: CalendarOff },
  ];

  const user = getStoredUser();
  const title =
    navItems
      .filter((item) => pathname.startsWith(item.to))
      .sort((a, b) => b.to.length - a.to.length)[0]?.label || "Counselor";

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLogoutLoading(false);
      setLogoutDialogOpen(false);
    }
  };

  return (
    <div className="authenticated-theme min-h-screen bg-[linear-gradient(to_bottom,#dbeafe,#e8efff,#eef2ff)] text-slate-700">
      <PortalSidebar
        items={navItems}
        user={user}
        roleLabel="Counselor"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => setLogoutDialogOpen(true)}
      />

      <div className="lg:pl-64">
        <PortalHeader title={title} user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-6 py-6">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        open={logoutDialogOpen}
        title="Sign out?"
        message="Are you sure you want to sign out of your account?"
        confirmLabel="Sign out"
        danger
        loading={logoutLoading}
        onConfirm={handleLogout}
        onCancel={() => setLogoutDialogOpen(false)}
      />
    </div>
  );
}