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
        className="fixed inset-0 bg-slate-950/35 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      {/* Container */}
      <div
        className={`relative w-full max-w-lg bg-background-card rounded-2xl shadow-xl border border-border overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 ${className}`}
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
      className={`flex items-center justify-between px-6 pt-6 pb-2 shrink-0 bg-transparent ${className}`}
    >
      <h6 className="text-base font-bold text-foreground">{title}</h6>
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-secondary hover:text-foreground p-1 rounded-md hover:bg-hover transition-all cursor-pointer focus:outline-none border-none bg-transparent"
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
      className={`max-xs:px-2 px-6 py-4 overflow-y-auto flex-1 text-sm text-foreground/80 leading-relaxed bg-transparent ${className}`}
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
      className={`px-6 pb-6 pt-2 flex items-center justify-end gap-3 shrink-0 bg-transparent ${className}`}
    >
      {children}
    </div>
  )
}

// Bind subcomponents
Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter