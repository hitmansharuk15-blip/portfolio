import { IntroHero } from "@/components/IntroHero";
import { AboutSection } from "@/components/AboutSection";
import { SkillsUniverse } from "@/components/SkillsUniverse";
import { ContactSection } from "@/components/ContactSection";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { JourneyTimeline } from "@/components/JourneyTimeline";
import { SkewWrapper } from "@/components/SkewWrapper";
export default function Home() {
  return (
    <main className="relative bg-ink">
        <SkewWrapper>
            <IntroHero />
            <AboutSection />
        <SkillsUniverse />
        <ProjectShowcase />
        <JourneyTimeline />
        <ContactSection />
         </SkewWrapper>
    </main>
  );
}