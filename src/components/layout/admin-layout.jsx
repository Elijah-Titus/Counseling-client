import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, Users } from "lucide-react";
import AdminSidebar from "./admin-sidebar";
import AdminHeader from "./admin-header";
import { logout } from "../../api/auth";
import { getStoredUser } from "../../utils/token";

const navItems = [
  { label: "Counselors", to: "/admin/counselors", icon: Users },
  { label: "Appointments", to: "/admin/appointments", icon: CalendarDays },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = getStoredUser();
  const title = navItems.find((item) => pathname.startsWith(item.to))?.label || "Admin";

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#dbeafe,#e8efff,#eef2ff)] text-slate-700">
      <AdminSidebar
        items={navItems}
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="lg:pl-64">
        <AdminHeader title={title} user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}