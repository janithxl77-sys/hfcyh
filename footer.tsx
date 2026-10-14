export function Footer({ text }: { text: string }) {
  return (
    <footer className="border-t border-white/10 px-4 py-10 text-center text-sm text-[var(--muted)] md:px-8">
      {text}
    </footer>
  );
}
