import { PORTFOLIO_DATA } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Card } from "@/components/ui/card";

export function OpenSource() {
  const { openSourceContributions, hackathons } = PORTFOLIO_DATA;
  const mergedCount = openSourceContributions.filter((c) => c.status === "Merged").length;

  return (
    <section id="open-source" className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
      <SectionHeading
        eyebrow="Community"
        title="Open source contributions & hackathons"
        description={`${mergedCount} merged pull requests to projects including dotnet/docs, ASP.NET Core Docs, xUnit and Uno Platform, plus hackathon builds.`}
      />
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-ink">
            Pull requests
          </h3>
          <ul className="space-y-3">
            {openSourceContributions.map((contribution, i) => (
              <Reveal key={contribution.url} delay={i * 0.05}>
                <a
                  href={contribution.url}
                  className="block rounded-lg border border-white/10 bg-navy-card/60 p-4 transition hover:border-accent/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-xs text-accent">{contribution.repo}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        contribution.status === "Merged"
                          ? "bg-accent/15 text-accent"
                          : "bg-white/10 text-muted"
                      }`}
                    >
                      {contribution.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink">{contribution.title}</p>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-ink">
            Hackathons
          </h3>
          <div className="space-y-4">
            {hackathons.map((hackathon, i) => (
              <Reveal key={hackathon.project} delay={i * 0.08}>
                <Card className="border-white/10 bg-navy-card/60 p-5">
                  <p className="font-mono text-xs uppercase tracking-wider text-accent">{hackathon.period}</p>
                  <h4 className="mt-1 font-display text-base font-bold text-ink">{hackathon.name}</h4>
                  <p className="mt-1 text-sm font-semibold text-muted">{hackathon.project}</p>
                  <p className="mt-2 text-sm text-muted">{hackathon.description}</p>
                  <a href={hackathon.url} className="mt-3 inline-block text-sm font-semibold text-ink hover:text-accent">
                    View project
                  </a>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
