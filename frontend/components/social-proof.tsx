import { PORTFOLIO_DATA } from "@/lib/data";
import { Reveal } from "@/components/ui/reveal";
import { Card } from "@/components/ui/card";

export function SocialProof() {
  const { achievements, testimonials } = PORTFOLIO_DATA;

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
      <div className="grid gap-6 sm:grid-cols-4">
        {achievements.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.08}>
            <div className="text-center">
              <p className="font-display text-3xl font-extrabold text-accent">{item.value}</p>
              <p className="mt-1 text-sm font-semibold text-ink">{item.label}</p>
              <p className="mt-1 text-xs text-muted">{item.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {testimonials.map((testimonial, i) => (
          <Reveal key={i} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
            <Card className="h-full border-white/10 bg-navy-card/60 p-6">
              <p className="text-sm italic text-muted">&ldquo;{testimonial.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-ink">{testimonial.name}</p>
              <p className="text-xs text-muted">{testimonial.role}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
