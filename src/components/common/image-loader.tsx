import { useState, useEffect, type ImgHTMLAttributes, type SyntheticEvent } from "react"
import placeholderImg from "../../assets/placeholder.png"

interface ImageLoaderProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  wrapperClass?: string
}

export default function ImageLoader({
  src,
  alt = "image",
  fallbackSrc = placeholderImg,
  className = "",
  wrapperClass = "",
  onLoad,
  onError,
  ...props
}: ImageLoaderProps) {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src || fallbackSrc)
  const [error, setError] = useState(!src)
  const [loading, setLoading] = useState(!!src)

  // Reset states dynamically if src prop changes
  useEffect(() => {
    const resetStates = () => {
      if (!src) {
        setCurrentSrc(fallbackSrc)
        setError(true)
        setLoading(false)
      } else {
        setCurrentSrc(src)
        setError(false)
        setLoading(true)
      }
    }

    resetStates()
  }, [src, fallbackSrc])

  const handleLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    setLoading(false)
    if (onLoad) onLoad(e)
  }

  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    setLoading(false)
    setError(true)
    setCurrentSrc(fallbackSrc)
    if (onError) onError(e)
  }

  return (
    <div className={`relative overflow-hidden ${wrapperClass}`}>
      {/* Loading Skeleton */}
      {loading && !error && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800/60 animate-pulse rounded-[inherit] flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {/* Actual Image */}
      <img
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"} ${className}`}
        {...props}
      />
    </div>
  )
}