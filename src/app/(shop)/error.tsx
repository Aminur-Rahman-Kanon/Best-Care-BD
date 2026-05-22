"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold text-brand-dark">Something went wrong</h1>
      <p className="mt-2 text-sm text-brand-gray">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded bg-brand-dark px-6 py-2 text-sm text-white hover:bg-gray-800"
      >
        Try again
      </button>
    </div>
  );
}
