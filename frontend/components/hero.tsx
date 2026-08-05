import { PORTFOLIO_DATA } from "@/lib/data";
import { Reveal } from "@/components/ui/reveal";
import { MotionLink } from "@/components/ui/motion-link";
import { LazyMount } from "@/components/ui/lazy-mount";
import { Spotlight } from "@/components/ui/spotlight";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Parallax } from "@/components/ui/parallax";

const SPLINE_SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

function SplineFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_60%_40%,rgba(212,212,216,0.18),transparent_70%)]">
      <div className="h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(212,212,216,0.35),transparent_70%)] blur-2xl" />
    </div>
  );
}

export function Hero() {
  const { profile } = PORTFOLIO_DATA;

  return (
    <section id="home" className="flex min-h-[calc(100dvh-4.75rem)] items-center px-4 py-8 sm:px-8">
      <Card className="mx-auto w-full max-w-6xl overflow-hidden border-white/10 bg-navy-panel/60">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" size={300} />
        <div className="flex flex-col md:min-h-[600px] md:flex-row">
          <div className="relative z-10 flex flex-1 flex-col justify-center gap-6 p-8 sm:p-12">
            <Reveal>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                {profile.title}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
                {profile.heroTitle}
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="max-w-xl text-muted">{profile.valueProposition}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-4 pt-2">
                <MotionLink
                  href={profile.resumePath}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-accent-button px-6 text-sm font-bold text-accent-button-foreground transition-colors hover:bg-accent-button-hover"
                >
                  Download résumé
                </MotionLink>
                <MotionLink
                  href={`mailto:${profile.email}`}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-bold text-ink transition-colors hover:bg-white/10"
                >
                  Get in touch
                </MotionLink>
              </div>
            </Reveal>
          </div>

          <div className="relative min-h-[420px] flex-1 overflow-hidden md:min-h-0 md:flex-[1.15]">
            <Parallax offset={40} className="h-full w-full">
              <LazyMount fallback={<SplineFallback />}>
                <SplineScene scene={SPLINE_SCENE_URL} className="h-full w-full" />
              </LazyMount>
            </Parallax>
          </div>
        </div>
      </Card>
    </section>
  );
}
