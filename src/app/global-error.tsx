"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center space-y-4 max-w-md px-4">
            <div className="text-6xl font-bold text-red-400">!</div>
            <h1 className="text-2xl font-bold text-gray-800">Something went wrong</h1>
            <p className="text-gray-500 text-sm">
              {error.message || "A critical error occurred. Please refresh the page."}
            </p>
            <button onClick={reset} className="btn-primary">
              Refresh page
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
