import { ScrollToHash } from "@/components/ScrollToHash";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavigation } from "@/components/SiteNavigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <ScrollToHash />
      <SiteNavigation />
      {children}
      <SiteFooter />
    </div>
  );
}
