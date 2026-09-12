interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-blush-100 bg-white/80 p-5 shadow-soft backdrop-blur-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-ink-400">{label}</p>
      <p className="mt-2 font-serif text-3xl text-ink-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-400">{hint}</p> : null}
    </div>
  );
}
