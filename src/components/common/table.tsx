import React from "react"

interface TableProps {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
}

export default function Table({ children, className = "", wrapperClassName = "" }: TableProps) {
  return (
    <div className={`relative overflow-x-auto bg-background-card shadow-xs rounded-xl border border-border max-xs:-mx-2 ${wrapperClassName}`}>
      <table className={`w-full text-sm text-left rtl:text-right text-foreground ${className}`}>
        {children}
      </table>
    </div>
  )
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHeader({ children, className = "" }: TableHeaderProps) {
  return (
    <thead className={`text-xs uppercase tracking-wider text-secondary bg-slate-50/50 dark:bg-slate-900/20 border-b border-border ${className}`}>
      {children}
    </thead>
  )
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function TableBody({ children, className = "" }: TableBodyProps) {
  return <tbody className={`divide-y divide-border/60 ${className}`}>{children}</tbody>
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TableRow({ children, className = "", onClick }: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`bg-background-card hover:bg-hover transition-colors ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </tr>
  )
}

interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
  scope?: string;
}

export function TableHeaderCell({ children, className = "", scope = "col" }: TableHeaderCellProps) {
  return (
    <th scope={scope} className={`px-6 py-3.5 font-bold ${className}`}>
      {children}
    </th>
  )
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

export function TableCell({ children, className = "", colSpan }: TableCellProps) {
  return (
    <td colSpan={colSpan} className={`px-6 py-4 ${className}`}>
      {children}
    </td>
  )
}

// Bind subcomponents
Table.Header = TableHeader
Table.Body = TableBody
Table.Row = TableRow
Table.HeaderCell = TableHeaderCell
Table.Cell = TableCell