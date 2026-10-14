"use client";

import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

type HeroProps = {
  data: {
    pretitle: string;
    discoverLabel: string;
    description: string;
    ctaLabel: string;
    socialLinks: { label: string; href: string }[];
    videoSrc: string;
    scrollHint: string;
  };
};

gsap.registerPlugin(ScrollTrigger);

export function Hero({ data }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !videoRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        videoRef.current,
        { scale: 1.08 },
        {
          scale: 1.2,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={sectionRef} className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src={data.videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute right-0 top-0 h-full w-full object-cover md:w-3/5"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col md:flex-row">
        <div className="w-full border-white/20 bg-white/10 p-6 pt-24 backdrop-blur-lg md:w-2/5 md:border-r md:p-10 md:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="mb-8 flex items-center justify-between text-xs tracking-[0.2em] text-white/80">
              <span>{data.pretitle}</span>
              <span>{data.discoverLabel}</span>
            </div>

            <div className="mb-8 space-y-2">
              {data.socialLinks.map((link) => (
                <a key={link.label} href={link.href} className="block text-sm text-white/90 transition hover:text-white">
                  {link.label}
                </a>
              ))}
            </div>

            <p className="max-w-md text-sm leading-relaxed text-white/85">{data.description}</p>

            <a
              href="#projects"
              className="group mt-8 inline-flex items-center gap-2 rounded-full border border-white/45 px-5 py-3 text-xs font-semibold tracking-[0.2em] text-white"
            >
              {data.ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>

          <div className="pointer-events-none absolute bottom-6 left-6 text-[10px] tracking-[0.35em] text-white/70 md:bottom-10 md:left-10">
            {data.scrollHint}
          </div>
        </div>

        <div className="relative flex w-full items-center justify-center md:w-3/5">
          <div className="select-none text-center font-extrabold leading-none text-transparent [-webkit-text-stroke:1.3px_rgba(255,255,255,0.9)]">
            <motion.h1
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.85 }}
              className="text-[18vw] md:text-[11vw]"
            >
              DE
            </motion.h1>
            <motion.h2
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.85, delay: 0.2 }}
              className="-mt-2 text-[14vw] md:-mt-4 md:text-[9vw]"
            >
              VELOPER
            </motion.h2>
          </div>
        </div>
      </div>
    </section>
  );
}
