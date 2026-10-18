import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#dbeafe,#e8efff,#eef2ff)] text-slate-700">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}