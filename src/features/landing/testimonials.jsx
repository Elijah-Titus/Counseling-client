import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { getTestimonials } from "../../api/testimonials";
import StarRating from "../../components/ui/star-rating";

const fallback = [
  {
    name: "Ada E.",
    role: "University Student",
    text: "MindWell helped me through a really difficult time. The counselor was kind, understanding and gave me the tools I needed to move forward.",
    tone: "bg-indigo-200 text-indigo-700",
  },
  {
    name: "Tunde A.",
    role: "Young Professional",
    text: "I always felt heard and supported. The sessions have made a huge difference in my mental well-being.",
    tone: "bg-blue-200 text-blue-700",
  },
  {
    name: "Blessing M.",
    role: "Working Professional",
    text: "The platform is easy to use and very convenient. I can talk to a professional from the comfort of my home.",
    tone: "bg-violet-200 text-violet-700",
  },
];

const tones = [
  "bg-indigo-200 text-indigo-700",
  "bg-blue-200 text-blue-700",
  "bg-violet-200 text-violet-700",
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;

    getTestimonials()
      .then((data) => {
        if (cancelled) return;
        // Newest first; the 3-card layout shows the latest three
        setItems(
          data.items.slice(0, 3).map((t, i) => ({
            id: t.id,
            name: t.author,
            rating: t.rating,
            text: t.content,
            tone: tones[i % tones.length],
          }))
        );
        setActive(0);
      })
      .catch(() => {}); // keep the fallback quotes if the request fails

    return () => {
      cancelled = true;
    };
  }, []);

  const testimonials = items.length > 0 ? items : fallback;

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="mx-auto mt-20 max-w-7xl px-6">
      <p className="text-xs font-semibold tracking-[0.25em] text-indigo-500">WHAT OUR USERS SAY</p>
      <h2 className="mt-2 text-3xl font-extrabold text-blue-950">
        Real People. <span className="text-indigo-500">Real Progress.</span>
      </h2>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <article
            key={item.id ?? item.name}
            className={`rounded-2xl bg-white/80 p-6 shadow-sm transition ${
              index === active ? "block md:ring-2 md:ring-indigo-200" : "hidden md:block"
            }`}
          >
            <Quote size={22} className="fill-indigo-400 text-indigo-400" />
            <p className="mt-3 text-sm leading-relaxed text-slate-600">“{item.text}”</p>

            <div className="mt-5 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${item.tone}`}
              >
                {item.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-950">{item.name}</p>
                {item.rating ? (
                  <StarRating value={item.rating} size={14} />
                ) : (
                  <p className="text-xs text-slate-500">{item.role}</p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {testimonials.map((item, index) => (
          <button
            key={item.id ?? item.name}
            onClick={() => setActive(index)}
            aria-label={`Show testimonial ${index + 1}`}
            className={`h-2 w-2 rounded-full transition ${
              index === active ? "bg-indigo-600" : "bg-indigo-200"
            }`}
          />
        ))}
      </div>
    </section>
  );
}