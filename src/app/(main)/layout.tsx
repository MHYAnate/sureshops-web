import { Header, Footer, MobileNav } from "@/components/layout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      {/* <Footer />
      <MobileNav /> */}
    </div>
  );
}