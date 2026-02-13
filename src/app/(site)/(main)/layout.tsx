// app/(site)/(home)/layout.tsx
import SubTitle from "@/components/layout/SubTitle/SubTitle";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="content-area main-content">
      <SubTitle />
      {children}
    </main>
  );
}
