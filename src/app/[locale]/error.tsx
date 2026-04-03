"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 text-2xl font-bold">Oops!</h2>
      <p className="text-muted mb-6">{error.message || "Something went wrong."}</p>
      <button onClick={reset} className="btn btn-primary">
        Try again
      </button>
    </div>
  );
}
