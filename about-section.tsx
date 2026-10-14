type AboutProps = {
  eyebrow: string;
  title: string;
  body: string;
};

export function AboutSection({ eyebrow, title, body }: AboutProps) {
  return (
    <section id="about" className="px-4 py-20 md:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{eyebrow}</p>
      <h3 className="mt-3 max-w-3xl text-3xl font-semibold text-[var(--text)] md:text-4xl">{title}</h3>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text)]/85">{body}</p>
    </section>
  );
}
