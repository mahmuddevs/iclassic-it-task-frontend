import React from "react"
import { Link, type LinkProps } from "react-router"

type ButtonBaseProps = {
  children: React.ReactNode;
  type?: "primary" | "secondary";
};

type ButtonAsButtonProps = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
    href?: never;
    htmlType?: "button" | "submit" | "reset";
  };

type ButtonAsLinkProps = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "type" | "href"> &
  Omit<LinkProps, "to"> & {
    href: string;
    htmlType?: never;
  };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export default function Button(props: ButtonProps) {
  const {
    children,
    className = "",
    type = "primary",
    href,
  } = props;

  // Base layout, font, transitions, border-width shared between both variants
  const baseStyles =
    "items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 active:scale-[0.98] rounded-xl cursor-pointer select-none border";

  const displayStyle =
    className.includes("hidden") ||
      className.includes("flex") ||
      className.includes("block") ||
      className.includes("grid")
      ? ""
      : "inline-flex";

  // Exact height constraints
  const hasCustomHeight = className.split(" ").some(c => c.startsWith("h-") || c.startsWith("py-") || c.startsWith("min-h-"));
  const heightStyles = hasCustomHeight ? "" : "h-10 px-4";

  // Override class detections
  const hasCustomBorder = className.split(" ").some(c => c.startsWith("border-") && c !== "border-none");
  const hasCustomText = className.split(" ").some(c => c.startsWith("text-"));
  const hasCustomBg = className.split(" ").some(c => c.startsWith("bg-"));

  // Variant styles: Primary (solid background & matching crisp border color)
  const primaryBg = hasCustomBg ? "" : "bg-primary hover:bg-primary/90";
  const primaryBorder = hasCustomBorder ? "" : "border-0";
  const primaryText = hasCustomText ? "" : "text-white";
  const primaryStyles = `${primaryBg} ${primaryBorder} ${primaryText}`;

  // Variant styles: Secondary (transparent outline)
  const secondaryBg = hasCustomBg ? "" : "bg-transparent hover:bg-hover";
  const secondaryBorder = hasCustomBorder ? "" : "border-border";
  const secondaryText = hasCustomText ? "" : "text-foreground";
  const secondaryStyles = `${secondaryBg} ${secondaryBorder} ${secondaryText}`;

  const typeStyles = type === "primary" ? primaryStyles : secondaryStyles;
  const combinedClasses = `${displayStyle} ${baseStyles} ${heightStyles} ${typeStyles} ${className}`.trim();

  if (href) {
    const linkProps = { ...props } as Record<string, unknown>;
    delete linkProps.children;
    delete linkProps.className;
    delete linkProps.type;
    delete linkProps.href;

    return (
      <Link
        to={href}
        className={combinedClasses}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  const buttonProps = { ...props } as Record<string, unknown>;
  const htmlType = (buttonProps.htmlType as "button" | "submit" | "reset" | undefined) || "button";
  delete buttonProps.children;
  delete buttonProps.className;
  delete buttonProps.type;
  delete buttonProps.htmlType;

  return (
    <button
      type={htmlType}
      className={combinedClasses}
      {...buttonProps}
    >
      {children}
    </button>
  );
}