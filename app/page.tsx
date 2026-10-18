import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Suspense } from "react";

// استخدام عميل Supabase عادي ومستقل عن الكوكيز لضمان التوافق التام
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 1. مكون عرض الكورسات والمسارات
async function CoursesList() {
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (!courses || courses.length === 0) {
    return (
      <div className="col-span-full text-center py-20 border border-dashed border-[#00FF88]/30 rounded-3xl bg-[#060609]/90 backdrop-blur-2xl">
        <p className="text-[#00FF88] font-mono text-sm mb-4 tracking-widest">[!] NO DEPLOYED CYBER MODULES</p>
        <p className="text-gray-400 text-sm mb-6">لا توجد مسارات مضافة في النظام حالياً ضمن قاعدة البيانات.</p>
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 text-xs font-bold bg-[#00FF88] text-black px-8 py-3.5 rounded-xl hover:bg-[#00cc6a] transition-all shadow-[0_0_25px_rgba(0,255,136,0.4)] font-mono"
        >
          [+] الانتقال لوحة التحكم لنشر المسارات
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <div
          key={course.id}
          className="group relative bg-[#09090e] border border-[#1f1f2e] hover:border-[#00FF88] rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,255,136,0.25)] hover:-translate-y-2 flex flex-col justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#00FF88]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div>
            <div className="relative h-56 w-full overflow-hidden bg-[#0d0d12]">
              <img
                src={course.image_url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-75 group-hover:opacity-100 filter contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090e] via-transparent to-transparent" />
              
              <div className="absolute top-4 right-4 bg-black/90 border border-[#00FF88]/50 px-4 py-1.5 rounded-xl backdrop-blur-md shadow-lg font-mono">
                <span className="text-[#00FF88] font-bold text-xs">
                  {course.is_free ? "[ مجاني ]" : `[ ${course.price} ج.م ]`}
                </span>
              </div>
            </div>

            <div className="p-7">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse"></span>
                <span className="text-[11px] text-gray-400 font-mono tracking-wider">MODULE_ACTIVE // SECURE</span>
              </div>
              <h4 className="text-xl font-black text-white mb-3 group-hover:text-[#00FF88] transition-colors duration-300 line-clamp-1">
                {course.title}
              </h4>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-2">
                {course.description || "مسار تدريبي عملي متطور يعتمد على محاكاة الهجمات واكتشاف الثغرات في بيئة معزولة."}
              </p>
            </div>
          </div>

          <div className="px-7 pb-7 pt-4 flex items-center justify-between border-t border-[#1a1a26] relative z-10 font-mono text-xs">
            <span className="text-gray-500">EXPERT_LEVEL</span>
            <Link
              href={`/course/${course.id}`}
              className="font-bold bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/40 px-5 py-2.5 rounded-xl hover:bg-[#00FF88] hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,255,136,0.2)]"
            >
              دخول المعمل &gt;
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

// 2. الصفحة الرئيسية المتطورة الكبرى
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative bg-[#020204] text-white selection:bg-[#00FF88] selection:text-black overflow-x-hidden font-sans" dir="rtl">
      
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0a0a12_1px,transparent_1px),linear-gradient(to_bottom,#0a0a12_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0 opacity-40" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020204_85%)] pointer-events-none z-0" />

      {/* Navbar القيادة والسيطرة */}
      <nav className="w-full flex justify-between items-center px-6 md:px-16 py-5 border-b border-[#00FF88]/20 bg-black/80 backdrop-blur-2xl sticky top-0 z-50 font-mono">
        <div className="flex items-center gap-10">
          <h1 className="text-2xl font-black tracking-widest text-white flex items-center gap-2">
            DERA<span className="text-[#00FF88] drop-shadow-[0_0_15px_#00FF88]">3</span>
            <span className="text-[10px] text-gray-500 font-normal">.WARFARE</span>
          </h1>
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold">
            <Link href="#courses" className="text-gray-300 hover:text-[#00FF88] transition-colors">المختبرات والمسارات</Link>
            <Link href="#features" className="text-gray-300 hover:text-[#00FF88] transition-colors">بنية المنظومة</Link>
            <Link href="/admin" className="text-[#00FF88] hover:underline">[ لوحة الإدارة ]</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="#courses" className="text-xs font-mono font-bold bg-[#00FF88] text-black px-6 py-2.5 rounded-xl hover:bg-[#00cc6a] transition-all shadow-[0_0_20px_rgba(0,255,136,0.35)]">
            تصفح الكورسات
          </Link>
        </div>
      </nav>

      {/* Hero Section العملاق والمتطور */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 text-center pt-28 pb-24 md:pt-36 md:pb-32">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[600px] md:h-[900px] bg-[#00FF88]/10 rounded-full blur-[180px] -z-10 pointer-events-none animate-pulse" />

        <div className="mb-8 px-6 py-2 rounded-xl border border-[#00FF88]/40 bg-black/90 text-[#00FF88] font-mono text-xs tracking-widest backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,136,0.2)] flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] animate-ping" />
          [ DEFCON 1 ] SECURITY LABS ONLINE // ALL SYSTEMS SECURED
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tight max-w-6xl leading-[1.1]">
          ابنِ مهارتك. كن <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] via-[#85ffdf] to-[#00FF88] drop-shadow-[0_0_50px_rgba(0,255,136,0.45)]">
            الأفضل في الأمن السيبراني.
          </span>
        </h2>

        <p className="text-gray-300 text-base md:text-xl max-w-3xl mb-12 font-mono leading-relaxed">
          منظومة التدريب العملي المتكاملة لاختبار الاختراق وتأمين البنى التحتية الحرجة. تجارب حية تحاكي سيناريوهات الهجمات السيبرانية الحقيقية.
        </p>

        {/* أزرار العمليات */}
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto font-mono mb-16">
          <Link 
            href="#courses"
            className="w-full sm:w-auto bg-[#00FF88] text-black font-black px-10 py-4.5 rounded-2xl hover:bg-[#00cc6a] hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(0,255,136,0.5)] text-sm tracking-wider"
          >
            [ بوابة الطلاب والمتدربين ]
          </Link>
          <Link 
            href="/admin"
            className="w-full sm:w-auto bg-[#0d0d14] border border-[#222233] hover:border-[#00FF88]/60 text-white font-bold px-10 py-4.5 rounded-2xl transition-all duration-300 text-sm tracking-wider"
          >
            بوابة المدربين والأدمن
          </Link>
        </div>

        {/* شريط الإحصائيات المتقدم */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 w-full max-w-5xl font-mono">
          <div className="bg-[#07070b] p-6 border border-[#1a1a26] rounded-2xl">
            <h4 className="text-3xl font-black text-[#00FF88] mb-1">3,000+</h4>
            <p className="text-xs text-gray-400">مستخدم نشط بالمنظومة</p>
          </div>
          <div className="bg-[#07070b] p-6 border border-[#1a1a26] rounded-2xl">
            <h4 className="text-3xl font-black text-white mb-1">100%</h4>
            <p className="text-xs text-gray-400">تطبيق عملي مباشر</p>
          </div>
          <div className="bg-[#07070b] p-6 border border-[#1a1a26] rounded-2xl">
            <h4 className="text-3xl font-black text-[#00FF88] mb-1">24/7</h4>
            <p className="text-xs text-gray-400">بيئة معزولة وآمنة</p>
          </div>
          <div className="bg-[#07070b] p-6 border border-[#1a1a26] rounded-2xl">
            <h4 className="text-3xl font-black text-white mb-1">ELITE</h4>
            <p className="text-xs text-gray-400">محتوى احترافي متقدم</p>
          </div>
        </div>

        {/* تيرمينال العمليات السيبرانية الضخم */}
        <div className="w-full max-w-3xl bg-[#060609] border border-[#00FF88]/40 rounded-2xl p-6 text-left font-mono text-xs text-[#00FF88] shadow-[0_0_40px_rgba(0,255,136,0.15)] relative overflow-hidden" dir="ltr">
          <div className="flex items-center justify-between border-b border-[#00FF88]/20 pb-3 mb-4 text-gray-500">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            </div>
            <span>root@dera3-war-room:~#</span>
          </div>
          <div className="space-y-2 text-gray-300">
            <p><span className="text-[#00FF88]">nmap -sV -p 1-65535 target.local</span></p>
            <p className="text-gray-500">Starting Nmap 7.94 ( https://nmap.org )</p>
            <p className="text-gray-400">Discovered open port 80/tcp, 443/tcp, 22/tcp</p>
            <p className="text-[#00FF88]">Connecting session to target core: 192.168.1.100</p>
            <p className="text-gray-400">Bypassing Web Application Firewall (WAF)... SUCCESS</p>
            <p className="text-red-400">[!] Critical Vulnerability Detected: SQL Injection / Remote Code Execution</p>
            <p className="text-[#00FF88] animate-pulse">python3 exploit_matrix.py --target 192.168.1.100 --payload reverse_shell</p>
          </div>
        </div>

      </main>

      {/* قسم المختبرات الرئيسي */}
      <section id="courses" className="py-28 px-6 md:px-16 bg-[#040407] border-t border-[#00FF88]/20 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col items-center text-center mb-20 font-mono">
            <div className="text-xs text-[#00FF88] tracking-widest mb-3">[ ACTIVE WARFARE MODULES ]</div>
            <h3 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
              المختبرات <span className="text-[#00FF88] drop-shadow-[0_0_20px_#00FF88]">والتحديات</span>
            </h3>
            <p className="text-gray-400 text-sm md:text-base max-w-xl">
              اختر المسار التدريبي المناسب لتبدأ تنفيذ الهجمات السيبرانية واكتساب الخبرة الحقيقية.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-mono">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-96 bg-[#09090e] border border-[#1f1f2e] rounded-3xl animate-pulse flex items-center justify-center text-xs text-[#00FF88]">
                    [ LOADING_SECURE_MODULE_{n}... ]
                  </div>
                ))}
              </div>
            }
          >
            <CoursesList />
          </Suspense>

        </div>
      </section>

      {/* قسم مميزات المنظومة */}
      <section id="features" className="py-28 px-6 md:px-16 bg-[#020204] border-t border-[#00FF88]/20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-20 font-mono">
            <div className="text-xs text-[#00FF88] tracking-widest mb-3">[ SYSTEM ADVANTAGES ]</div>
            <h3 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
              ليه <span className="text-[#00FF88]">DERA3</span> مختلفة؟
            </h3>
            <p className="text-gray-400 text-sm md:text-base max-w-xl">
              بنية تدريبية مصممة خصيصاً لتناسب احتياجات سوق العمل السيبراني الحديث.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#08080d] border border-[#1f1f2e] p-8 rounded-3xl relative group hover:border-[#00FF88] transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#00FF88]/10 flex items-center justify-center text-[#00FF88] font-mono font-bold text-lg mb-6 shadow-inner">01</div>
              <h4 className="text-xl font-bold text-white mb-3">محتوى قوي 100%</h4>
              <p className="text-gray-400 text-sm leading-relaxed">تحديثات مستمرة لكل ما هو جديد في عالم الثغرات وطرق التصدي لها واختبار الاختراق.</p>
            </div>
            <div className="bg-[#08080d] border border-[#1f1f2e] p-8 rounded-3xl relative group hover:border-[#00FF88] transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#00FF88]/10 flex items-center justify-center text-[#00FF88] font-mono font-bold text-lg mb-6 shadow-inner">02</div>
              <h4 className="text-xl font-bold text-white mb-3">معامل وتحديات حية</h4>
              <p className="text-gray-400 text-sm leading-relaxed">طبق كل سطر كود أو أداة في بيئة معزولة تماماً تمنحك الأمان والحرية الكاملة للتجربة.</p>
            </div>
            <div className="bg-[#08080d] border border-[#1f1f2e] p-8 rounded-3xl relative group hover:border-[#00FF88] transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#00FF88]/10 flex items-center justify-center text-[#00FF88] font-mono font-bold text-lg mb-6 shadow-inner">03</div>
              <h4 className="text-xl font-bold text-white mb-3">من المحترفين للمحترفين</h4>
              <p className="text-gray-400 text-sm leading-relaxed">مسارات أعدها خبراء أمن سيبراني بمعايير عالمية لتختصر عليك سنوات من البحث الذاتي.</p>
            </div>
          </div>
        </div>
      </section>

      {/* سكشن النهاية الحماسي */}
      <section className="py-28 px-6 text-center bg-gradient-to-b from-[#020204] to-[#07070b] border-t border-[#00FF88]/20 relative z-10">
        <div className="max-w-4xl mx-auto bg-[#09090e] border border-[#00FF88]/40 rounded-3xl p-10 md:p-16 shadow-[0_0_60px_rgba(0,255,136,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,136,0.15),transparent_50%)] pointer-events-none" />
          
          <div className="font-mono text-xs text-[#00FF88] mb-4">&gt; sec_user_initiation // READY_FOR_DEPLOYMENT</div>
          <h3 className="text-3xl md:text-5xl font-black text-white mb-6">
            جاهز تبدأ مسيرتك في الأمن السيبراني؟
          </h3>
          <p className="text-gray-400 text-base md:text-lg mb-10 max-w-xl mx-auto">
            انضم الآن وابدأ رحلتك نحو الاحتراف الحقيقي بخطوات عملية ومباشرة داخل المعامل.
          </p>
          <Link
            href="#courses"
            className="inline-block bg-[#00FF88] text-black font-black px-10 py-4.5 rounded-2xl hover:bg-[#00cc6a] transition-all shadow-[0_0_35px_rgba(0,255,136,0.4)] text-base font-mono"
          >
            [ ابدأ الآن 🚀 ]
          </Link>
        </div>
      </section>

      {/* Footer السفلي */}
      <footer className="py-12 px-6 md:px-16 border-t border-[#00FF88]/20 bg-black text-xs text-gray-500 flex flex-col md:flex-row items-center justify-between gap-6 font-mono">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-[#00FF88] rounded-full animate-ping" />
          <span className="text-white font-bold tracking-widest">DERA3 SECURITY WARFARE PLATFORM</span>
        </div>
        <div className="flex items-center gap-8 text-gray-400">
          <Link href="#courses" className="hover:text-[#00FF88]">المختبرات</Link>
          <Link href="#features" className="hover:text-[#00FF88]">المميزات</Link>
          <Link href="/admin" className="hover:text-[#00FF88]">لوحة التحكم</Link>
        </div>
        <div className="text-gray-500">
          DERA3 CORE SYSTEMS ONLINE
        </div>
      </footer>

    </div>
  );
}