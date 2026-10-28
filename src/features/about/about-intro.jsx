import { useState } from "react";
import { User } from "lucide-react";
import Button from "../../components/ui/button";
import ImagePlaceholder from "../../components/ui/image-placeholder";

const aboutPhoto = "/about.png";

const tabs = {
  Mission:
    "To make professional counseling easy to reach for everyone. We want booking a session to feel as simple and safe as sending a message to a friend.",
  Vision:
    "A community where asking for support is normal, and where every person can find a counselor they trust without long waits or confusing steps.",
  Values:
    "Confidentiality, kindness and honesty guide everything we do. Your story stays private, and you are always treated with respect.",
};

const counselors = [
  { name: "Elijah Ogah Titus", role: "Individual counseling" },
  { name: "Ochai Emmanuel", role: "Relationship support" },
  { name: "Justina Ene", role: "Stress & anxiety" },
];

export default function AboutIntro() {
  const [active, setActive] = useState("Mission");

  return (
    <section className="mx-auto grid max-w-7xl items-start gap-14 px-6 pt-16 md:grid-cols-2">
      {/* Left: text */}
      <div>
        <h1 className="text-4xl font-black leading-tight text-blue-950 md:text-5xl">
          About Us
        </h1>
        <p className="mt-3 text-xs font-semibold tracking-[0.25em] text-indigo-500">
          ABOUT MINDWELL
        </p>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-blue-950">
          We help you take the first step toward feeling better
        </h2>
        <p className="mt-5 leading-relaxed text-slate-600">
          MindWell connects you with caring, qualified counselors. Choose a
          time that suits you, meet online, and get the support you need in a
          private and judgment-free space.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {Object.keys(tabs).map((name) => (
            <button
              key={name}
              onClick={() => setActive(name)}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                active === name
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white/70 text-slate-600 hover:text-indigo-600"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <p className="mt-5 min-h-[88px] text-sm leading-relaxed text-slate-600">
          {tabs[active]}
        </p>

        <Button to="/register" className="mt-4">
          Book a session
        </Button>
      </div>

      {/* Right: image with floating card */}
      <div className="relative">
        <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-lg">
          <ImagePlaceholder
            src={aboutPhoto}
            alt="A MindWell counselor"
            label="Add a portrait photo (4:5)"
          />
        </div>

        <div className="absolute -bottom-6 left-4 w-64 rounded-2xl bg-white p-4 shadow-xl md:-left-8">
          <p className="mb-3 text-xs font-bold text-blue-950">Our counselors</p>
          <ul className="space-y-3">
            {counselors.map((c, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <User size={16} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-blue-950">{c.name}</p>
                  <p className="text-[11px] text-slate-500">{c.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}