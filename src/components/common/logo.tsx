import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={className}>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
          <span className="text-lg font-bold text-background">S</span>
        </div>
        <span className="text-xl font-bold tracking-tight">SureShops</span>
      </div>
    </Link>
  );
}