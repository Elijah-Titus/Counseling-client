import { Link } from "react-router-dom";

export default function PageBanner({ title, text, crumb }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-4">
      <div className="rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 px-6 py-14 text-center text-white shadow-lg shadow-indigo-200">
        <h1 className="text-3xl font-extrabold md:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-indigo-100">{text}</p>
        <p className="mt-5 text-xs font-medium text-indigo-200">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">{crumb}</span>
        </p>
      </div>
    </section>
  );
}