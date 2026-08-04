import { PORTFOLIO_DATA } from "@/lib/data";

export function Footer() {
  const { socialLinks, profile } = PORTFOLIO_DATA;
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-white/10 px-4 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-display text-lg font-bold text-ink">{profile.name}</p>
          <a href={`mailto:${profile.email}`} className="text-sm text-muted hover:text-accent">
            {profile.email}
          </a>
        </div>

        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              className="text-sm font-semibold text-muted hover:text-ink"
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-muted">
        © {year} {profile.name}. Built with Next.js, Tailwind CSS, and Framer Motion.
      </p>
    </footer>
  );
}
