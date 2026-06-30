import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-4 max-w-md px-4">
        <div className="text-6xl font-bold text-blue-300">404</div>
        <h1 className="text-2xl font-bold text-gray-800">Page not found</h1>
        <p className="text-gray-500 text-sm">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
