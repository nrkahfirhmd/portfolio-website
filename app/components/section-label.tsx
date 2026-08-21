export function SectionLabel({
  command,
  id,
}: {
  command: string;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className="font-mono text-caption font-medium uppercase tracking-wider text-ink-muted"
    >
      <span aria-hidden="true" className="mr-2 text-accent">
        ~$
      </span>
      {command}
    </h2>
  );
}
