import { Outlet, useLocation } from "react-router-dom";
import { CalendarDays, Lock, ShieldCheck, UserCheck } from "lucide-react";
import Header from "../layout/Header";

const dots =
  "absolute h-24 w-28 bg-[radial-gradient(circle,white_2.5px,transparent_2.5px)] bg-[length:16px_16px] opacity-30";

const panels = {
  "/login": {
    image: "/hero1.jpg",
    shape: "45% 55% 40% 60% / 55% 45% 55% 45%",
    gradient: "bg-[linear-gradient(135deg,#4338ca,#6366f1_55%,#818cf8)]",
    photoBg: "bg-indigo-300",
    accent: "text-indigo-200",
    muted: "text-indigo-100",
    title: ["Better Conversations.", "Healthier Minds."],
    text: "A safe space to talk, heal and grow, with professional support whenever you need it.",
    points: [{ icon: ShieldCheck, text: "Every conversation is private and confidential." }],
    decor: [
      "absolute -left-16 top-24 h-56 w-56 rounded-full bg-white/10",
      "absolute -right-10 bottom-40 h-44 w-44 rounded-[40%_60%_55%_45%] bg-white/10",
      "absolute right-16 top-16 h-20 w-20 rounded-full border-[6px] border-white/25",
      `${dots} bottom-10 left-10`,
    ],
  },
  "/register": {
    image: "/hero6.jpeg",
    shape: "60% 40% 55% 45% / 45% 55% 45% 55%",
    gradient: "bg-[linear-gradient(135deg,#5b21b6,#7c3aed_55%,#a78bfa)]",
    photoBg: "bg-violet-300",
    accent: "text-violet-200",
    muted: "text-violet-100",
    title: ["Start Your Journey.", "Feel Supported."],
    text: "Join MindWell and take the first step towards a calmer, clearer, happier you.",
    points: [
      { icon: UserCheck, text: "Licensed and experienced counselors" },
      { icon: Lock, text: "Private, secure and confidential" },
      { icon: CalendarDays, text: "Flexible online sessions, anytime" },
    ],
    decor: [
      "absolute -right-14 top-20 h-56 w-56 rotate-12 rounded-[30%] bg-white/10",
      "absolute -left-12 bottom-32 h-44 w-44 rounded-full bg-white/10",
      "absolute left-14 top-14 h-16 w-16 rotate-45 rounded-2xl border-[6px] border-white/25",
      `${dots} bottom-12 right-10`,
    ],
  },
};

export default function AuthLayout() {
  const { pathname } = useLocation();
  const panel = panels[pathname] || panels["/login"];

  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(to_bottom,#dbeafe,#e8efff,#eef2ff)] text-slate-700">
      <Header />

      <div className="grid flex-1 lg:grid-cols-2">
        {/* Left: form side */}
        <div className="flex flex-col px-6 pb-8 pt-4 sm:px-12">
          <div className="flex flex-1 items-center justify-center py-6">
            <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-xl sm:p-10">
              <Outlet />
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 lg:text-left">
            © {new Date().getFullYear()} MindWell. All rights reserved.
          </p>
        </div>

        {/* Right: photo panel (desktop only), changes per page */}
        <aside className="relative hidden lg:block lg:min-h-[42rem]">
          <div className={`absolute inset-4 overflow-hidden rounded-[2.5rem] ${panel.gradient}`}>
            {panel.decor.map((classes) => (
              <div key={classes} className={classes} />
            ))}

            <div className="relative flex h-full flex-col items-center justify-center px-12 text-center text-white">
              <div
                className={`aspect-[5/4.4] w-full max-w-xs overflow-hidden shadow-2xl ring-8 ring-white/20 ${panel.photoBg}`}
                style={{ borderRadius: panel.shape }}
              >
                <img
                  src={panel.image}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover object-top"
                />
              </div>

              <h2 className="mt-10 text-3xl font-extrabold leading-tight">
                {panel.title[0]}
                <span className={`block ${panel.accent}`}>{panel.title[1]}</span>
              </h2>
              <p className={`mt-3 max-w-sm text-sm leading-relaxed ${panel.muted}`}>
                {panel.text}
              </p>

              <ul className="mt-8 space-y-3 rounded-2xl border border-white/20 bg-white/15 px-5 py-4 text-left backdrop-blur-md">
                {panel.points.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm">
                    <Icon size={20} className="shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}