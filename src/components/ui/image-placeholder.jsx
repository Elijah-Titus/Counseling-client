import { ImageIcon } from "lucide-react";

export default function ImagePlaceholder({
  src,
  alt = "",
  label = "",
}) {
  if (src) {
    return <img src={src} alt={alt} className="h-full w-full object-cover" />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-indigo-100 via-blue-100 to-violet-100 text-indigo-400">
      <ImageIcon size={40} strokeWidth={1.5} />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}