import Link from "next/link"

export default function DashboardNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl font-bold text-primary/60">404</div>
        <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
        <p className="text-muted text-sm">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
