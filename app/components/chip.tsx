type Tone = "ink" | "accent-soft" | "accent" | "danger";

const toneClasses: Record<Tone, string> = {
  ink: "bg-ink text-surface",
  "accent-soft": "bg-accent-soft text-ink",
  accent: "bg-accent text-accent-foreground",
  danger: "bg-danger text-accent-foreground",
};

export function Chip({
  children,
  tone = "ink",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-caption font-medium uppercase tracking-wider ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
