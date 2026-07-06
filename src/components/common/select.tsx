import React, { useState, useRef, useEffect, type ReactElement } from "react"
import { CaretDown, Check } from "@phosphor-icons/react"

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export default function Select({
  children,
  value,
  onChange,
  placeholder = "Select an option",
  error,
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Find the selected option's label synchronously during render
  let selectedValueLabel = ""
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const props = child.props as { value?: string; children?: React.ReactNode }
      if (props.value === value) {
        selectedValueLabel =
          typeof props.children === "string" ? props.children : ""
      }
    }
  })

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full bg-background-input border px-4 h-12 text-left text-sm rounded-xl outline-none transition-all flex items-center justify-between text-foreground cursor-pointer ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        } ${
          error
            ? "border-red-500 focus:border-red-500"
            : isOpen
            ? "border-primary ring-1 ring-primary"
            : "border-border hover:border-slate-400 dark:hover:border-slate-600 focus:border-primary"
        }`}
      >
        <span className={!value ? "text-secondary" : "text-foreground"}>
          {selectedValueLabel || placeholder}
        </span>
        <CaretDown
          size={16}
          className={`text-secondary transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute z-30 w-full mt-1.5 bg-background-card border border-border rounded-xl shadow-md overflow-y-auto max-h-60">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(
                child as ReactElement<Record<string, unknown>>,
                {
                  selectedValue: value,
                  onSelect: handleSelect,
                }
              )
            }
            return child
          })}
        </div>
      )}
    </div>
  )
}

interface OptionProps {
  value: string;
  children: React.ReactNode;
  selectedValue?: string;
  onSelect?: (value: string) => void;
}

function Option({ value, children, selectedValue, onSelect }: OptionProps) {
  const isSelected = selectedValue === value

  return (
    <button
      type="button"
      onClick={() => onSelect?.(value)}
      className={`w-full text-left px-4 h-12 text-sm transition-colors flex items-center justify-between cursor-pointer border-b border-border/40 last:border-b-0 ${
        isSelected
          ? "bg-primary/10 font-semibold text-primary hover:bg-primary/20"
          : "text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      <span>{children}</span>
      {isSelected && (
        <Check size={16} className="text-primary shrink-0" />
      )}
    </button>
  )
}

// Attach subcomponent
Select.Option = Option
export { Option }
