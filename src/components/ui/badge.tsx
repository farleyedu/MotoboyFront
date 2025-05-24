import { cn } from "../../../lib/util";
import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Badge({ className, children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
