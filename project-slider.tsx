"use client";

import type { Project } from "@/db/schema";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function ProjectSlider({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll("[data-card]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.65,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="px-4 py-20 md:px-8">
      <h3 className="mb-8 text-3xl font-semibold text-[var(--text)]">Projects</h3>

      <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
        {projects.map((project) => (
          <article
            key={project.id}
            data-card
            className="min-w-[82vw] snap-start overflow-hidden rounded-2xl border border-white/15 bg-white/5 md:min-w-[32rem]"
          >
            <div className="relative h-56 w-full">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 80vw, 32rem"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">{project.category}</p>
              <h4 className="mt-2 text-xl font-semibold text-[var(--text)]">{project.title}</h4>
              <p className="mt-2 text-sm text-[var(--text)]/80">{project.description}</p>
              <a
                href={project.link}
                target="_blank"
                className="mt-4 inline-block text-sm font-semibold text-[var(--accent)]"
                rel="noreferrer"
              >
                Visit Project →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
