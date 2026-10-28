import { Link } from "react-router-dom";
import { ArrowRight, Brain, Users, Sprout } from "lucide-react";
import ImagePlaceholder from "../../components/ui/image-placeholder";

const servicesPhoto = "/service.png";

const services = [
  {
    icon: Brain,
    title: "Individual Counseling",
    text: "One-to-one sessions to work through challenges and build healthier habits.",
  },
  {
    icon: Users,
    title: "Relationship Support",
    text: "Improve communication and strengthen the connections that matter to you.",
  },
  {
    icon: Sprout,
    title: "Stress & Anxiety Help",
    text: "Find calm, learn coping tools and regain control of your days.",
  },
];

export default function ServicesShowcase() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-12">
      <h1 className="text-center text-3xl font-extrabold text-blue-950 md:text-4xl">
        Our Services
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-600">
        Whatever you are going through, there is a counselor ready to listen
        and guide you.
      </p>

      <div className="mt-10 aspect-[16/7] overflow-hidden rounded-3xl shadow-lg">
        <ImagePlaceholder
          src={servicesPhoto}
          alt="A MindWell counselor"
          label="Add a wide photo (16:7)"
        />
      </div>

      {/* Cards overlap the bottom of the image */}
      <div className="relative z-10 -mt-14 grid gap-5 px-4 md:grid-cols-3 md:px-10">
        {services.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-950 text-white">
              <Icon size={20} />
            </div>
            <h3 className="mt-4 font-bold text-blue-950">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
            <Link
              to="/register"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold tracking-wide text-indigo-600 hover:text-indigo-800"
            >
              BOOK NOW <ArrowRight size={13} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}