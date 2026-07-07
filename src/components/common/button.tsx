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

  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300 active:scale-[0.98] rounded-xl cursor-pointer select-none border";

  const displayStyle =
    className.includes("hidden") ||
    className.includes("flex") ||
    className.includes("block") ||
    className.includes("grid")
      ? ""
      : "inline-flex";

  const hasCustomBorder = className.split(" ").some(c => c.startsWith("border-") && c !== "border-none");
  const hasCustomText = className.split(" ").some(c => c.startsWith("text-"));
  const hasCustomBg = className.split(" ").some(c => c.startsWith("bg-"));

  const primaryStyles = `text-white ${hasCustomBg ? "" : "bg-primary hover:bg-primary/90"} ${
    hasCustomBorder ? "" : "border-transparent"
  }`;

  const secondaryStyles = `bg-transparent ${
    hasCustomBorder ? "" : "border-border"
  } ${
    hasCustomText ? "" : "text-foreground"
  } hover:bg-hover`;

  const typeStyles = type === "primary" ? primaryStyles : secondaryStyles;
  const combinedClasses = `${displayStyle} ${baseStyles} ${typeStyles} ${className}`.trim();

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