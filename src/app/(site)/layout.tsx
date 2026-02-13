// app/(site)/layout.tsx

import { LoadingProvider } from "@/context/LoadingContext";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";


export default function SiteLayout({ children }: { children: React.ReactNode }) {

  
  return (
    <LoadingProvider>
      <Header />
      {children}
      <Footer />
    </LoadingProvider>
  );
}
