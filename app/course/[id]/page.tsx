import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export async function generateStaticParams() {
  if (!supabase) return [];

  const { data, error } = await supabase.from("courses").select("id");

  if (error || !data) return [];

  return data.map((course) => ({
    id: String(course.id),
  }));
}

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatPrice(price: unknown) {
  if (price === null || price === undefined || price === "") {
    return "تواصل لمعرفة السعر";
  }

  const number = Number(price);

  return Number.isFinite(number)
    ? `${new Intl.NumberFormat("ar-EG").format(number)} ج.م`
    : `${String(price)} ج.م`;
}

function TerminalLine({
  command,
  children,
}: {
  command: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-sm leading-7">
      <span className="shrink-0 text-[#00ff88]">{command}</span>
      <span className="min-w-0 break-words text-gray-300">{children}</span>
    </div>
  );
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!supabase) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#050807] px-5 text-white"
      >
        <div className="max-w-md rounded-3xl border border-red-500/30 bg-[#0b100e] p-8 text-center">
          <p className="mb-3 text-sm text-red-400">SYSTEM CONFIGURATION ERROR</p>
          <h1 className="mb-3 text-2xl font-black">تعذر الاتصال بقاعدة البيانات</h1>
          <p className="text-sm leading-7 text-gray-400">
            تأكد من إعداد متغيرات Supabase في بيئة البناء ثم أعد نشر الموقع.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-[#00ff88] px-6 py-3 font-bold text-black transition hover:bg-[#00d977]"
          >
            العودة للرئيسية
          </Link>
        </div>
      </main>
    );
  }

  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !course) {
    notFound();
  }

  const title = String(course.title || "كورس تدريبي");
  const description = String(
    course.description || "اكتشف محتوى الكورس وابدأ تطوير مهاراتك التقنية."
  );
  const content = String(course.content || "");
  const isFree = course.is_free === true;

  const learnPoints: string[] = Array.isArray(course.learn_points)
    ? course.learn_points.filter(
        (item: unknown): item is string =>
          typeof item === "string" && item.trim().length > 0
      )
    : [];

  const imageUrl =
    typeof course.image_url === "string" && course.image_url.trim()
      ? course.image_url
      : "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=85&w=1400";

  const phone =
    String(course.whatsapp_number || "201012345678").replace(/\D/g, "");

  const whatsappMessage = encodeURIComponent(
    `مرحباً، أنا مهتم بطلب كورس: ${title}\nمعرّف الكورس: ${String(course.id)}`
  );

  const whatsappLink = `https://wa.me/${phone}?text=${whatsappMessage}`;

  return (
    <div
      dir="rtl"
      className="dera3-page relative flex min-h-screen flex-col overflow-x-hidden bg-[#050807] font-sans text-white selection:bg-[#00ff88] selection:text-black"
    >
      <style>{`
        .dera3-page {
          --neon: #00ff88;
          --surface: rgba(12, 19, 16, .88);
          --line: rgba(0, 255, 136, .15);
        }

        .dera3-grid {
          background-image:
            linear-gradient(rgba(0,255,136,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,.035) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
        }

        .dera3-panel {
          background: linear-gradient(145deg, rgba(15,25,19,.96), rgba(7,11,9,.97));
          border: 1px solid var(--line);
          box-shadow: 0 18px 65px rgba(0,0,0,.22);
        }

        .dera3-glow {
          box-shadow: 0 0 35px rgba(0,255,136,.13);
        }

        .dera3-orb {
          animation: dera3-float 7s ease-in-out infinite;
        }

        .dera3-scan {
          position: relative;
          overflow: hidden;
        }

        .dera3-scan::after {
          content: "";
          position: absolute;
          inset: -100% 0 auto;
          height: 70%;
          background: linear-gradient(transparent, rgba(0,255,136,.07), transparent);
          animation: dera3-scan 7s linear infinite;
          pointer-events: none;
        }

        @keyframes dera3-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-9px); }
        }

        @keyframes dera3-scan {
          to { transform: translateY(260%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .dera3-orb, .dera3-scan::after { animation: none; }
          .dera3-page * { scroll-behavior: auto !important; }
        }
      `}</style>

      {/* Background */}
      <div className="dera3-grid pointer-events-none fixed inset-0 z-0" />
      <div className="pointer-events-none fixed -right-36 top-20 z-0 h-80 w-80 rounded-full bg-[#00ff88]/[0.07] blur-[110px]" />
      <div className="dera3-orb pointer-events-none fixed -left-40 top-[45%] z-0 h-96 w-96 rounded-full bg-emerald-500/[0.05] blur-[120px]" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#00ff88]/15 bg-[#050807]/85 backdrop-blur-2xl">
        <nav className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="العودة إلى DERA3 Cyber"
            className="group flex shrink-0 items-center gap-3"
          >
            <span className="dera3-glow flex h-11 w-11 items-center justify-center rounded-xl border border-[#00ff88]/40 bg-[#00ff88]/10 text-xl font-black text-[#00ff88] transition group-hover:bg-[#00ff88]/20">
              D
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-black tracking-[.12em]">
                DERA<span className="text-[#00ff88]">3</span>
              </span>
              <span className="mt-1 block text-[9px] tracking-[.2em] text-gray-500">
                CYBER SECURITY
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden items-center gap-2 text-[10px] tracking-wider text-gray-500 sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88]" />
              SYSTEM ONLINE
            </span>
            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-bold text-gray-300 transition hover:border-[#00ff88]/40 hover:text-[#00ff88] sm:px-5"
            >
              <span aria-hidden="true">← </span>
              الرئيسية
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pt-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="transition hover:text-[#00ff88]">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-gray-300">تفاصيل الكورس</span>
          <span className="mr-auto font-mono text-[10px] tracking-wider text-gray-600">
            ID: {String(course.id).slice(0, 12).toUpperCase()}
          </span>
        </div>

        {/* Hero */}
        <section className="grid items-start gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
          <div className="min-w-0 pt-2">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00ff88]/25 bg-[#00ff88]/[0.06] px-4 py-2 text-[10px] font-bold tracking-[.12em] text-[#00ff88] sm:text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00ff88] opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00ff88]" />
              </span>
              COURSE MODULE / ACTIVE
            </div>

            <h1 className="max-w-3xl break-words text-3xl font-black leading-[1.45] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.4rem]">
              {title}
              <span className="mt-2 block text-[#00ff88]">
                ابدأ رحلتك التقنية
              </span>
            </h1>

            <p className="mt-6 max-w-2xl whitespace-pre-wrap text-sm leading-8 text-gray-400 sm:text-base sm:leading-9">
              {description}
            </p>

            {/* Course metadata */}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
                <p className="text-[10px] text-gray-500">نوع الكورس</p>
                <p className="mt-1 text-sm font-bold text-white">
                  {isFree ? "مجاني بالكامل" : "كورس مدفوع"}
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
                <p className="text-[10px] text-gray-500">الوصول للمحتوى</p>
                <p className="mt-1 text-sm font-bold text-white">
                  عبر المنصة
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
                <p className="text-[10px] text-gray-500">معرّف الوحدة</p>
                <p className="mt-1 font-mono text-xs font-bold text-[#00ff88]">
                  #{String(course.id).slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Price and CTA */}
            <div className="dera3-panel mt-8 rounded-2xl p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500">استثمر في مهاراتك</p>
                  <p className="mt-2 text-2xl font-black text-[#00ff88] sm:text-3xl">
                    {isFree ? "مجاني بالكامل" : formatPrice(course.price)}
                  </p>
                </div>
                <span className="rounded-lg border border-[#00ff88]/20 bg-[#00ff88]/[0.06] px-3 py-2 text-[10px] text-[#00ff88]">
                  {isFree ? "FREE ACCESS" : "ENROLLMENT"}
                </span>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#00ff88] px-5 py-4 text-center text-sm font-black text-[#041009] shadow-[0_0_28px_rgba(0,255,136,.15)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#35ffa2] hover:shadow-[0_0_35px_rgba(0,255,136,.3)] focus:outline-none focus:ring-2 focus:ring-[#00ff88] focus:ring-offset-2 focus:ring-offset-[#050807] sm:text-base"
              >
                <span>اطلب الكورس الآن</span>
                <span aria-hidden="true" className="text-lg">↗</span>
              </a>

              <p className="mt-3 text-center text-[10px] leading-6 text-gray-500">
                سيتم فتح واتساب للتواصل بخصوص الكورس وطريقة الحصول عليه.
              </p>
            </div>
          </div>

          {/* Course image */}
          <div className="min-w-0">
            <div className="dera3-scan dera3-glow group relative isolate aspect-[4/3] overflow-hidden rounded-2xl border border-[#00ff88]/25 bg-[#0b100e] sm:aspect-[5/4] lg:aspect-[4/4]">
              <img
                src={imageUrl}
                alt={`صورة كورس ${title}`}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#050807] via-[#050807]/20 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-l from-[#00ff88]/[0.08] to-transparent" />

              <div className="absolute right-4 top-4 flex items-center gap-2 rounded-lg border border-white/15 bg-black/60 px-3 py-2 text-[10px] text-white backdrop-blur-md sm:right-5 sm:top-5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
                DERA3 LEARNING MODULE
              </div>

              <div className="absolute bottom-0 right-0 w-full p-5 sm:p-7">
                <p className="mb-2 font-mono text-[10px] tracking-[.2em] text-[#00ff88]">
                  KNOWLEDGE // SKILLS // PRACTICE
                </p>
                <h2 className="max-w-lg break-words text-2xl font-black leading-relaxed sm:text-3xl">
                  {title}
                </h2>
                <div className="mt-4 flex items-center gap-2">
                  <span className="h-1 w-12 rounded-full bg-[#00ff88]" />
                  <span className="h-1 w-5 rounded-full bg-[#00ff88]/40" />
                  <span className="h-1 w-2 rounded-full bg-[#00ff88]/20" />
                </div>
              </div>
            </div>

            {/* Terminal card */}
            <div className="dera3-panel mt-4 overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#00ff88]" />
                </div>
                <span className="font-mono text-[10px] text-gray-500">
                  dera3@learning:~
                </span>
              </div>
              <div className="space-y-1 p-4 sm:p-5">
                <TerminalLine command="root@dera3:~$">
                  initialize_learning_module
                </TerminalLine>
                <TerminalLine command="[OK]">
                  Course data loaded successfully
                </TerminalLine>
                <TerminalLine command="[READY]">
                  جاهز تبدأ خطوة جديدة في رحلتك التقنية.
                </TerminalLine>
                <div className="mt-2 flex items-center gap-2 font-mono text-xs text-[#00ff88]">
                  <span>root@dera3:~$</span>
                  <span className="inline-block h-4 w-2 animate-pulse bg-[#00ff88]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning content */}
        <section className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-[.85fr_1.15fr]">
          <div className="dera3-panel relative overflow-hidden rounded-2xl p-5 sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-[#00ff88]/[0.07] blur-3xl" />

            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00ff88]/20 bg-[#00ff88]/[0.08] font-mono text-lg text-[#00ff88]">
                  ✓
                </span>
                <div>
                  <p className="text-[10px] tracking-[.15em] text-[#00ff88]">
                    LEARNING OBJECTIVES
                  </p>
                  <h2 className="mt-1 text-lg font-black sm:text-xl">
                    ماذا ستتعلم؟
                  </h2>
                </div>
              </div>

              <div className="mb-5 h-px bg-gradient-to-l from-[#00ff88]/30 via-white/[0.07] to-transparent" />

              {learnPoints.length > 0 ? (
                <ul className="space-y-4">
                  {learnPoints.map((item, index) => (
                    <li key={`${index}-${item}`} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#00ff88]/20 bg-[#00ff88]/[0.06] font-mono text-xs text-[#00ff88]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 whitespace-pre-wrap break-words text-sm leading-7 text-gray-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-8 text-gray-500">
                  سيتم إضافة أهداف التعلم لهذا الكورس قريبًا.
                </p>
              )}
            </div>
          </div>

          <div className="dera3-panel relative overflow-hidden rounded-2xl p-5 sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/[0.05] blur-3xl" />

            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00ff88]/20 bg-[#00ff88]/[0.08] font-mono text-lg text-[#00ff88]">
                  {"</>"}
                </span>
                <div>
                  <p className="text-[10px] tracking-[.15em] text-[#00ff88]">
                    COURSE OVERVIEW
                  </p>
                  <h2 className="mt-1 text-lg font-black sm:text-xl">
                    تفاصيل ومحتوى الكورس
                  </h2>
                </div>
              </div>

              <div className="mb-5 h-px bg-gradient-to-l from-[#00ff88]/30 via-white/[0.07] to-transparent" />

              {content.trim() ? (
                <div className="whitespace-pre-wrap break-words text-sm leading-8 text-gray-300 sm:text-base sm:leading-9">
                  {content}
                </div>
              ) : (
                <p className="text-sm leading-8 text-gray-500">
                  تفاصيل المحتوى سيتم إضافتها قريبًا. يمكنك التواصل للاستفسار عن
                  موضوعات الكورس قبل الاشتراك.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative mt-8 overflow-hidden rounded-2xl border border-[#00ff88]/20 bg-gradient-to-l from-[#00ff88]/[0.09] via-[#0b100e] to-[#0b100e] p-6 sm:p-8 lg:mt-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div className="pointer-events-none absolute -left-10 -top-20 h-52 w-52 rounded-full bg-[#00ff88]/[0.07] blur-3xl" />
          <div className="relative">
            <p className="font-mono text-[10px] tracking-[.2em] text-[#00ff88]">
              YOUR NEXT LEVEL STARTS HERE
            </p>
            <h2 className="mt-3 text-xl font-black leading-relaxed sm:text-2xl">
              مستعد تطور مهاراتك؟
            </h2>
            <p className="mt-2 text-sm leading-7 text-gray-400">
              تواصل معنا لمعرفة خطوات الاشتراك والتفاصيل المتاحة للكورس.
            </p>
          </div>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#00ff88] px-6 py-3 text-sm font-black text-black transition hover:bg-[#35ffa2] lg:mt-0 lg:shrink-0"
          >
            تواصل عبر واتساب
            <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-8 border-t border-[#00ff88]/15 bg-black/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-7 text-center sm:px-6 md:flex-row md:text-right lg:px-8">
          <Link href="/" className="text-sm font-black tracking-[.12em]">
            DERA<span className="text-[#00ff88]">3</span>
            <span className="mr-2 text-gray-500">CYBER</span>
          </Link>
          <p className="text-[10px] leading-6 text-gray-500">
            DERA3 CYBER // LEARN • BUILD • DEFEND
          </p>
          <Link
            href="/"
            className="text-xs text-gray-400 transition hover:text-[#00ff88]"
          >
            العودة إلى جميع الكورسات ↑
          </Link>
        </div>
      </footer>
    </div>
  );
}