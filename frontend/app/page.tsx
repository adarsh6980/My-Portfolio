import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { TechOrbit } from "@/components/tech-orbit";
import { FeatureCards } from "@/components/feature-cards";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TechOrbit />
      <FeatureCards />
    </main>
  );
}
