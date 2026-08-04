"use client";

import { Reveal } from "@/components/ui/reveal";

const orbits = [
  {
    size: "w-52 h-52 sm:w-64 sm:h-64 md:w-[26rem] md:h-[26rem]",
    duration: 18,
    items: [
      { label: "Angular", angle: -60 },
      { label: "TypeScript", angle: 0 },
      { label: "Azure", angle: 60 },
    ],
  },
  {
    size: "w-72 h-72 sm:w-80 sm:h-80 md:w-[34rem] md:h-[34rem]",
    duration: 26,
    items: [
      { label: ".NET", angle: 0 },
      { label: "Docker", angle: -90 },
    ],
  },
];

export function TechOrbit() {
  return (
    <Reveal>
      <section
        aria-label="Technology stack"
        className="relative flex h-56 w-full max-w-full justify-center overflow-hidden sm:h-64 md:h-96"
      >
        <style>{`
          @keyframes orbit-cw {
            from { transform: rotate(var(--start-angle)) }
            to   { transform: rotate(calc(var(--start-angle) + 360deg)) }
          }
          @keyframes orbit-ccw {
            from { transform: rotate(var(--start-angle)) }
            to   { transform: rotate(calc(var(--start-angle) - 360deg)) }
          }
          @keyframes counter-cw {
            from { transform: rotate(var(--counter-offset, 0deg)) }
            to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)) }
          }
          @keyframes counter-ccw {
            from { transform: rotate(var(--counter-offset, 0deg)) }
            to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)) }
          }
        `}</style>

        <div className="pointer-events-none absolute bottom-0 left-1/2 aspect-square w-28 -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,127,255,0.55),transparent_70%)] blur-xl md:w-40" />

        {orbits.map((orbit, index) => {
          const isCW = index % 2 === 0;
          const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
          const counterAnim = isCW ? "counter-cw" : "counter-ccw";

          const allItems = [
            ...orbit.items,
            ...orbit.items.map((item) => ({ ...item, angle: item.angle + 180, label: item.label })),
          ];

          return (
            <div
              key={orbit.duration}
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-white/10 ${orbit.size}`}
            >
              {allItems.map((item, itemIndex) => (
                <div
                  key={`${item.label}-${itemIndex}`}
                  className="absolute top-0 left-1/2 h-1/2 -ml-12 flex origin-bottom flex-col items-center justify-start"
                  style={
                    {
                      "--start-angle": `${item.angle}deg`,
                      animation: `${orbitAnim} ${orbit.duration}s linear infinite`,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="relative z-10 -mt-4 rounded-full border border-white/15 bg-navy-card px-3 py-1.5 font-mono text-[0.65rem] font-semibold uppercase tracking-wide text-ink"
                    style={
                      {
                        "--counter-offset": `${-item.angle}deg`,
                        animation: `${counterAnim} ${orbit.duration}s linear infinite`,
                      } as React.CSSProperties
                    }
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </section>
    </Reveal>
  );
}
