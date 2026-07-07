import Button from "../components/common/button"

export default function NotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4">
      {/* Decorative background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full bg-background-card border border-border p-8 md:p-10 rounded-2xl shadow-xl flex flex-col items-center text-center backdrop-blur-md">
        {/* Animated 404 block */}
        <div className="relative select-none mb-6">
          <h1 className="text-8xl md:text-9xl font-black text-primary/10 tracking-tight">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-foreground">Page Not Found</span>
          </div>
        </div>

        <p className="text-secondary text-sm md:text-base leading-relaxed mb-8 max-w-sm">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Button href="/" className="px-6 h-11 border-primary!">
          Go Back Home
        </Button>
      </div>
    </div>
  )
}