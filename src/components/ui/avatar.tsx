import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = "md", className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("rounded-full object-cover", sizeClasses[size], className)}
    />
  );
};