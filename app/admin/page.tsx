import Link from "next/link";

export default function WarningPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#020204] text-white px-4" dir="rtl">
      
      {/* خلفية تحذيرية */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a0000_1px,transparent_1px),linear-gradient(to_bottom,#1a0000_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0 opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 text-center max-w-lg p-10 bg-[#07070b] border border-red-500/30 rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.15)]">
        <div className="text-red-500 text-6xl mb-6 animate-pulse">⚠️</div>
        
        <h1 className="text-4xl font-black text-red-500 mb-4 font-mono drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">
          تحذير أمني
        </h1>
        
        <h2 className="text-xl font-bold text-white mb-6 leading-relaxed">
          غير مسموح للأعضاء بالدخول هنا!
        </h2>
        
        <p className="text-gray-400 mb-8 font-mono text-sm leading-relaxed">
          هذا المسار مخصص فقط لإدارة منصة DERA3. تم تسجيل محاولة الدخول الخاصة بك، يُرجى المغادرة فوراً.
        </p>
        
        <Link href="/" className="inline-block bg-red-500/10 text-red-400 border border-red-500/30 px-8 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all font-mono text-sm font-bold">
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}