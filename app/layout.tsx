import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DERA3 | منصة الأمن السيبراني",
  description: "منصة تعليمية احترافية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#050505] text-white antialiased relative min-h-screen">
        
        {/* الخلفية الشبكية */}
        <div className="fixed inset-0 z-[-1] opacity-20 pointer-events-none" 
             style={{
               backgroundImage: `linear-gradient(#00FF88 1px, transparent 1px), linear-gradient(90deg, #00FF88 1px, transparent 1px)`,
               backgroundSize: '40px 40px',
               maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
               WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)'
             }}>
        </div>

        {/* التوهج الأخضر */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00FF88]/10 blur-[150px] rounded-full z-[-1] pointer-events-none"></div>

        {children}
      </body>
    </html>
  );
}
