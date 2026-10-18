import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// عميل Supabase المخصص للتصدير الثابت
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 1. جلب معرفات الكورسات لبنائها استاتيكياً وقت الـ Build
export async function generateStaticParams() {
  const { data: courses } = await supabase.from("courses").select("id");
  return (courses || []).map((course) => ({
    id: course.id,
  }));
}

// تعطيل البارامترات الديناميكية لتتوافق مع output: "export"
export const dynamicParams = false;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;

  // جلب تفاصيل الكورس من Supabase
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .maybeSingle();

  if (error || !course) {
    return notFound();
  }

  const whatsappMessage = encodeURIComponent(`مرحباً، أنا مهتم بطلب كورس: ${course.title}`);
  const whatsappLink = `https://wa.me/${course.whatsapp_number?.replace(/\s+/g, "") || "201012345678"}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen flex flex-col relative bg-[#010103] text-white selection:bg-[#00FF88] selection:text-black overflow-x-hidden font-sans" dir="rtl">
      
      {/* خلفية شبكية سايبربانك */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#080810_1px,transparent_1px),linear-gradient(to_bottom,#080810_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0 opacity-40" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#010103_90%)] pointer-events-none z-0" />

      {/* Navbar العلوي */}
      <nav className="w-full flex justify-between items-center px-6 md:px-16 py-5 border-b border-[#00FF88]/20 bg-black/85 backdrop-blur-2xl sticky top-0 z-50 font-mono">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-black tracking-widest text-white flex items-center gap-2">
            DERA<span className="text-[#00FF88] drop-shadow-[0_0_20px_#00FF88]">3</span>
            <span className="text-[10px] text-gray-500 font-normal">.WARFARE</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs font-mono text-gray-400 hover:text-[#00FF88] transition-colors flex items-center gap-2">
            <span>&larr;</span> العودة للرئيسية
          </Link>
        </div>
      </nav>

      {/* محتوى صفحة الكورس الرئيسي */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 relative z-10">
        
        {/* القسم العلوي */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border border-[#00FF88]/30 bg-[#00FF88]/5 text-[#00FF88] text-xs font-mono shadow-[0_0_15px_rgba(0,255,136,0.1)]">
              <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-ping" />
              MODULE ID: #{course.id.slice(0, 8).toUpperCase()}
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.15]">
              {course.title}
            </h1>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed font-mono bg-[#07070b] p-6 rounded-3xl border border-[#1a1a26] shadow-xl">
              {course.description}
            </p>

            <div className="text-3xl md:text-4xl font-black text-[#00FF88] font-mono drop-shadow-[0_0_20px_rgba(0,255,136,0.3)]">
              {course.is_free ? "[ مجاني بالكامل ]" : `[ ${course.price} ج.م ]`}
            </div>
            
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full md:w-auto inline-block bg-[#00FF88] text-black font-black text-sm md:text-base px-10 py-4.5 rounded-2xl hover:bg-[#00cc6a] hover:scale-105 transition-all shadow-[0_0_40px_rgba(0,255,136,0.5)] text-center font-mono tracking-wider cursor-pointer"
            >
              اطلب الكورس الان 🚀
            </a>
          </div>
          
          <div className="rounded-3xl overflow-hidden border border-[#00FF88]/30 bg-black shadow-[0_0_50px_rgba(0,255,136,0.2)] relative group h-80 md:h-[400px]">
            <img 
              src={course.image_url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"} 
              alt={course.title} 
              className="w-full h-full object-cover filter contrast-125 saturate-150 group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#010103] via-transparent to-transparent opacity-80" />
          </div>

        </div>

        {/* القسم السفلي */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-mono">
          
          <div className="md:col-span-1 bg-[#07070b] border border-[#1a1a26] p-8 rounded-3xl shadow-xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF88]/5 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-xl font-black text-white mb-6 border-b border-[#1a1a26] pb-4 flex items-center gap-3">
              <span className="text-[#00FF88]">&gt;</span> ماذا ستتعلم؟
            </h2>
            <ul className="space-y-4">
              {course.learn_points?.map((item: string, index: number) => (
                <li key={index} className="flex items-start text-gray-300 text-xs md:text-sm">
                  <span className="text-[#00FF88] ml-3 mt-0.5 font-bold">[✓]</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 bg-[#07070b] border border-[#1a1a26] p-8 rounded-3xl shadow-xl relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00FF88]/5 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-xl font-black text-white mb-6 border-b border-[#1a1a26] pb-4 flex items-center gap-3">
              <span className="text-[#00FF88]">&gt;</span> عن محتوى الكورس
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap font-mono">
              {course.content}
            </p>
          </div>

        </div>

      </main>

      {/* Footer السفلي */}
      <footer className="py-12 px-6 md:px-16 border-t border-[#00FF88]/20 bg-black text-xs text-gray-500 flex flex-col md:flex-row items-center justify-between gap-6 font-mono mt-24">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-[#00FF88] rounded-full animate-ping" />
          <span className="text-white font-bold tracking-widest">DERA3 SECURITY WARFARE PLATFORM</span>
        </div>
        <p className="text-gray-400">DERA3 CORE SYSTEMS ONLINE // SECURE CONNECTION</p>
      </footer>

    </div>
  );
}