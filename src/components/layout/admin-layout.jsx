import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import AdminSidebar from "./admin-sidebar";
import AdminHeader from "./admin-header";
import ConfirmDialog from "../common/confirm-dialog";
import { logout } from "../../api/auth";
import { getStoredUser } from "../../utils/token";

const navItems = [{ label: "Counselors", to: "/admin/counselors", icon: Users }];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const user = getStoredUser();
  const title = navItems.find((item) => pathname.startsWith(item.to))?.label || "Admin";

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } finally {
      setLogoutLoading(false);
      setLogoutDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#dbeafe,#e8efff,#eef2ff)] text-slate-700">
      <AdminSidebar
        items={navItems}
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => {
          setSidebarOpen(false);
          setLogoutDialogOpen(true);
        }}
      />

      <div className="lg:pl-64">
        <AdminHeader title={title} user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-6 py-6">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        open={logoutDialogOpen}
        title="Sign out?"
        message="Are you sure you want to sign out of your administrator account?"
        confirmLabel="Sign out"
        danger
        loading={logoutLoading}
        onConfirm={handleLogout}
        onCancel={() => setLogoutDialogOpen(false)}
      />
    </div>
  );
}