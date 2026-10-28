import { useState } from "react";
import { Star } from "lucide-react";

// Shows half stars. If you pass onChange, each star has a left half and a right half
// you can click, so 3.5 works.
export default function StarRating({ value = 0, onChange, size = 18 }) {
  const [hover, setHover] = useState(null);
  const shown = hover ?? value;

  return (
    <div
      className="inline-flex"
      onMouseLeave={() => setHover(null)}
      role={onChange ? "group" : "img"}
      aria-label={`Rating: ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.min(Math.max(shown - (star - 1), 0), 1);

        return (
          <span
            key={star}
            className="relative inline-block"
            style={{ width: size, height: size }}
          >
            <Star size={size} className="absolute inset-0 text-slate-300" />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star size={size} className="block fill-amber-400 text-amber-400" />
            </span>

            {onChange &&
              [star - 0.5, star].map((v, i) => (
                <button
                  key={v}
                  type="button"
                  aria-label={`${v} stars`}
                  onMouseEnter={() => setHover(v)}
                  onClick={() => onChange(v)}
                  className={`absolute inset-y-0 w-1/2 ${i === 0 ? "left-0" : "right-0"}`}
                />
              ))}
          </span>
        );
      })}
    </div>
  );
}