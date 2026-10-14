declare module "@/data/content" {
  export const siteContent: {
    brand: string;
    nav: { label: string; href: string }[];
    hero: {
      pretitle: string;
      ctaLabel: string;
      discoverLabel: string;
      description: string;
      scrollHint: string;
      socialLinks: { label: string; href: string }[];
      videoSrc: string;
    };
    about: {
      eyebrow: string;
      title: string;
      body: string;
    };
    contact: {
      eyebrow: string;
      title: string;
      subtitle: string;
      submitLabel: string;
    };
    footer: {
      text: string;
    };
  };
}
