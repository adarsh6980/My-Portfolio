import { PORTFOLIO_DATA } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Card } from "@/components/ui/card";
import { StaggerGroup, StaggerItem } from "@/components/ui/stagger";
import { Spotlight } from "@/components/ui/spotlight";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
      <SectionHeading
        eyebrow="Case studies"
        title="Projects, end to end"
        description="Each one spans the full request lifecycle, not an isolated demo."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {PORTFOLIO_DATA.projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.1}>
            <Card className="flex h-full flex-col border-white/10 bg-navy-card/60 p-6">
              <Spotlight size={220} />
              <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">{project.eyebrow}</p>
              <h3 className="mb-3 font-display text-lg font-bold text-ink">{project.title}</h3>
              <p className="mb-4 flex-1 text-sm text-muted">{project.solution}</p>
              <StaggerGroup className="mb-4 flex flex-wrap gap-2">
                {project.technologies.slice(0, 4).map((tech) => (
                  <StaggerItem
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-muted"
                  >
                    {tech}
                  </StaggerItem>
                ))}
              </StaggerGroup>
              <div className="flex gap-4 text-sm font-semibold text-ink">
                <a href={project.githubUrl} className="hover:text-accent">
                  {project.githubUrl.startsWith("[ADD") ? project.githubUrl : "GitHub"}
                </a>
                <a href={project.liveUrl} className="hover:text-accent">
                  {project.liveUrl.startsWith("[ADD") ? project.liveUrl : "Live demo"}
                </a>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
