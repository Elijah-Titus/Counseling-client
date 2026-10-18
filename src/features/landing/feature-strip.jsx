import { MessageCircle, User, CalendarDays, Heart } from "lucide-react";

const items = [
  {
    icon: MessageCircle,
    title: "Talk Freely",
    text: "Safe & judgment-free space",
    tone: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: User,
    title: "Expert Support",
    text: "Licensed & experienced",
    tone: "bg-blue-100 text-blue-600",
  },
  {
    icon: CalendarDays,
    title: "Flexible Access",
    text: "Online, anytime",
    tone: "bg-teal-100 text-teal-600",
  },
  {
    icon: Heart,
    title: "Build a Brighter Future",
    text: "One step at a time",
    tone: "bg-violet-100 text-violet-600",
  },
];

export default function FeatureStrip() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="grid gap-2 rounded-3xl bg-white/60 p-2 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text, tone }) => (
          <div key={title} className="rounded-2xl bg-white/70 p-6">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${tone}`}>
              <Icon size={26} />
            </div>
            <h3 className="mt-5 text-base font-bold text-blue-950">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}