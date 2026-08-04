import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { TechOrbit } from "@/components/tech-orbit";
import { FeatureCards } from "@/components/feature-cards";
import { Projects } from "@/components/projects";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TechOrbit />
      <FeatureCards />
      <Projects />
    </main>
  );
}
