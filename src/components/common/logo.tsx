// components/common/Logo.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string; // Add href prop to conditionally wrap with Link
}

export function Logo({ className, href }: LogoProps) {
  const logoContent = (
    <div className="flex items-center gap-2">
      {/* Premium Logo Design */}
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 shadow-lg shadow-primary/20">
        {/* Main S icon with shine effect */}
        <span className="text-xl font-extrabold text-white tracking-tighter">S</span>
        
        {/* Subtle shine effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-30" />
        
        {/* Corner accent */}
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white/20" />
      </div>
      
      {/* Text Logo */}
      <div className="flex flex-col leading-tight">
        <span className="text-xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
          SureShops
        </span>
        <span className="text-[10px] font-medium text-muted-foreground tracking-wider">
          PREMIUM MARKETPLACE
        </span>
      </div>
    </div>
  );

  // Conditionally wrap with Link only if href is provided
  if (href) {
    return (
      <Link href={href} className={cn("inline-flex", className)}>
        {logoContent}
      </Link>
    );
  }

  // If no href provided, just render the logo content
  return <div className={cn("inline-flex", className)}>{logoContent}</div>;
}