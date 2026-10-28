import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../components/layout/public-layout";
import AuthLayout from "../components/layout/auth-layout";
import ClientLayout from "../components/layout/client-layout";
import CounselorLayout from "../components/layout/counselor-layout";
import AdminLayout from "../components/layout/admin-layout";
import ProtectedRoute from "../components/common/protected-route";
import RoleRoute from "../components/common/role-route";
import Landing from "../pages/public/landing";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import MyAppointments from "../pages/client/my-appointments";
import BookAppointment from "../pages/client/book-appointment";
import MyTestimonial from "../pages/client/my-testimonial";
import CounselorAppointments from "../pages/counselor/counselor-appointments";
import AppointmentDetails from "../pages/shared/appointment-details";
import ChangePassword from "../pages/account/change-password";
import AdminLogin from "../pages/admin/admin-login";
import Counselors from "../pages/admin/counselors";
import CounselorDetails from "../pages/admin/counselor-details";
import Clients from "../pages/admin/clients";
import ClientDetails from "../pages/admin/client-details";
import AdminAppointments from "../pages/admin/appointments";
import { ROLES } from "../utils/roles";
import CounselorLeave from "../pages/counselor/counselor-leave";
import LeaveRequests from "../pages/admin/leave-requests";
import LeaveDetails from "../pages/admin/leave-details";
import Notifications from "../pages/shared/notifications";
import Messages from "../pages/shared/messages";
import About from "../pages/public/about";
import Services from "../pages/public/services";
import PrivacyPolicy from "../pages/public/privacy-policy";
import Terms from "../pages/public/terms";
import ScrollToTop from "../components/common/scroll-to-top";

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
        </Route>

        {/* Sign in and register */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Client area */}
        <Route
          path="/dashboard"
          element={
            <RoleRoute role={ROLES.CLIENT}>
              <ClientLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard/appointments" replace />} />
          <Route path="appointments" element={<MyAppointments />} />
          <Route path="appointments/:id" element={<AppointmentDetails />} />
          <Route path="messages" element={<Messages />} />
          <Route path="book" element={<BookAppointment />} />
          <Route path="testimonial" element={<MyTestimonial />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Counselor area */}
        <Route
          path="/counselor"
          element={
            <RoleRoute role={ROLES.COUNSELOR}>
              <CounselorLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/counselor/appointments" replace />} />
          <Route path="appointments" element={<CounselorAppointments />} />
          <Route path="appointments/:id" element={<AppointmentDetails />} />
          <Route path="messages" element={<Messages />} />
          <Route path="leave" element={<CounselorLeave />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Any signed-in role */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* Admin area */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RoleRoute role={ROLES.ADMIN} loginPath="/admin/login">
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/admin/counselors" replace />} />
          <Route path="counselors" element={<Counselors />} />
          <Route path="counselors/:id" element={<CounselorDetails />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<ClientDetails />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="leave" element={<LeaveRequests />} />
          <Route path="leave/:id" element={<LeaveDetails />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </>
  );
}