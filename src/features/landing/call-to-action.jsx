import { ArrowRight, Sprout } from "lucide-react";
import Button from "../../components/ui/button";

export default function CallToAction() {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-6">
      <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-[linear-gradient(to_right,#e0e7ff,#eef2ff)] px-8 py-8 shadow-sm md:flex-row">
        <div className="flex flex-col items-center gap-5 text-center md:flex-row md:text-left">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-indigo-600 shadow">
            <Sprout size={30} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-blue-950">Your Mental Health Matters</h2>
            <p className="mt-1 text-sm text-slate-600">
              Take the first step towards a healthier, happier you.
            </p>
          </div>
        </div>

        <Button to="/register">
          Get Started <ArrowRight size={16} />
        </Button>
      </div>
    </section>
  );
}