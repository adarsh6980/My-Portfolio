import { Reveal } from "./reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal>
      <div className="max-w-2xl mb-12">
        {eyebrow && (
          <p className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 max-w-xl text-muted">{description}</p>}
      </div>
    </Reveal>
  );
}
