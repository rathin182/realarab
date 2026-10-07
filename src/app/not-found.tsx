import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#FFFFFF] text-[#141A17] px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-[#0C3826] bg-[#0C3826]/10 px-3 py-1 rounded-none mb-4">
        404 · Page Not Found
      </span>
      <h1 className="font-serif text-4xl md:text-5xl font-light text-[#141A17] mb-4">
        Page Not Located
      </h1>
      <p className="text-[#68736C] max-w-md text-sm leading-relaxed mb-8">
        The sovereign portfolio listing or dossier you requested is unavailable or has been relocated.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#0C3826] hover:bg-[#08281B] text-[#FFFFFF] text-xs font-mono uppercase tracking-widest px-6 py-3 transition-colors"
      >
        Return to Portfolio
      </Link>
    </main>
  );
}
