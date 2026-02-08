import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { LocationInfo } from "@/types";

interface LocationBadgeProps {
  location: LocationInfo;
  showFull?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function LocationBadge({
  location,
  showFull = false,
  size = "md",
  className,
}: LocationBadgeProps) {
  const getLocationText = () => {
    if (showFull) {
      const parts = [];
      if (location.shopNumber) parts.push(location.shopNumber);
      if (location.market?.name) parts.push(location.market.name);
      if (location.area?.name) parts.push(location.area.name);
      if (location.state?.name) parts.push(location.state.name);
      return parts.join(", ");
    }
    return location.area?.name || location.state?.name || "Nigeria";
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-muted-foreground",
        size === "sm" ? "text-xs" : "text-sm",
        className
      )}
    >
      <MapPin className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      <span className="truncate">{getLocationText()}</span>
      {location.distance !== undefined && (
        <span className="whitespace-nowrap">
          • {location.distance.toFixed(1)}km
        </span>
      )}
    </div>
  );
}