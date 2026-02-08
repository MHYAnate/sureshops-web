import * as React from "react";
import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

export function Avatar({ src, alt, name, size = "md", className }: AvatarProps) {
  const [error, setError] = React.useState(false);

  if (src && !error) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-muted",
          sizeClasses[size],
          className
        )}
      >
        <Image
          src={src}
          alt={alt || name || "Avatar"}
          fill
          className="object-cover"
          onError={() => setError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary text-primary-foreground font-medium",
        sizeClasses[size],
        className
      )}
    >
      {name ? getInitials(name) : "?"}
    </div>
  );
}