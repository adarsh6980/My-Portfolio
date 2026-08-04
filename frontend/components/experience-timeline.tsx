import { PORTFOLIO_DATA } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function ExperienceTimeline() {
  return (
    <section id="experience" className="mx-auto max-w-4xl px-4 py-20 sm:px-8">
      <SectionHeading eyebrow="Experience" title="Where I've worked and studied" />
      <ol className="relative border-l border-white/10 pl-8">
        {PORTFOLIO_DATA.experience.map((item, i) => (
          <Reveal key={item.role} delay={i * 0.1}>
            <li className="mb-12 last:mb-0">
              <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-accent" />
              <p className="font-mono text-xs uppercase tracking-wider text-accent">{item.period}</p>
              <h3 className="mt-1 font-display text-lg font-bold text-ink">{item.role}</h3>
              <p className="text-sm font-medium text-muted">{item.organisation}</p>
              <p className="mt-2 text-sm text-muted">{item.summary}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
