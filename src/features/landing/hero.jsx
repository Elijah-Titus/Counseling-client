import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Sprout,
  Sun,
} from "lucide-react";
import Button from "../../components/ui/button";

const slides = [
  {
    image: "/hero1.jpg",
    alt: "A smiling woman resting her chin on her hand",
    focus: "object-top",
    shape: "45% 55% 40% 60% / 55% 45% 55% 45%",
    note: ["Your", "feelings", "are valid"],
    icon: Heart,
    bg: "bg-sky-200",
    accent: "text-indigo-500",
    noteColor: "text-indigo-600",
    dot: "bg-indigo-600",
    decor: {
      a: { left: "-10%", top: "60%", w: "42%", h: "36%", radius: "50% 50% 50% 50%", rotate: 0, color: "bg-indigo-300" },
      b: { left: "76%", top: "-9%", w: "36%", h: "30%", radius: "50% 50% 50% 50%", rotate: 0, color: "bg-indigo-400/80" },
      c: { left: "13%", top: "11%", w: "6%", h: "15%", radius: "50% 50% 50% 50%", rotate: 12, color: "bg-indigo-500/80" },
      ring: { left: "82%", top: "72%", w: "16%", h: "16%", radius: "50% 50% 50% 50%", rotate: 0, color: "border-indigo-400" },
      dots: { left: "-6%", top: "2%", w: "24%", h: "22%", color: "text-indigo-400" },
    },
  },
  {
    image: "/hero5.jpg",
    alt: "A man smiling calmly",
    focus: "object-center",
    shape: "60% 40% 55% 45% / 45% 55% 45% 55%",
    note: ["You are", "not alone"],
    icon: Sun,
    bg: "bg-teal-100",
    accent: "text-teal-500",
    noteColor: "text-teal-600",
    dot: "bg-teal-600",
    decor: {
      a: { left: "-8%", top: "62%", w: "36%", h: "36%", radius: "28% 28% 28% 28%", rotate: 18, color: "bg-teal-300" },
      b: { left: "80%", top: "-8%", w: "30%", h: "34%", radius: "50% 50% 0% 50%", rotate: 0, color: "bg-teal-400/80" },
      c: { left: "10%", top: "8%", w: "11%", h: "11%", radius: "50% 50% 50% 50%", rotate: 0, color: "bg-teal-500/80" },
      ring: { left: "84%", top: "66%", w: "15%", h: "15%", radius: "28% 28% 28% 28%", rotate: 35, color: "border-teal-400" },
      dots: { left: "74%", top: "84%", w: "24%", h: "16%", color: "text-teal-400" },
    },
  },
  {
    image: "/hero3.jpg",
    alt: "Two people having a supportive conversation",
    focus: "object-center",
    shape: "40% 60% 60% 40% / 60% 40% 50% 50%",
    note: ["Healing", "takes time"],
    icon: Sprout,
    bg: "bg-violet-100",
    accent: "text-violet-500",
    noteColor: "text-violet-600",
    dot: "bg-violet-600",
    decor: {
      a: { left: "-12%", top: "54%", w: "46%", h: "30%", radius: "60% 40% 55% 45%", rotate: -12, color: "bg-violet-300" },
      b: { left: "72%", top: "-10%", w: "40%", h: "26%", radius: "40% 60% 45% 55%", rotate: 10, color: "bg-violet-400/80" },
      c: { left: "16%", top: "9%", w: "7%", h: "17%", radius: "50% 50% 50% 50%", rotate: -30, color: "bg-violet-500/80" },
      ring: { left: "80%", top: "74%", w: "18%", h: "18%", radius: "50% 50% 50% 50%", rotate: 0, color: "border-violet-400" },
      dots: { left: "-4%", top: "76%", w: "22%", h: "22%", color: "text-violet-400" },
    },
  },
  {
    image: "/hero6.jpeg",
    alt: "A young woman looking hopeful",
    focus: "object-top",
    shape: "55% 45% 45% 55% / 40% 60% 40% 60%",
    note: ["Every step", "counts"],
    icon: Sparkles,
    bg: "bg-sky-100",
    accent: "text-sky-500",
    noteColor: "text-sky-600",
    dot: "bg-sky-600",
    decor: {
      a: { left: "-6%", top: "66%", w: "34%", h: "30%", radius: "50% 0% 50% 50%", rotate: 0, color: "bg-sky-300" },
      b: { left: "82%", top: "-6%", w: "28%", h: "34%", radius: "50% 50% 50% 0%", rotate: 0, color: "bg-sky-400/80" },
      c: { left: "12%", top: "14%", w: "9%", h: "9%", radius: "50% 50% 50% 50%", rotate: 0, color: "bg-sky-500/80" },
      ring: { left: "80%", top: "70%", w: "20%", h: "20%", radius: "0% 50% 50% 50%", rotate: 20, color: "border-sky-400" },
      dots: { left: "70%", top: "-2%", w: "20%", h: "18%", color: "text-sky-400" },
    },
  },
];

// Turns a decoration's config into inline styles. Every property is animated.
const place = (d) => ({
  left: d.left,
  top: d.top,
  width: d.w,
  height: d.h,
  borderRadius: d.radius,
  transform: `rotate(${d.rotate}deg)`,
  transition: "all 1.1s cubic-bezier(0.4, 0, 0.2, 1)",
});

export default function Hero() {
  const [active, setActive] = useState(0);
  const slide = slides[active];
  const { a, b, c, ring, dots } = slide.decor;

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [active]);

  const goTo = (index) => setActive((index + slides.length) % slides.length);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-6 md:grid-cols-2 md:gap-12">
        {/* Left: text */}
        <div>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-blue-950 sm:text-5xl lg:text-6xl">
            Better Conversations.
            <span className={`block transition-colors duration-700 ${slide.accent}`}>
              Healthier Minds.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-slate-600">
            Access professional counseling, get the support you need, and take the next step
            towards a happier, healthier you.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button to="/register">
              Get Started <ArrowRight size={16} />
            </Button>
            <Button to="/about" variant="outline">
              Learn More
            </Button>
          </div>
        </div>

        {/* Right: photo slider (shows first on phones, right side on desktop) */}
        <div className="order-first mx-auto w-full max-w-lg md:order-none">
          <div className="relative">
            {/* Decorations behind the photo */}
            <div
              className={`absolute ${dots.color} opacity-70 bg-[radial-gradient(circle,currentColor_2.5px,transparent_2.5px)] bg-[length:16px_16px]`}
              style={{
                left: dots.left,
                top: dots.top,
                width: dots.w,
                height: dots.h,
                transition: "all 1.1s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
            <div className={`absolute ${a.color}`} style={place(a)} />
            <div className={`absolute ${b.color}`} style={place(b)} />

            {/* Photo blob */}
            <div
              className={`relative aspect-[5/4.4] overflow-hidden ${slide.bg}`}
              style={{
                borderRadius: slide.shape,
                transition: "border-radius 1s ease, background-color 0.7s ease",
              }}
            >
              {slides.map((s, index) => (
                <img
                  key={s.image}
                  src={s.image}
                  alt={s.alt}
                  aria-hidden={index !== active}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${s.focus} ${
                    index === active ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            {/* Decorations in front of the photo */}
            <div className={`absolute z-10 ${c.color}`} style={place(c)} />
            <div
              className={`absolute z-10 border-[6px] ${ring.color}`}
              style={place(ring)}
            />

            {/* Handwritten note */}
            <div className="absolute -right-2 top-[22%] z-10 grid rotate-[-8deg] font-['Caveat'] text-2xl leading-6">
              {slides.map((s, index) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.image}
                    aria-hidden={index !== active}
                    className={`col-start-1 row-start-1 text-center transition-opacity duration-700 ${s.noteColor} ${
                      index === active ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {s.note.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                    <Icon size={20} className="mx-auto mt-1" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => goTo(active - 1)}
              aria-label="Previous photo"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-indigo-700 shadow-sm transition hover:bg-white"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              {slides.map((s, index) => (
                <button
                  key={s.image}
                  onClick={() => goTo(index)}
                  aria-label={`Show photo ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === active ? `w-6 ${slide.dot}` : "w-2 bg-indigo-200"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(active + 1)}
              aria-label="Next photo"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-indigo-700 shadow-sm transition hover:bg-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}