// app/(site)/(sub)/layout.tsx
import SubTitle from "@/components/layout/SubTitle/SubTitle";

export default function SubLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="content-area subpage-content">
      
      {children}
    </main>
  );
}
