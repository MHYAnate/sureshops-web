import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function VerifiedBadge({
  size = "md",
  showText = false,
  className,
}: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className={cn("flex items-center gap-1 text-primary", className)}>
      <BadgeCheck className={sizeClasses[size]} />
      {showText && <span className="text-sm font-medium">Verified</span>}
    </div>
  );
}