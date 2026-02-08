import { cn, formatPrice, getDiscountPercentage } from "@/lib/utils";
import { Badge } from "@/components/ui";

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
  showDiscount?: boolean;
  className?: string;
}

export function PriceTag({
  price,
  originalPrice,
  currency = "NGN",
  size = "md",
  showDiscount = true,
  className,
}: PriceTagProps) {
  const discount = originalPrice ? getDiscountPercentage(originalPrice, price) : 0;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <span className={cn("font-bold", sizeClasses[size])}>
        {formatPrice(price, currency)}
      </span>
      
      {originalPrice && originalPrice > price && (
        <>
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(originalPrice, currency)}
          </span>
          {showDiscount && discount > 0 && (
            <Badge variant="success" className="text-xs">
              -{discount}%
            </Badge>
          )}
        </>
      )}
    </div>
  );
}