// src/app/(auth)/layout.tsx
import { Logo } from "@/components/common";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground text-background flex-col justify-between p-12">
        <Logo className="text-background [&_div]:bg-background [&_span]:text-background" />

        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Discover the best products from local shops across Nigeria
          </h1>
          <p className="text-lg text-background/80">
            Compare prices, find deals, and support local businesses in your
            community.
          </p>
        </div>

        <p className="text-sm text-background/60">
          © {new Date().getFullYear()} SureShops. All rights reserved.
        </p>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}