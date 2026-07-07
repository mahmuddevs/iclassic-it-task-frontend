import React, { useState, useEffect, useRef } from "react"
import { useQueryState } from "nuqs"
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react"

interface SearchProps {
  placeholder?: string;
  className?: string;
  queryKey?: string;
  debounceMs?: number;
}

export default function Search({
  placeholder = "Search...",
  className = "",
  queryKey = "search",
  debounceMs = 400,
}: SearchProps) {
  const [queryParam, setQueryParam] = useQueryState(queryKey)
  const [inputValue, setInputValue] = useState(queryParam || "")
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSetQueryParamRef = useRef<string | null>(queryParam)

  // Sync state if query parameter changes externally
  useEffect(() => {
    const syncParam = () => {
      if (queryParam !== lastSetQueryParamRef.current) {
        lastSetQueryParamRef.current = queryParam
        setInputValue(queryParam || "")
      }
    }
    syncParam()
  }, [queryParam, inputValue])

  // Handle input change and debounce URL update
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      const nextVal = value || null
      setQueryParam(nextVal)
      lastSetQueryParamRef.current = nextVal
    }, debounceMs)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleClear = () => {
    setInputValue("")
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setQueryParam(null)
    lastSetQueryParamRef.current = null
  }

  return (
    <div className={`relative w-full max-w-sm ${className}`}>
      <span className="absolute inset-y-0 inset-s-0 flex items-center ps-3.5 pointer-events-none text-secondary">
        <MagnifyingGlassIcon size={18} />
      </span>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-background-input border border-border ps-10 pe-10 h-12 text-sm rounded-xl outline-none transition-all text-foreground hover:border-slate-400 dark:hover:border-slate-600 focus:border-primary focus:ring-1 focus:ring-primary"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 inset-e-0 flex items-center pe-3.5 text-secondary hover:text-foreground cursor-pointer border-none bg-transparent"
        >
          <XIcon size={16} />
        </button>
      )}
    </div>
  )
}