import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../ui/logo";
import Button from "../ui/button";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Resources", to: "/resources" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `pb-1 text-sm font-medium transition ${
      isActive
        ? "border-b-2 border-indigo-600 text-indigo-600"
        : "text-blue-950 hover:text-indigo-600"
    }`;

  return (
    <header className="sticky top-0 z-50">
      {/* The bar itself */}
      <div
        className={`border-b backdrop-blur-md transition-all duration-300 ${
          scrolled ? "border-white/40 bg-white/50 shadow-sm" : "border-transparent bg-white/25"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
            <Button to="/login" size="sm">
              Login
            </Button>
          </nav>

          <button
            className="text-blue-950 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Phone menu: floats over the page */}
      {open && (
        <nav className="absolute inset-x-0 top-full mx-6 mt-2 flex flex-col gap-4 rounded-2xl border border-white/50 bg-white/60 p-6 shadow-lg backdrop-blur-xl md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-blue-950"
            >
              {link.label}
            </NavLink>
          ))}
          <Button to="/login" size="sm" onClick={() => setOpen(false)}>
            Login
          </Button>
        </nav>
      )}
    </header>
  );
}