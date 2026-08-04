import { PORTFOLIO_DATA } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Card } from "@/components/ui/card";

const FEATURED_TITLES = ["Frontend engineering", "Backend engineering", "Cloud and DevOps"];

export function FeatureCards() {
  const cards = PORTFOLIO_DATA.skillGroups.filter((group) => FEATURED_TITLES.includes(group.title));

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
      <SectionHeading
        eyebrow="What I bring"
        title="Full-stack, cloud-aware engineering"
        description="Three areas I work in day to day, each backed by named tools rather than a vague label."
      />
      <div className="grid gap-6 sm:grid-cols-3">
        {cards.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.1}>
            <Card className="h-full border-white/10 bg-navy-card/60 p-6 transition-transform hover:-translate-y-1">
              <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">{group.confidence}</p>
              <h3 className="mb-4 font-display text-xl font-bold text-ink">{group.title}</h3>
              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
