import { Link } from "react-router-dom";

const variants = {
  primary: "bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700",
  outline: "border border-indigo-500 text-indigo-600 hover:bg-indigo-50",
};

const sizes = {
  md: "px-7 py-3",
  sm: "px-6 py-2.5",
};

export default function Button({
  to,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}