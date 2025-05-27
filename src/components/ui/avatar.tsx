import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
};

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = "md", className }) => {
  const dimension = sizeMap[size];

  return (
    <Image
      src={src}
      alt={alt}
      width={dimension}
      height={dimension}
      className={cn("rounded-full object-cover", className)}
    />
  );
};
