"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type Course = {
  id: string | number;
  title: string;
  description?: string | null;
  image_url?: string | null;
  language?: string | null;
  system?: string | null;
  price?: number | string | null;
  is_free?: boolean | null;
};

const categories = [
  "الكل",
  "Cybersecurity",
  "Networking",
  "Linux",
  "Programming",
  "OSINT",
];

const quotes = [
  {
    text: "الأمن السيبراني ليس منتجًا تشتريه، بل عملية مستمرة تبنيها.",
    author: "مبدأ في الحماية الرقمية",
  },
  {
    text: "أقوى دفاع رقمي يبدأ بالوعي والمعرفة.",
    author: "تعلّم قبل أن تتعرّض للخطر",
  },
  {
    text: "تعلّم كيف تفكر كمهاجم، لتبني دفاعًا أقوى.",
    author: "فكّر كخبير أمن سيبراني",
  },
  {
    text: "في العالم الرقمي، كل ثغرة درس وكل حماية خطوة للأمام.",
    author: "DERA3 CYBER",
  },
];

const terminalCommands = [
  [
    { text: "┌──(kali㉿dera3)-[~]", color: "text-emerald-400" },
    { text: "└─$ whoami", color: "text-white" },
    { text: "cybersecurity-learner", color: "text-cyan-300" },
  ],
  [
    { text: "┌──(kali㉿dera3)-[~]", color: "text-emerald-400" },
    { text: "└─$ python --version", color: "text-white" },
    { text: "Python 3.x", color: "text-cyan-300" },
  ],
  [
    { text: "┌──(kali㉿dera3)-[~]", color: "text-emerald-400" },
    { text: "└─$ echo 'Learn. Build. Protect.'", color: "text-white" },
    { text: "Learn. Build. Protect.", color: "text-emerald-300" },
  ],
  [
    { text: "┌──(kali㉿dera3)-[~]", color: "text-emerald-400" },
    { text: "└─$ ip addr", color: "text-white" },
    { text: "Network basics: ready", color: "text-cyan-300" },
  ],
];

function ShieldIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CodeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m8 17-5-5 5-5M16 7l5 5-5 5M14 4l-4 16" />
    </svg>
  );
}

function DragonMark() {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dragonGreen" x1="20" y1="20" x2="280" y2="280">
          <stop stopColor="#39ff88" />
          <stop offset="1" stopColor="#00bfa5" />
        </linearGradient>
      </defs>
      <g
        stroke="url(#dragonGreen)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M35 90 82 48 139 59 183 38 237 56 270 91 226 87 204 110 183 116 161 146 136 160 117 190 84 202 53 185 76 164 94 143 77 123 35 90Z" />
        <path d="m82 48 17 48 38 21 24 29" />
        <path d="m183 38 12 36 42 12" />
        <path d="m204 110 37 24 27-8-22 30-36 5-25-15" />
        <path d="m117 190-10 35 32 18 27-12-7-26" />
        <path d="m53 185-19 31 31 23 42-14" />
        <path d="m136 160 16 24 32 3 25-26" />
        <path d="m97 96 21-5 15 10-22 5" />
        <path d="m220 63 19-7 13 14" />
      </g>
      <circle cx="108" cy="101" r="4" fill="#39ff88" />
      <path
        d="m176 205 25 13 16 28-28-10-13-31Z"
        stroke="#39ff88"
        strokeWidth="4"
      />
      <path
        d="m201 218 33-9 20 14-29 7"
        stroke="#39ff88"
        strokeWidth="4"
      />
    </svg>
  );
}

function TerminalWindow() {
  const [commandIndex, setCommandIndex] = useState(0);
  const [typedCount, setTypedCount] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const lines = terminalCommands[commandIndex];

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (lineIndex >= lines.length) {
      setFinished(true);
      timeout = setTimeout(() => {
        setCommandIndex((current) => (current + 1) % terminalCommands.length);
        setLineIndex(0);
        setTypedCount(0);
        setFinished(false);
      }, 1900);
    } else {
      const currentLine = lines[lineIndex].text;

      if (typedCount < currentLine.length) {
        timeout = setTimeout(() => {
          setTypedCount((current) => current + 1);
        }, 36);
      } else {
        timeout = setTimeout(() => {
          setLineIndex((current) => current + 1);
          setTypedCount(0);
        }, 450);
      }
    }

    return () => clearTimeout(timeout);
  }, [commandIndex, lineIndex, typedCount, lines]);

  return (
    <div
      dir="ltr"
      className="terminal-glow w-full overflow-hidden rounded-2xl border border-emerald-400/40 bg-[#020704]/95"
    >
      <div className="flex items-center justify-between gap-2 border-b border-emerald-400/20 bg-white/[0.025] px-3 py-3 sm:px-4">
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="truncate font-mono text-[10px] text-gray-400 sm:text-xs">
          kali@dera3: ~
        </span>
        <span className="shrink-0 font-mono text-[9px] text-emerald-400 sm:text-[10px]">
          TERMINAL
        </span>
      </div>

      <div className="relative min-h-[245px] overflow-hidden p-4 sm:min-h-[320px] sm:p-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,255,136,.05) 1px, transparent 1px)",
            backgroundSize: "100% 25px",
          }}
        />

        <div className="relative z-10 space-y-3 font-mono text-[11px] leading-6 sm:text-sm">
          {lines.slice(0, lineIndex).map((line, index) => (
            <div key={`${commandIndex}-${index}`} className={line.color}>
              {line.text}
            </div>
          ))}

          {lineIndex < lines.length && (
            <div className={lines[lineIndex].color}>
              {lines[lineIndex].text.slice(0, typedCount)}
              <span className="terminal-cursor ml-0.5 text-emerald-400">
                ▋
              </span>
            </div>
          )}

          {finished && (
            <div className="text-emerald-400">
              └─$ <span className="terminal-cursor">▋</span>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute bottom-3 right-3 h-24 w-24 opacity-[0.08] sm:bottom-5 sm:right-5 sm:h-32 sm:w-32">
          <DragonMark />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-emerald-400/15 px-3 py-3 sm:px-4">
        <span className="font-mono text-[9px] tracking-wider text-gray-500 sm:text-[10px]">
          DERA3 CYBER LAB
        </span>
        <span className="flex items-center gap-2 font-mono text-[9px] text-emerald-400 sm:text-[10px]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          SYSTEM READY
        </span>
      </div>
    </div>
  );
}

function QuoteCard() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((current) => (current + 1) % quotes.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  const quote = quotes[quoteIndex];

  return (
    <div className="rounded-2xl border border-emerald-400/25 bg-[#07110b]/90 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[.18em] text-emerald-400">
          CYBER WISDOM
        </span>
        <span className="text-3xl leading-none text-emerald-400">“</span>
      </div>

      <p
        key={quoteIndex}
        className="quote-fade mt-3 min-h-[92px] text-base font-bold leading-8 text-gray-100 sm:text-lg"
      >
        {quote.text}
      </p>

      <div className="mt-4 border-t border-white/[0.08] pt-4 text-xs text-gray-500">
        {quote.author}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-[10px] text-gray-600">
          {String(quoteIndex + 1).padStart(2, "0")} /{" "}
          {String(quotes.length).padStart(2, "0")}
        </span>
        <div className="flex gap-1.5">
          {quotes.map((item, index) => (
            <button
              key={item.author}
              type="button"
              aria-label={`عرض الاقتباس ${index + 1}`}
              onClick={() => setQuoteIndex(index)}
              className={`h-2 rounded-full transition-all ${
                quoteIndex === index
                  ? "w-6 bg-emerald-400"
                  : "w-2 bg-gray-700 hover:bg-emerald-400/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");

  useEffect(() => {
    let mounted = true;

    async function fetchCourses() {
      try {
        const supabase = createClient();

        const { data, error: queryError } = await supabase
          .from("courses")
          .select("*")
          .order("created_at", { ascending: false });

        if (!mounted) return;

        if (queryError) {
          setError("تعذر تحميل الكورسات. حاول تحديث الصفحة.");
          return;
        }

        setCourses((data ?? []) as Course[]);
      } catch {
        if (mounted) {
          setError("حدث خطأ في الاتصال. تحقق من الإنترنت وحاول مجددًا.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCourses();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredCourses = courses.filter((course) => {
    const searchable =
      `${course.title ?? ""} ${course.description ?? ""} ${course.system ?? ""}`.toLowerCase();

    const matchesSearch = searchable.includes(search.trim().toLowerCase());

    const categoryPatterns: Record<string, RegExp> = {
      Cybersecurity: /security|cyber|أمن|اختراق|حماية/i,
      Networking: /network|شبك/i,
      Linux: /linux|kali|لينكس/i,
      Programming: /program|coding|برمج/i,
      OSINT: /osint|معلومات مفتوحة/i,
    };

    return (
      matchesSearch &&
      (activeCategory === "الكل" ||
        Boolean(categoryPatterns[activeCategory]?.test(searchable)))
    );
  });

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-x-clip bg-[#030605] text-white selection:bg-emerald-400 selection:text-black"
    >
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes terminalBlink {
          50% { opacity: 0; }
        }

        @keyframes heroFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes quoteFade {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes backgroundPulse {
          0%, 100% { opacity: .07; }
          50% { opacity: .14; }
        }

        .terminal-cursor {
          animation: terminalBlink 1s steps(2, start) infinite;
        }

        .hero-terminal {
          animation: heroFloat 6s ease-in-out infinite;
        }

        .quote-fade {
          animation: quoteFade .4s ease-out;
        }

        .dragon-watermark {
          animation: backgroundPulse 7s ease-in-out infinite;
        }

        .cyber-grid {
          background-image:
            linear-gradient(rgba(0,255,136,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,.04) 1px, transparent 1px);
          background-size: 38px 38px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
        }

        .terminal-glow {
          box-shadow: 0 0 45px rgba(0,255,136,.09);
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="cyber-grid absolute inset-0" />

        <div className="absolute -top-40 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-emerald-400/[0.08] blur-[100px] sm:h-[500px] sm:w-[500px]" />

        <div className="absolute right-[-100px] top-[45%] h-64 w-64 rounded-full bg-cyan-500/[0.05] blur-[100px]" />

        <div className="dragon-watermark absolute -left-24 top-24 h-[330px] w-[330px] opacity-40 sm:-left-32 sm:top-16 sm:h-[520px] sm:w-[520px] lg:-left-36 lg:h-[650px] lg:w-[650px]">
          <DragonMark />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030605]/20 to-[#030605]" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-emerald-400/15 bg-[#030605]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/[0.08] text-emerald-400 sm:h-11 sm:w-11">
              <ShieldIcon size={27} />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-black tracking-wider sm:text-xl">
                DERA<span className="text-emerald-400">3</span>
              </div>
              <div className="text-[8px] tracking-[.22em] text-gray-500 sm:text-[9px] sm:tracking-[.3em]">
                CYBER SECURITY
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-6 text-sm text-gray-400 md:flex lg:gap-8">
            <a href="#home" className="transition hover:text-emerald-400">الرئيسية</a>
            <a href="#paths" className="transition hover:text-emerald-400">المسارات</a>
            <a href="#courses" className="transition hover:text-emerald-400">الكورسات</a>
            <a href="#about" className="transition hover:text-emerald-400">عن المنصة</a>
          </div>

          <Link
            href="/admin"
            className="shrink-0 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2.5 text-[11px] font-bold text-emerald-300 transition hover:bg-emerald-400 hover:text-black sm:px-4 sm:text-xs"
          >
            لوحة الإدارة
          </Link>
        </nav>

        <div className="flex items-center justify-center gap-6 border-t border-white/[0.04] px-3 py-2 text-[11px] text-gray-400 md:hidden">
          <a href="#home" className="hover:text-emerald-400">الرئيسية</a>
          <a href="#paths" className="hover:text-emerald-400">المسارات</a>
          <a href="#courses" className="hover:text-emerald-400">الكورسات</a>
          <a href="#about" className="hover:text-emerald-400">عن المنصة</a>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20 md:grid-cols-2 md:gap-8 lg:gap-14 lg:px-8 lg:py-24"
      >
        <div className="min-w-0">
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-400/25 bg-[#030605]/70 px-3 py-2 text-[10px] text-emerald-300 sm:gap-3 sm:px-4 sm:text-xs">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" />
            <span>منصتك للتعلم والأمن السيبراني</span>
          </div>

          <h1 className="text-3xl font-black leading-[1.5] tracking-tight sm:text-5xl sm:leading-[1.4] lg:text-6xl">
            ابدأ الآن في
            <br />
            عالم
            <span className="block bg-gradient-to-l from-emerald-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              الأمن السيبراني
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-8 text-gray-400 sm:mt-6 sm:text-base lg:text-lg">
            تعلّم الشبكات ولينكس والبرمجة وحماية الأنظمة من خلال DERA3 Cyber.
            ابدأ من الصفر وطوّر مهاراتك خطوة بخطوة.
          </p>

          <div className="mt-7 flex flex-col gap-3 min-[400px]:flex-row sm:mt-9">
            <a
              href="#courses"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-emerald-300 sm:px-7 sm:text-base"
            >
              ابدأ التعلم الآن <span>←</span>
            </a>
            <a
              href="#paths"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#030605]/70 px-6 py-3.5 text-sm font-bold text-gray-200 transition hover:border-emerald-400/40 hover:text-emerald-400"
            >
              استكشف المسارات <CodeIcon size={18} />
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-[11px] text-gray-400 sm:mt-10 sm:gap-x-6 sm:text-xs">
            <span className="flex items-center gap-2">
              <ShieldIcon size={16} /> تعلّم بشكل عملي
            </span>
            <span className="flex items-center gap-2">
              <CodeIcon size={16} /> طوّر مهاراتك
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✦</span> ابدأ من مستواك
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full min-w-0 max-w-xl md:max-w-none">
          <div className="pointer-events-none absolute inset-[10%] rounded-full bg-emerald-400/[0.10] blur-[65px] sm:blur-[90px]" />
          <div className="hero-terminal relative w-full">
            <TerminalWindow />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1 text-[10px] text-gray-500 sm:px-2 sm:text-xs">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              DERA3 LEARNING ENVIRONMENT
            </span>
            <span className="font-mono">LEARN // BUILD // PROTECT</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: <ShieldIcon size={25} />,
              title: "الأمن السيبراني",
              description: "افهم أساسيات الحماية",
            },
            {
              icon: <CodeIcon size={25} />,
              title: "التطبيق العملي",
              description: "طوّر معرفتك التقنية",
            },
            {
              icon: <span className="text-2xl">&lt;/&gt;</span>,
              title: "مسارات متعددة",
              description: "شبكات ولينكس وبرمجة",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#050906]/80 p-4 transition hover:border-emerald-400/25 sm:p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-400 sm:h-12 sm:w-12">
                {item.icon}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold sm:text-base">{item.title}</h2>
                <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Learning paths */}
      <section
        id="paths"
        className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="mb-8 sm:mb-10">
          <div className="font-mono text-[10px] tracking-[.22em] text-emerald-400 sm:text-xs">
            CHOOSE YOUR PATH
          </div>
          <h2 className="mt-3 text-2xl font-black sm:text-4xl">
            اختار مسارك التقني
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-500">
            استكشف المجالات المختلفة وابدأ في المجال المناسب لك.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {[
            { title: "الأمن السيبراني", english: "CYBERSECURITY", icon: <ShieldIcon size={30} />, category: "Cybersecurity" },
            { title: "الشبكات", english: "NETWORKING", icon: <span className="text-3xl">⌘</span>, category: "Networking" },
            { title: "لينكس", english: "LINUX SYSTEMS", icon: <CodeIcon size={30} />, category: "Linux" },
            { title: "البرمجة", english: "PROGRAMMING", icon: <span className="text-3xl">&lt;/&gt;</span>, category: "Programming" },
          ].map((path) => (
            <button
              key={path.category}
              type="button"
              onClick={() => {
                setActiveCategory(path.category);
                document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#080d0a]/95 p-5 text-right transition hover:-translate-y-1 hover:border-emerald-400/35 sm:p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-emerald-400 sm:h-14 sm:w-14">
                {path.icon}
              </div>
              <h3 className="mt-5 text-base font-black sm:mt-6 sm:text-lg">{path.title}</h3>
              <div className="mt-2 break-words font-mono text-[9px] tracking-[.12em] text-gray-600 sm:text-[10px] sm:tracking-[.18em]">
                {path.english}
              </div>
              <div className="mt-5 flex items-center justify-between gap-2 text-xs text-gray-500 sm:text-sm">
                <span>استكشف الكورسات</span>
                <span className="text-emerald-400">←</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section
        id="courses"
        className="relative z-10 border-y border-emerald-400/10 bg-[#050906]/90 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="font-mono text-[10px] tracking-[.22em] text-emerald-400 sm:text-xs">
                THE LEARNING HUB
              </div>
              <h2 className="mt-3 text-2xl font-black sm:text-4xl">الكورسات المتاحة</h2>
              <p className="mt-3 text-sm leading-7 text-gray-500">
                اكتشف المحتوى التعليمي المتاح على المنصة.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] px-4 py-3 font-mono text-xs text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {courses.length} COURSES
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث عن كورس..."
              aria-label="ابحث عن كورس"
              className="w-full min-w-0 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-400/50 sm:px-5"
            />

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-lg border px-3 py-2.5 text-[10px] font-bold transition sm:px-4 sm:text-xs ${
                    activeCategory === category
                      ? "border-emerald-400 bg-emerald-400 text-black"
                      : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-emerald-400/30 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="mt-8 grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse overflow-hidden rounded-2xl border border-white/10">
                  <div className="h-44 bg-white/[0.04] sm:h-48" />
                  <div className="space-y-4 p-5">
                    <div className="h-4 w-2/3 rounded bg-white/10" />
                    <div className="h-3 w-full rounded bg-white/[0.05]" />
                    <div className="h-3 w-1/2 rounded bg-white/[0.05]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/[0.04] px-4 py-12 text-center">
              <p className="text-sm text-red-300">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-lg border border-white/10 px-5 py-3 text-sm hover:border-emerald-400/40"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-white/10 px-4 py-14 text-center sm:py-16">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-400">
                <CodeIcon size={28} />
              </div>
              <h3 className="mt-5 text-base font-bold sm:text-lg">
                {courses.length === 0 ? "لسه مفيش كورسات مضافة" : "مفيش نتائج مطابقة"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-gray-500">
                {courses.length === 0
                  ? "الكورسات التي تضيفها من لوحة الإدارة ستظهر هنا."
                  : "جرّب كلمة بحث مختلفة أو اختر تصنيفًا آخر."}
              </p>
              {(activeCategory !== "الكل" || search) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("الكل");
                    setSearch("");
                  }}
                  className="mt-5 text-sm font-bold text-emerald-400 hover:text-emerald-300"
                >
                  عرض كل الكورسات
                </button>
              )}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {filteredCourses.map((course) => (
                <article
                  key={course.id}
                  className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#080d0a] transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_15px_50px_rgba(0,255,136,.07)]"
                >
                  <div className="absolute right-0 top-0 z-10 h-[2px] w-0 bg-emerald-400 transition-all duration-500 group-hover:w-full" />

                  <div className="relative h-44 overflow-hidden bg-[#0b130e] sm:h-48">
                    {course.image_url ? (
                      <img
                        src={course.image_url}
                        alt={course.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-950 via-[#07120e] to-[#081c26] text-emerald-400">
                        <ShieldIcon size={60} />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#080d0a] via-transparent to-black/10" />
                    <div className="absolute right-3 top-3 rounded-lg border border-emerald-400/30 bg-black/70 px-3 py-1.5 font-mono text-[10px] text-emerald-300">
                      {course.language || "AR"}
                    </div>
                    <div className="absolute bottom-3 left-3 max-w-[60%] truncate rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 text-[10px] text-gray-200">
                      {course.system || "GENERAL"}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="break-words text-base font-black leading-7 transition group-hover:text-emerald-300 sm:text-lg">
                      {course.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 min-h-[60px] break-words text-xs leading-6 text-gray-500 sm:text-sm">
                      {course.description || "اكتشف محتوى الكورس وتفاصيله."}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                      <div>
                        <div className="text-[10px] text-gray-600">سعر الكورس</div>
                        <div className="mt-1 break-words text-base font-black text-emerald-400 sm:text-lg">
                          {course.is_free
                            ? "مجاني"
                            : course.price != null
                              ? `${course.price} ج.م`
                              : "السعر غير محدد"}
                        </div>
                      </div>

                      <Link
                        href={`/course/${course.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/35 bg-emerald-400/[0.06] px-3 py-3 text-[10px] font-black text-emerald-300 transition hover:bg-emerald-400 hover:text-black sm:px-4 sm:text-xs"
                      >
                        عرض الكورس <span>←</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cyber quote */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-5 md:grid-cols-[1.4fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-gradient-to-l from-emerald-950/40 to-[#07110b] p-6 sm:p-9">
            <div className="pointer-events-none absolute -left-8 -top-8 h-36 w-36 opacity-10">
              <DragonMark />
            </div>
            <div className="relative">
              <div className="font-mono text-[10px] tracking-[.2em] text-emerald-400 sm:text-xs">
                YOUR JOURNEY STARTS HERE
              </div>
              <h2 className="mt-4 text-xl font-black leading-relaxed sm:text-3xl">
                ابدأ الآن في عالم الأمن السيبراني
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400">
                اكتشف الكورسات المتاحة على درع، وتعلّم أساسيات التكنولوجيا
                والأمن السيبراني خطوة بخطوة.
              </p>
              <a
                href="#courses"
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-emerald-400 px-6 py-3 text-sm font-black text-black transition hover:bg-emerald-300"
              >
                ابدأ التعلم <span>←</span>
              </a>
            </div>
          </div>

          <QuoteCard />
        </div>
      </section>

      {/* Footer */}
      <footer
        id="about"
        className="relative z-10 border-t border-white/[0.08] bg-black/50"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/[0.05] text-emerald-400">
              <ShieldIcon size={24} />
            </div>
            <div>
              <div className="font-black tracking-widest">
                DERA<span className="text-emerald-400">3</span>
              </div>
              <div className="font-mono text-[9px] tracking-[.2em] text-gray-600">
                CYBER SECURITY
              </div>
            </div>
          </Link>

          <p className="text-xs leading-6 text-gray-600">
            منصة درع للتعلم التقني والأمن السيبراني.
            <br />
            © {new Date().getFullYear()} DERA3 CYBER
          </p>

          <div className="flex flex-wrap gap-5 text-xs text-gray-500">
            <a href="#home" className="transition hover:text-emerald-400">الرئيسية</a>
            <a href="#courses" className="transition hover:text-emerald-400">الكورسات</a>
            <Link href="/admin" className="transition hover:text-emerald-400">الإدارة</Link>
          </div>
        </div>
        <div className="border-t border-white/[0.05] py-3 text-center font-mono text-[9px] tracking-[.2em] text-emerald-400/70">
          LEARN // BUILD // PROTECT
        </div>
      </footer>
    </main>
  );
}