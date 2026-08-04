import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { TechOrbit } from "@/components/tech-orbit";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TechOrbit />
    </main>
  );
}
