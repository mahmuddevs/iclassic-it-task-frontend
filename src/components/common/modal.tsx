import React, { useEffect } from "react"
import { X } from "@phosphor-icons/react"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, children, className = "" }: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />
      {/* Container */}
      <div
        className={`relative w-full max-w-lg bg-background-card rounded-xl shadow-lg border border-border overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 ${className}`}
      >
        {children}
      </div>
    </div>
  )
}

// 1. Header Subcomponent
interface HeaderProps {
  title: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
}

export function ModalHeader({
  title,
  onClose,
  showCloseButton = true,
  className = "",
}: HeaderProps) {
  return (
    <div
      className={`flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/20 shrink-0 ${className}`}
    >
      <h6 className="text-base font-bold text-foreground">{title}</h6>
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-secondary hover:text-foreground p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer focus:outline-none border-none bg-transparent"
        >
          <X size={18} weight="bold" />
        </button>
      )}
    </div>
  )
}

// 2. Body Subcomponent
interface BodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalBody({ children, className = "" }: BodyProps) {
  return (
    <div
      className={`max-xs:px-2 p-6 overflow-y-auto flex-1 text-sm text-foreground/80 leading-relaxed ${className}`}
    >
      {children}
    </div>
  )
}

// 3. Footer Subcomponent
interface FooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className = "" }: FooterProps) {
  return (
    <div
      className={`px-6 py-4 border-t border-border bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-end gap-3 shrink-0 ${className}`}
    >
      {children}
    </div>
  )
}

// Bind subcomponents
Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter