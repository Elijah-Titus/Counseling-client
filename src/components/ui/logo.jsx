export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 48 48" className="h-11 w-11" fill="none" aria-hidden="true">
        <path
          d="M24 41C8 29 4 20 4 14a9 9 0 0 1 20-4 9 9 0 0 1 20 4c0 6-4 15-20 27Z"
          fill="#6366f1"
        />
        <path
          d="M26 44C17 37 14 32 14 28a5 5 0 0 1 10-2 5 5 0 0 1 10 2c0 4-3 9-8 16Z"
          fill="#4338ca"
          opacity="0.85"
        />
      </svg>
      <div className="leading-tight">
        <p className="text-2xl font-extrabold text-indigo-600">MindWell</p>
        <p className="text-xs text-blue-900">Counseling &amp; Support</p>
      </div>
    </div>
  );
}