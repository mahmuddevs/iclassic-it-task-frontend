import { useState, useEffect, useRef, type ChangeEvent, type MouseEvent } from "react"
import type { FieldError } from "react-hook-form"
import { UploadSimple, Trash, CloudArrowUp } from "@phosphor-icons/react"
import ImageLoader from "./image-loader"

interface ImageUploadProps {
  value: File | string | null | undefined;
  onChange: (value: File | string | null) => void;
  label?: string;
  placeholder?: string;
  error?: FieldError | string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  placeholder = "Click to Upload Image",
  error,
  className,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  const errorMessage = typeof error === "string" ? error : error?.message

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange(file)
    }
  }

  const handleClear = (e: MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    const handlePreview = () => {
      if (!value) {
        setPreviewUrl("")
        return
      }
      if (typeof value === "string") {
        setPreviewUrl(value)
        return
      }

      const objectUrl = URL.createObjectURL(value)
      setPreviewUrl(objectUrl)

      return () => {
        URL.revokeObjectURL(objectUrl)
      }
    }

    return handlePreview()
  }, [value])

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className || ""}`}>
      {label && (
        <label className="text-xs font-bold text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}

      <div
        onClick={triggerUpload}
        className={`relative flex flex-col items-center justify-center w-full h-48 rounded-lg border border-dashed transition-all cursor-pointer overflow-hidden mt-auto ${previewUrl
            ? "border-border bg-background-card hover:bg-hover"
            : "border-border bg-background-input hover:border-primary hover:bg-primary/5"
          } ${errorMessage ? "border-red-500" : ""}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {previewUrl ? (
          <>
            <ImageLoader
              src={previewUrl}
              alt="Preview"
              className="object-contain p-4 w-full h-full max-h-48"
              wrapperClass="w-full h-full flex items-center justify-center"
            />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white">
              <UploadSimple size={20} weight="bold" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Change Image</span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 inset-e-2 flex items-center justify-center w-6 h-6 rounded-md bg-background-card/90 hover:bg-background-card text-red-500 shadow-sm transition-colors border border-border"
              title="Remove image"
            >
              <Trash size={14} weight="bold" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-secondary border border-border">
              <CloudArrowUp size={20} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-foreground">{placeholder}</p>
              <p className="text-[10px] text-secondary">PNG, SVG or JPG up to 2MB</p>
            </div>
          </div>
        )}
      </div>
      {errorMessage && <span className="text-xs text-red-500 font-medium">{errorMessage}</span>}
    </div>
  )
}
