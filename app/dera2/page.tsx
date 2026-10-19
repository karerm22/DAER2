"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Category =
  | "Cybersecurity"
  | "Networking"
  | "Linux"
  | "Programming"
  | "OSINT";

type Course = {
  id: string | number;
  title: string;
  description?: string | null;
  image_url?: string | null;
  language?: string | null;
  system?: string | null;
  price?: number | string | null;
  is_free?: boolean | null;
  whatsapp_number?: string | null;
  content?: string | null;
  learn_points?: string[] | null;
  external_url?: string | null;
  category?: string | null;
};

const categoryOptions: {
  value: Category;
  label: string;
  icon: string;
}[] = [
  { value: "Cybersecurity", label: "الأمن السيبراني", icon: "🛡️" },
  { value: "Networking", label: "الشبكات", icon: "🌐" },
  { value: "Linux", label: "لينكس", icon: "🐧" },
  { value: "Programming", label: "البرمجة", icon: "💻" },
  { value: "OSINT", label: "جمع المعلومات OSINT", icon: "🔎" },
];

const emptyCourse = {
  title: "",
  description: "",
  price: 0,
  is_free: false,
  whatsapp_number: "",
  image_url: "",
  content: "",
  learn_points: "",
  language: "عربي",
  system: "ويندوز",
  external_url: "",
  category: "Cybersecurity" as Category,
};

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-white/[0.08] bg-[#080d0a] shadow-[0_10px_40px_rgba(0,0,0,0.12)] ${className}`}
    >
      {children}
    </section>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <p className="font-mono text-[10px] tracking-[0.2em] text-emerald-400 sm:text-xs">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-black sm:text-2xl">{title}</h2>
      {description && (
        <p className="mt-2 text-xs leading-6 text-gray-500 sm:text-sm">
          {description}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full min-w-0 rounded-xl border border-white/10 bg-[#030605] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10";

export default function AdminPage() {
  const supabase = useMemo(() => createClient(), []);

  const [session, setSession] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("courses");
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  const [newCourse, setNewCourse] = useState({ ...emptyCourse });

  useEffect(() => {
    let mounted = true;

    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(session);
      setCheckingAuth(false);

      if (session) {
        await fetchData();
      }
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const [{ data: usersData }, { data: coursesData, error }] =
        await Promise.all([
          supabase.from("profiles").select("*"),
          supabase
            .from("courses")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

      if (usersData) setUsers(usersData);

      if (error) {
        alert("تعذر تحميل الكورسات: " + error.message);
      } else if (coursesData) {
        setCourses(coursesData as Course[]);
      }
    } catch {
      alert("حدث خطأ أثناء تحميل بيانات لوحة الإدارة.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const loginEmail = email.includes("@")
      ? email.trim().toLowerCase()
      : `${email.trim().toLowerCase()}@dera3.com`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (error) {
      setAuthError("بيانات الدخول غير صحيحة. راجع الإيميل وكلمة المرور.");
      setAuthLoading(false);
      return;
    }

    setSession(data.session);
    await fetchData();
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setEmail("");
    setPassword("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewCourse({ ...emptyCourse });
    setImageFile(null);
  };

  const startEdit = (course: Course) => {
    setEditingId(String(course.id));

    setNewCourse({
      title: course.title || "",
      description: course.description || "",
      price: Number(course.price || 0),
      is_free: Boolean(course.is_free),
      whatsapp_number: course.whatsapp_number || "",
      image_url: course.image_url || "",
      content: course.content || "",
      learn_points: Array.isArray(course.learn_points)
        ? course.learn_points.join(", ")
        : "",
      language: course.language || "عربي",
      system: course.system || "ويندوز",
      external_url: course.external_url || "",
      category: categoryOptions.some(
        (item) => item.value === course.category
      )
        ? (course.category as Category)
        : "Cybersecurity",
    });

    setImageFile(null);
    setActiveTab("courses");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    try {
      let uploadedImageUrl = newCourse.image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop() || "jpg";
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("courses")
          .upload(fileName, imageFile);

        if (uploadError) {
          alert("خطأ في رفع الصورة: " + uploadError.message);
          return;
        }

        const { data } = supabase.storage
          .from("courses")
          .getPublicUrl(fileName);

        uploadedImageUrl = data.publicUrl;
      }

      const learnArray = newCourse.learn_points
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const courseData = {
        ...newCourse,
        category: newCourse.category,
        image_url: uploadedImageUrl,
        price: newCourse.is_free ? 0 : Number(newCourse.price),
        learn_points: learnArray,
      };

      if (editingId) {
        const { error } = await supabase
          .from("courses")
          .update(courseData)
          .eq("id", editingId);

        if (error) {
          alert("تعذر تحديث الكورس: " + error.message);
          return;
        }

        alert("تم تحديث الكورس بنجاح.");
      } else {
        const { error } = await supabase
          .from("courses")
          .insert([courseData]);

        if (error) {
          alert("تعذر إضافة الكورس: " + error.message);
          return;
        }

        alert("تم إضافة الكورس بنجاح.");
      }

      cancelEdit();
      await fetchData();
    } catch {
      alert("حدث خطأ أثناء الحفظ. حاول مرة أخرى.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCourse = async (
    id: string | number,
    title: string
  ) => {
    if (!window.confirm(`هل تريد حذف كورس "${title}" نهائيًا؟`)) {
      return;
    }

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", id);

    if (error) {
      alert("تعذر حذف الكورس: " + error.message);
      return;
    }

    setCourses((current) => current.filter((course) => course.id !== id));

    if (editingId === String(id)) {
      cancelEdit();
    }
  };

  const visibleCourses = courses.filter((course) => {
    const matchesSearch =
      `${course.title || ""} ${course.description || ""}`
        .toLowerCase()
        .includes(courseSearch.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === "الكل" ||
      course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (checkingAuth) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#030605] text-emerald-400"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400" />
          <p className="font-mono text-sm">جاري التحقق من النظام...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div
        dir="rtl"
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030605] px-4 text-white"
      >
        <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#0a0a12_1px,transparent_1px),linear-gradient(to_bottom,#0a0a12_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40" />
        <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[100px]" />

        <div className="relative z-10 w-full max-w-md rounded-3xl border border-emerald-400/20 bg-[#080d0a]/95 p-6 shadow-[0_0_70px_rgba(0,255,136,0.08)] sm:p-9">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.08] text-emerald-400">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <p className="font-mono text-[10px] tracking-[0.25em] text-emerald-400">
              RESTRICTED ACCESS
            </p>

            <h1 className="mt-3 text-2xl font-black sm:text-3xl">
              لوحة الإدارة
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              DERA3 Cyber Management System
            </p>
          </div>

          {authError && (
            <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-3 text-sm text-red-300">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-300">
                الإيميل أو اسم المستخدم
              </label>
              <input
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@dera3.com"
                dir="ltr"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-gray-300">
                كلمة المرور
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                dir="ltr"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-xl bg-emerald-400 px-4 py-4 font-black text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {authLoading ? "جاري التحقق..." : "دخول آمن ←"}
            </button>
          </form>

          <p className="mt-6 text-center font-mono text-[10px] text-gray-600">
            DERA3 CYBER · SECURE ADMIN PANEL
          </p>
        </div>
      </div>
    );
  }

  const navigation = [
    { id: "dashboard", number: "01", label: "الإحصائيات", icon: "▦" },
    { id: "courses", number: "02", label: "إدارة الكورسات", icon: "▤" },
    { id: "users", number: "03", label: "سجل الأعضاء", icon: "♙" },
  ];

  return (
    <div
      dir="rtl"
      className="min-h-screen overflow-x-hidden bg-[#030605] text-white"
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 right-1/3 h-96 w-96 rounded-full bg-emerald-400/[0.035] blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-cyan-400/[0.025] blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 border-b border-white/[0.08] bg-[#070b08] p-4 md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-l md:p-5 lg:w-72 lg:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-400">
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="font-black tracking-wider">
                DERA<span className="text-emerald-400">3</span>
              </h1>
              <p className="font-mono text-[9px] tracking-[0.15em] text-gray-500">
                ADMIN PANEL
              </p>
            </div>
          </div>

          <div className="mt-7 hidden rounded-xl border border-emerald-400/10 bg-emerald-400/[0.035] p-3 md:block">
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              النظام متصل
            </div>
            <p className="mt-2 font-mono text-[10px] text-gray-600">
              MANAGEMENT SYSTEM V1
            </p>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto md:mt-8 md:flex-col">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex shrink-0 items-center gap-3 rounded-xl border px-3 py-3 text-right text-sm transition ${
                  activeTab === item.id
                    ? "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300"
                    : "border-transparent text-gray-400 hover:border-white/[0.06] hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] font-mono text-sm">
                  {item.icon}
                </span>
                <span className="flex-1 whitespace-nowrap">{item.label}</span>
                <span className="hidden font-mono text-[9px] opacity-40 md:inline">
                  {item.number}
                </span>
              </button>
            ))}
          </nav>

          <div className="mt-5 border-t border-white/[0.07] pt-4 md:mt-8">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-300 transition hover:bg-red-400/[0.07]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-400/[0.06]">
                ↪
              </span>
              تسجيل الخروج
            </button>
          </div>

          <div className="mt-6 hidden border-t border-white/[0.06] pt-5 md:block">
            <p className="font-mono text-[9px] leading-6 tracking-wider text-gray-600">
              LEARN // BUILD // PROTECT
              <br />
              © {new Date().getFullYear()} DERA3 CYBER
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-9">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-emerald-400">
                DERA3 / MANAGEMENT
              </p>
              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                {activeTab === "dashboard"
                  ? "نظرة عامة"
                  : activeTab === "users"
                    ? "الأعضاء"
                    : "إدارة الكورسات"}
              </h1>
              <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                تحكّم في محتوى منصتك من مكان واحد.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#080d0a] px-3 py-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/[0.08] text-emerald-400">
                ♙
              </span>
              <div>
                <p className="text-xs font-bold">مدير المنصة</p>
                <p className="mt-1 text-[10px] text-emerald-400">
                  متصل الآن
                </p>
              </div>
            </div>
          </header>

          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div>
              <SectionTitle
                eyebrow="SYSTEM OVERVIEW"
                title="إحصائيات المنصة"
                description="ملخص سريع لأهم بيانات DERA3 Cyber."
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  {
                    title: "إجمالي الكورسات",
                    value: courses.length,
                    icon: "▤",
                    description: "جميع الكورسات المسجلة",
                  },
                  {
                    title: "إجمالي الأعضاء",
                    value: users.length,
                    icon: "♙",
                    description: "حسابات الأعضاء في قاعدة البيانات",
                  },
                  {
                    title: "الكورسات المجانية",
                    value: courses.filter((course) => course.is_free).length,
                    icon: "✦",
                    description: "محتوى متاح مجانًا",
                  },
                ].map((stat) => (
                  <Panel key={stat.title} className="relative overflow-hidden p-5 sm:p-6">
                    <div className="absolute left-0 top-0 h-24 w-24 rounded-full bg-emerald-400/[0.04] blur-2xl" />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-400">{stat.title}</p>
                        <p className="mt-4 text-4xl font-black text-emerald-400">
                          {stat.value}
                        </p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] text-xl text-emerald-400">
                        {stat.icon}
                      </div>
                    </div>
                    <p className="mt-5 border-t border-white/[0.06] pt-4 text-xs text-gray-500">
                      {stat.description}
                    </p>
                  </Panel>
                ))}
              </div>

              <Panel className="mt-6 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold">توزيع الكورسات حسب القسم</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      عدد الكورسات المسجلة في كل مسار.
                    </p>
                  </div>
                  <span className="font-mono text-xs text-emerald-400">
                    {courses.length} TOTAL
                  </span>
                </div>

                <div className="mt-6 space-y-5">
                  {categoryOptions.map((category) => {
                    const count = courses.filter(
                      (course) => course.category === category.value
                    ).length;

                    const percentage =
                      courses.length > 0
                        ? (count / courses.length) * 100
                        : 0;

                    return (
                      <div key={category.value}>
                        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                          <span className="text-gray-300">
                            {category.icon} {category.label}
                          </span>
                          <span className="font-mono text-emerald-400">
                            {count}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                          <div
                            className="h-full rounded-full bg-gradient-to-l from-emerald-300 to-emerald-600 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>
          )}

          {/* Users */}
          {activeTab === "users" && (
            <div>
              <SectionTitle
                eyebrow="REGISTERED MEMBERS"
                title="سجل الأعضاء"
                description="عرض بيانات الأعضاء المحفوظة في profiles."
              />

              <Panel className="overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] p-4 sm:p-5">
                  <h3 className="font-bold">قائمة الأعضاء</h3>
                  <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.05] px-3 py-2 text-xs text-emerald-300">
                    {users.length} عضو
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-white/[0.025] text-xs text-gray-400">
                      <tr>
                        <th className="whitespace-nowrap p-4">الاسم</th>
                        <th className="whitespace-nowrap p-4">الإيميل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-t border-white/[0.05] transition hover:bg-white/[0.02]"
                        >
                          <td className="whitespace-nowrap p-4">
                            {user.username || "بدون اسم"}
                          </td>
                          <td
                            className="whitespace-nowrap p-4 text-gray-400"
                            dir="ltr"
                          >
                            {user.email || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {users.length === 0 && (
                  <p className="p-8 text-center text-sm text-gray-500">
                    لا توجد بيانات أعضاء لعرضها.
                  </p>
                )}
              </Panel>
            </div>
          )}

          {/* Courses */}
          {activeTab === "courses" && (
            <div className="space-y-8">
              <div>
                <SectionTitle
                  eyebrow="COURSE MANAGEMENT"
                  title={editingId ? "تعديل الكورس" : "إضافة كورس جديد"}
                  description={
                    editingId
                      ? "عدّل البيانات المطلوبة ثم احفظ التغييرات."
                      : "أضف محتوى جديدًا وحدّد القسم الذي ينتمي إليه."
                  }
                />

                <Panel
                  className={
                    editingId
                      ? "border-emerald-400/30 shadow-[0_0_35px_rgba(0,255,136,0.04)]"
                      : ""
                  }
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/[0.08] text-lg text-emerald-400">
                        {editingId ? "✎" : "+"}
                      </div>
                      <div>
                        <h3 className="font-bold">
                          {editingId ? "تعديل بيانات الكورس" : "بيانات الكورس"}
                        </h3>
                        <p className="mt-1 text-[10px] text-gray-500">
                          الحقول المطلوبة موضحة داخل النموذج
                        </p>
                      </div>
                    </div>

                    {editingId && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-300 transition hover:bg-red-400/10"
                      >
                        إلغاء التعديل ×
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveCourse} className="space-y-6 p-4 sm:p-6">
                    <div>
                      <h4 className="mb-4 text-xs font-bold text-emerald-300">
                        01 / المعلومات الأساسية
                      </h4>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-xs text-gray-400">
                            اسم الكورس *
                          </label>
                          <input
                            required
                            placeholder="مثال: أساسيات الأمن السيبراني"
                            value={newCourse.title}
                            onChange={(e) =>
                              setNewCourse({
                                ...newCourse,
                                title: e.target.value,
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs text-gray-400">
                            القسم التابع له الكورس *
                          </label>
                          <select
                            required
                            value={newCourse.category}
                            onChange={(e) =>
                              setNewCourse({
                                ...newCourse,
                                category: e.target.value as Category,
                              })
                            }
                            className={inputClass}
                          >
                            {categoryOptions.map((category) => (
                              <option
                                key={category.value}
                                value={category.value}
                                className="bg-[#080d0a]"
                              >
                                {category.icon} {category.label}
                              </option>
                            ))}
                          </select>
                          <p className="mt-2 text-[10px] leading-5 text-gray-500">
                            القسم الذي تختاره هنا يُحفظ مع بيانات الكورس.
                          </p>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs text-gray-400">
                            لغة الكورس
                          </label>
                          <select
                            value={newCourse.language}
                            onChange={(e) =>
                              setNewCourse({
                                ...newCourse,
                                language: e.target.value,
                              })
                            }
                            className={inputClass}
                          >
                            <option value="عربي">عربي</option>
                            <option value="إنجليزي">إنجليزي</option>
                            <option value="فرنسي">فرنسي</option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs text-gray-400">
                            النظام المستخدم
                          </label>
                          <select
                            value={newCourse.system}
                            onChange={(e) =>
                              setNewCourse({
                                ...newCourse,
                                system: e.target.value,
                              })
                            }
                            className={inputClass}
                          >
                            <option value="ويندوز">ويندوز (Windows)</option>
                            <option value="ماك">ماك (Mac)</option>
                            <option value="أندرويد">أندرويد (Android)</option>
                            <option value="لينكس">لينكس (Linux)</option>
                            <option value="الكل">الكل (Cross Platform)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/[0.06] pt-5">
                      <h4 className="mb-4 text-xs font-bold text-emerald-300">
                        02 / المحتوى التعليمي
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-xs text-gray-400">
                            وصف الكورس *
                          </label>
                          <textarea
                            required
                            rows={3}
                            placeholder="اكتب وصفًا واضحًا للكورس..."
                            value={newCourse.description}
                            onChange={(e) =>
                              setNewCourse({
                                ...newCourse,
                                description: e.target.value,
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs text-gray-400">
                            محتوى الكورس *
                          </label>
                          <textarea
                            required
                            rows={5}
                            placeholder="اكتب محتوى الكورس وتفاصيله..."
                            value={newCourse.content}
                            onChange={(e) =>
                              setNewCourse({
                                ...newCourse,
                                content: e.target.value,
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs text-gray-400">
                            ماذا سيتعلم الطالب؟ *
                          </label>
                          <input
                            required
                            placeholder="أساسيات الشبكات, Linux, الحماية"
                            value={newCourse.learn_points}
                            onChange={(e) =>
                              setNewCourse({
                                ...newCourse,
                                learn_points: e.target.value,
                              })
                            }
                            className={inputClass}
                          />
                          <p className="mt-2 text-[10px] text-gray-600">
                            افصل بين كل نقطة والثانية باستخدام الفاصلة الإنجليزية ,
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/[0.06] pt-5">
                      <h4 className="mb-4 text-xs font-bold text-emerald-300">
                        03 / السعر والتواصل
                      </h4>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#030605] p-4">
                          <div>
                            <p className="text-sm font-bold">كورس مجاني</p>
                            <p className="mt-1 text-[10px] text-gray-500">
                              تفعيل الخيار يجعل السعر صفرًا
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={newCourse.is_free}
                            onChange={(e) =>
                              setNewCourse({
                                ...newCourse,
                                is_free: e.target.checked,
                              })
                            }
                            className="h-5 w-5 accent-emerald-400"
                          />
                        </label>

                        {!newCourse.is_free && (
                          <div>
                            <label className="mb-2 block text-xs text-gray-400">
                              السعر بالجنيه المصري *
                            </label>
                            <input
                              required
                              min="0"
                              type="number"
                              value={newCourse.price}
                              onChange={(e) =>
                                setNewCourse({
                                  ...newCourse,
                                  price: Number(e.target.value),
                                })
                              }
                              className={inputClass}
                            />
                          </div>
                        )}

                        <div>
                          <label className="mb-2 block text-xs text-gray-400">
                            رقم واتساب *
                          </label>
                          <input
                            required
                            placeholder="+2010XXXXXXXX"
                            value={newCourse.whatsapp_number}
                            onChange={(e) =>
                              setNewCourse({
                                ...newCourse,
                                whatsapp_number: e.target.value,
                              })
                            }
                            dir="ltr"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs text-gray-400">
                            رابط إضافي (اختياري)
                          </label>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={newCourse.external_url}
                            onChange={(e) =>
                              setNewCourse({
                                ...newCourse,
                                external_url: e.target.value,
                              })
                            }
                            dir="ltr"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/[0.06] pt-5">
                      <h4 className="mb-4 text-xs font-bold text-emerald-300">
                        04 / صورة الكورس
                      </h4>

                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-emerald-400/25 bg-emerald-400/[0.025] p-6 text-center transition hover:border-emerald-400/50">
                        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/[0.08] text-2xl text-emerald-400">
                          ↑
                        </span>
                        <span className="text-sm font-bold">
                          {imageFile ? imageFile.name : "اختر صورة للكورس"}
                        </span>
                        <span className="mt-2 text-[10px] text-gray-500">
                          PNG أو JPG أو WEBP
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setImageFile(e.target.files?.[0] || null)
                          }
                          className="hidden"
                        />
                      </label>

                      {newCourse.image_url && !imageFile && (
                        <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/[0.07] p-3">
                          <img
                            src={newCourse.image_url}
                            alt="صورة الكورس الحالية"
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold">
                              الصورة الحالية
                            </p>
                            <p className="mt-1 text-[10px] text-gray-500">
                              ستظل كما هي إذا لم تختر صورة جديدة.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-5 sm:flex-row">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="flex-1 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-black text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {uploading
                          ? "جاري الحفظ..."
                          : editingId
                            ? "حفظ التعديلات ✓"
                            : "إضافة الكورس +"}
                      </button>

                      {editingId && (
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-xl border border-white/10 px-5 py-3.5 text-sm text-gray-300 transition hover:bg-white/[0.04]"
                        >
                          إلغاء
                        </button>
                      )}
                    </div>
                  </form>
                </Panel>
              </div>

              {/* Current courses */}
              <div>
                <SectionTitle
                  eyebrow="YOUR CONTENT LIBRARY"
                  title="الكورسات الحالية"
                  description="ابحث عن كورس أو صفِّ القائمة حسب القسم، ثم عدّل أو احذف."
                />

                <Panel className="mb-5 p-4 sm:p-5">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_240px]">
                    <input
                      value={courseSearch}
                      onChange={(e) => setCourseSearch(e.target.value)}
                      placeholder="ابحث باسم الكورس..."
                      className={inputClass}
                    />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={inputClass}
                    >
                      <option value="الكل">كل الأقسام</option>
                      {categoryOptions.map((category) => (
                        <option
                          key={category.value}
                          value={category.value}
                        >
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-gray-500">
                      الكورسات المعروضة
                    </span>
                    <span className="font-mono text-emerald-400">
                      {visibleCourses.length} / {courses.length}
                    </span>
                  </div>
                </Panel>

                {loading ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                      <Panel key={item} className="animate-pulse p-4">
                        <div className="h-36 rounded-xl bg-white/[0.05]" />
                        <div className="mt-4 h-4 w-2/3 rounded bg-white/[0.05]" />
                        <div className="mt-3 h-3 w-1/2 rounded bg-white/[0.04]" />
                      </Panel>
                    ))}
                  </div>
                ) : visibleCourses.length === 0 ? (
                  <Panel className="px-4 py-14 text-center">
                    <div className="text-3xl text-emerald-400">⌕</div>
                    <h3 className="mt-4 font-bold">
                      لا توجد كورسات مطابقة
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                      جرّب البحث بكلمة أخرى أو اختر قسمًا مختلفًا.
                    </p>
                  </Panel>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleCourses.map((course) => {
                      const category = categoryOptions.find(
                        (item) => item.value === course.category
                      );

                      return (
                        <Panel
                          key={course.id}
                          className="group overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-emerald-400/25"
                        >
                          <div className="relative h-40 overflow-hidden bg-[#0b130e]">
                            {course.image_url ? (
                              <img
                                src={course.image_url}
                                alt={course.title}
                                loading="lazy"
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-950 to-[#07110b] text-4xl text-emerald-400">
                                ▤
                              </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-[#080d0a] to-transparent" />

                            <span className="absolute right-3 top-3 rounded-lg border border-emerald-400/25 bg-black/75 px-3 py-1.5 text-[10px] text-emerald-300">
                              {category
                                ? `${category.icon} ${category.label}`
                                : "غير مصنف"}
                            </span>
                          </div>

                          <div className="p-4">
                            <h3 className="line-clamp-2 min-h-12 text-sm font-black leading-6">
                              {course.title}
                            </h3>

                            <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-gray-500">
                              {course.description || "لا يوجد وصف للكورس."}
                            </p>

                            <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.07] pt-4">
                              <div>
                                <p className="text-[10px] text-gray-500">
                                  السعر
                                </p>
                                <p className="mt-1 font-mono text-sm font-bold text-emerald-400">
                                  {course.is_free
                                    ? "مجاني"
                                    : `${course.price ?? 0} ج.م`}
                                </p>
                              </div>

                              <span className="rounded-lg border border-white/[0.08] px-2.5 py-1.5 text-[10px] text-gray-400">
                                {course.language || "عربي"}
                              </span>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => startEdit(course)}
                                className="rounded-xl border border-blue-400/20 bg-blue-400/[0.05] py-2.5 text-xs font-bold text-blue-300 transition hover:bg-blue-400 hover:text-black"
                              >
                                تعديل ✎
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteCourse(course.id, course.title)
                                }
                                className="rounded-xl border border-red-400/20 bg-red-400/[0.04] py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-400 hover:text-black"
                              >
                                حذف ×
                              </button>
                            </div>
                          </div>
                        </Panel>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}