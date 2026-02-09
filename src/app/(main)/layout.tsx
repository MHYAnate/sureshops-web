// src/app/(main)/layout.tsx
import { Header, Footer, MobileNav } from "@/components/layout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </>
  );
}