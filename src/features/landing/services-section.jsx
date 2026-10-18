import { ArrowRight, Brain, Users, Sprout, Sun } from "lucide-react";
import Button from "../../components/ui/Button";

const services = [
  {
    icon: Brain,
    title: "Individual Counseling",
    text: "Work through challenges and build healthier habits.",
    tone: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: Users,
    title: "Relationship Support",
    text: "Improve communication and strengthen connections.",
    tone: "bg-blue-100 text-blue-600",
  },
  {
    icon: Sprout,
    title: "Stress & Anxiety Help",
    text: "Find calm and regain control.",
    tone: "bg-teal-100 text-teal-600",
  },
  {
    icon: Sun,
    title: "Personal Growth",
    text: "Gain clarity, confidence and purpose.",
    tone: "bg-blue-100 text-blue-600",
  },
];

export default function ServicesSection() {
  return (
    <section className="mx-auto mt-20 grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
      <div>
        <p className="text-xs font-semibold tracking-[0.25em] text-indigo-500">
          WHY CHOOSE MINDWELL?
        </p>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-blue-950 sm:text-4xl">
          Professional Support.
          <span className="block text-indigo-500">Real Life Impact.</span>
        </h2>
        <p className="mt-5 max-w-md leading-relaxed text-slate-600">
          We provide a safe, confidential and supportive environment where you can talk about
          what matters. Whether you're feeling overwhelmed, anxious, stressed, or just need
          someone to listen — we're here for you.
        </p>
        <Button to="/about" className="mt-8">
          Learn More <ArrowRight size={16} />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {services.map(({ icon: Icon, title, text, tone }) => (
          <div key={title} className="rounded-2xl bg-white/70 p-6 shadow-sm">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${tone}`}>
              <Icon size={22} />
            </div>
            <h3 className="mt-4 font-bold text-blue-950">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}