import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";
import Logo from "../ui/logo";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
];

const socials = [
  { label: "Facebook", icon: FaFacebookF, href: "#" },
  { label: "X", icon: FaXTwitter, href: "#" },
  { label: "Instagram", icon: FaInstagram, href: "#" },
  { label: "LinkedIn", icon: FaLinkedinIn, href: "#" },
  { label: "YouTube", icon: FaYoutube, href: "#" },
];

export default function Footer() {
  return (
    <footer className="mx-auto mt-16 max-w-7xl px-6 pb-8">
      <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <Logo />

        <nav className="flex gap-8 text-xs font-medium text-blue-950">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-indigo-600">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-3">
          {socials.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 transition hover:bg-indigo-600 hover:text-white"
            >
              <Icon size={13} />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-indigo-100 pt-5 text-xs text-slate-500 md:flex-row">
        <p>© {new Date().getFullYear()} MindWell. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy-policy" className="hover:text-indigo-600">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-indigo-600">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}