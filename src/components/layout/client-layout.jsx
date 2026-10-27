import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, CalendarPlus, MessageCircle } from "lucide-react";
import PortalSidebar from "./portal-sidebar";
import PortalHeader from "./portal-header";
import useUnreadMessages from "../../hooks/use-unread-messages";
import { logout } from "../../api/auth";
import { getStoredUser } from "../../utils/token";

export default function ClientLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unread = useUnreadMessages();

  const navItems = [
    { label: "My appointments", to: "/dashboard/appointments", icon: CalendarDays },
    { label: "Messages", to: "/dashboard/messages", icon: MessageCircle, badge: unread },
    { label: "Book a session", to: "/dashboard/book", icon: CalendarPlus },
  ];

  const user = getStoredUser();
  const title = navItems.find((item) => pathname.startsWith(item.to))?.label || "Dashboard";

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="authenticated-theme min-h-screen bg-[linear-gradient(to_bottom,#dbeafe,#e8efff,#eef2ff)] text-slate-700">
      <PortalSidebar
        items={navItems}
        user={user}
        roleLabel="Client"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="lg:pl-64">
        <PortalHeader title={title} user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}