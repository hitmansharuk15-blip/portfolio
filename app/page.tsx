import { IntroHero } from "@/components/IntroHero";
import { AboutSection } from "@/components/AboutSection";
import { SkillsUniverse } from "@/components/SkillsUniverse";
import { ContactSection } from "@/components/ContactSection";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { JourneyTimeline } from "@/components/JourneyTimeline";

export default function Home() {
  return (
    <main className="relative bg-ink">
      
            <IntroHero />
            <AboutSection />
        <SkillsUniverse />
        <ProjectShowcase />
        <JourneyTimeline />
        <ContactSection />
         
    </main>
  );
}