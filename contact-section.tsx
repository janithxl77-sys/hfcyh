"use client";

import { useState } from "react";

type ContactProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  submitLabel: string;
};

export function ContactSection({ eyebrow, title, subtitle, submitLabel }: ContactProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setSuccess(null);
    setError(null);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSuccess("Message sent successfully.");
    const form = document.getElementById("contact-form") as HTMLFormElement | null;
    form?.reset();
  }

  return (
    <section id="contact" className="px-4 py-20 md:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{eyebrow}</p>
      <h3 className="mt-3 text-3xl font-semibold text-[var(--text)] md:text-4xl">{title}</h3>
      <p className="mt-3 text-[var(--text)]/75">{subtitle}</p>

      <form
        id="contact-form"
        className="mt-8 grid max-w-2xl gap-4"
        action={async (fd) => {
          await onSubmit(fd);
        }}
      >
        <input name="name" required placeholder="Your name" className="input-base" />
        <input name="email" type="email" required placeholder="Your email" className="input-base" />
        <textarea name="message" required placeholder="Your message" rows={5} className="input-base" />
        <button disabled={loading} className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-black">
          {loading ? "Sending..." : submitLabel}
        </button>
        {success && <p className="text-sm text-emerald-400">{success}</p>}
        {error && <p className="text-sm text-rose-400">{error}</p>}
      </form>
    </section>
  );
}
