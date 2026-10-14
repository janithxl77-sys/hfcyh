"use client";

import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { CustomCursor } from "@/components/custom-cursor";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Loader } from "@/components/loader";
import { Navbar } from "@/components/navbar";
import { ProjectSlider } from "@/components/project-slider";
import type { Project } from "@/db/schema";
import { siteContent } from "@/data/content";
import { LenisProvider } from "./providers/lenis-provider";
import { useState } from "react";

export function SiteShell({ projects }: { projects: Project[] }) {
  const [loading, setLoading] = useState(true);

  return (
    <LenisProvider>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <CustomCursor />
      <Navbar />
      <main className="bg-[var(--bg)] transition-colors duration-500">
        <Hero data={siteContent.hero} />
        <ProjectSlider projects={projects} />
        <AboutSection {...siteContent.about} />
        <ContactSection {...siteContent.contact} />
      </main>
      <Footer text={siteContent.footer.text} />
    </LenisProvider>
  );
}
