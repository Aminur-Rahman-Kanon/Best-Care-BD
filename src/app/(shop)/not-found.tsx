import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-light text-brand-dark">404</h1>
      <p className="mt-2 text-brand-gray">Page not found</p>
      <Link
        href="/"
        className="mt-6 border border-brand-dark px-6 py-2 text-sm uppercase tracking-wide hover:bg-brand-dark hover:text-white transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
