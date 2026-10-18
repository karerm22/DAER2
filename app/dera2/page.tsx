"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("courses");
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // تم إضافة الحقول الجديدة هنا
  const [newCourse, setNewCourse] = useState({
    title: "", description: "", price: 0, is_free: false, whatsapp_number: "", 
    image_url: "", content: "", learn_points: "",
    language: "عربي", system: "ويندوز", external_url: ""
  });

  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setCheckingAuth(false);
      if (session) fetchData();
    };
    checkUser();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    const loginEmail = email.includes("@") ? email : `${email.trim().toLowerCase()}@dera3.com`;
    const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });

    if (error) {
      setAuthError("بيانات الدخول غير صحيحة.");
      setAuthLoading(false);
    } else {
      setSession(data.session);
      fetchData();
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setEmail("");
    setPassword("");
  };

  const fetchData = async () => {
    setLoading(true);
    const { data: usersData } = await supabase.from('profiles').select('*');
    if (usersData) setUsers(usersData);
    const { data: coursesData } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (coursesData) setCourses(coursesData);
    setLoading(false);
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let uploadedImageUrl = "";

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('courses').upload(fileName, imageFile);
      if (uploadError) {
        alert("خطأ في رفع الصورة: " + uploadError.message);
        setUploading(false);
        return;
      }
      const { data } = supabase.storage.from('courses').getPublicUrl(fileName);
      uploadedImageUrl = data.publicUrl;
    }

    const learnArray = newCourse.learn_points.split(',').map(s => s.trim());
    const { error } = await supabase.from('courses').insert([{
      ...newCourse,
      image_url: uploadedImageUrl,
      price: newCourse.is_free ? 0 : Number(newCourse.price),
      learn_points: learnArray
    }]);

    if (!error) {
      alert("تم إضافة الكورس بنجاح!");
      setNewCourse({ title: "", description: "", price: 0, is_free: false, whatsapp_number: "", image_url: "", content: "", learn_points: "", language: "عربي", system: "ويندوز", external_url: "" });
      setImageFile(null);
      fetchData();
    } else { 
      alert("خطأ: " + error.message); 
    }
    setUploading(false);
  };

  if (checkingAuth) return <div className="min-h-screen bg-[#020204] flex items-center justify-center text-[#00FF88] font-mono animate-pulse">جاري التحقق من النظام...</div>;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-[#020204] text-white" dir="rtl">
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#0a0a12_1px,transparent_1px),linear-gradient(to_bottom,#0a0a12_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0 opacity-30" />
        <div className="w-full max-w-md p-8 rounded-3xl border border-[#00FF88]/40 bg-[#07070b]/90 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,255,136,0.15)] relative z-10">
          <div className="text-center mb-8">
            <div className="font-mono text-xs text-[#00FF88] mb-2">[ RESTRICTED_ACCESS ]</div>
            <h2 className="text-3xl font-black text-white">دخول الإدارة <span className="text-[#00FF88]">DERA3</span></h2>
          </div>
          {authError && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/40 text-red-400 text-xs rounded-2xl text-center font-mono">[!] {authError}</div>}
          <form onSubmit={handleLogin} className="space-y-6 font-mono">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2">الإيميل أو اسم المستخدم</label>
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3.5 bg-black border border-[#222] focus:border-[#00FF88] rounded-2xl focus:outline-none text-white text-sm" placeholder="admin@dera3.com" dir="ltr" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2">كلمة المرور</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3.5 bg-black border border-[#222] focus:border-[#00FF88] rounded-2xl focus:outline-none text-white text-sm" placeholder="••••••••" dir="ltr" />
            </div>
            <button type="submit" disabled={authLoading} className="w-full bg-[#00FF88] text-black font-black py-4 rounded-2xl hover:bg-[#00cc6a] transition-all cursor-pointer">
              {authLoading ? "جاري التحقق..." : "دخول آمن 🛡️"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020204] text-white flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 bg-[#07070b] border-b md:border-b-0 md:border-l border-[#222] p-6">
        <h1 className="text-2xl font-bold text-[#00FF88] mb-8 font-mono">DERA3_ADMIN</h1>
        <nav className="space-y-2 font-mono text-sm">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full text-right px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30' : 'hover:bg-[#111]'}`}>[1] الإحصائيات</button>
          <button onClick={() => setActiveTab("courses")} className={`w-full text-right px-4 py-3 rounded-xl transition-all ${activeTab === 'courses' ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30' : 'hover:bg-[#111]'}`}>[2] إدارة الكورسات</button>
          <button onClick={() => setActiveTab("users")} className={`w-full text-right px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30' : 'hover:bg-[#111]'}`}>[3] سجل الأعضاء</button>
          <button onClick={handleLogout} className="w-full text-right px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 mt-10">[X] تسجيل الخروج</button>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-3xl font-bold mb-8 font-mono">النظام يعمل بكفاءة.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#07070b] p-6 rounded-2xl border border-[#222]"><h3 className="text-gray-400 mb-2 font-mono text-sm">إجمالي المسجلين</h3><p className="text-5xl font-bold text-[#00FF88]">{users.length}</p></div>
              <div className="bg-[#07070b] p-6 rounded-2xl border border-[#222]"><h3 className="text-gray-400 mb-2 font-mono text-sm">إجمالي الكورسات</h3><p className="text-5xl font-bold text-[#00FF88]">{courses.length}</p></div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <h2 className="text-2xl font-bold mb-6 font-mono">سجل الأعضاء</h2>
            <div className="bg-[#07070b] rounded-2xl border border-[#222] overflow-x-auto">
              <table className="w-full text-right font-mono text-sm">
                <thead className="bg-[#111] text-gray-400"><tr><th className="p-4">الاسم</th><th className="p-4">الإيميل</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-[#222] hover:bg-[#111]">
                      <td className="p-4">{u.username || 'بدون اسم'}</td>
                      <td className="p-4 text-gray-400" dir="ltr">{u.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-10">
            <div className="bg-[#07070b] p-6 rounded-2xl border border-[#222]">
              <h2 className="text-2xl font-bold mb-6 text-[#00FF88] font-mono">إضافة كورس جديد</h2>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="اسم الكورس" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} className="w-full bg-black border border-[#333] p-3 rounded-xl text-white font-mono text-sm" />
                  <div className="w-full bg-black border border-[#333] p-2 rounded-xl text-white flex items-center">
                    <label className="text-gray-400 ml-3 shrink-0 font-mono text-xs">صورة:</label>
                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:bg-[#00FF88]/20 file:text-[#00FF88] cursor-pointer" />
                  </div>
                </div>
                
                <textarea required placeholder="وصف قصير" value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} className="w-full bg-black border border-[#333] p-3 rounded-xl text-white font-mono text-sm" rows={2} />
                <textarea required placeholder="محتوى الكورس" value={newCourse.content} onChange={e => setNewCourse({...newCourse, content: e.target.value})} className="w-full bg-black border border-[#333] p-3 rounded-xl text-white font-mono text-sm" rows={3} />
                <input required placeholder="ماذا ستتعلم (بفاصلة ,)" value={newCourse.learn_points} onChange={e => setNewCourse({...newCourse, learn_points: e.target.value})} className="w-full bg-black border border-[#333] p-3 rounded-xl text-white font-mono text-sm" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-2 font-mono text-sm"><input type="checkbox" checked={newCourse.is_free} onChange={e => setNewCourse({...newCourse, is_free: e.target.checked})} className="w-5 h-5 accent-[#00FF88]" /><label>مجاني؟</label></div>
                  {!newCourse.is_free && (<input required type="number" placeholder="السعر" value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: Number(e.target.value)})} className="w-full bg-black border border-[#333] p-3 rounded-xl text-white font-mono text-sm" />)}
                  <input required placeholder="رقم واتساب (+2010...)" value={newCourse.whatsapp_number} onChange={e => setNewCourse({...newCourse, whatsapp_number: e.target.value})} className="w-full bg-black border border-[#333] p-3 rounded-xl text-white font-mono text-sm" dir="ltr" />
                </div>

                {/* الحقول الجديدة */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mt-4 border-t border-[#222] pt-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-mono">لغة الكورس</label>
                    <select value={newCourse.language} onChange={e => setNewCourse({...newCourse, language: e.target.value})} className="w-full bg-black border border-[#333] p-3 rounded-xl text-white font-mono text-sm focus:border-[#00FF88] focus:outline-none">
                      <option value="عربي">عربي</option>
                      <option value="إنجليزي">إنجليزي</option>
                      <option value="فرنسي">فرنسي</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-mono">النظام المستخدم</label>
                    <select value={newCourse.system} onChange={e => setNewCourse({...newCourse, system: e.target.value})} className="w-full bg-black border border-[#333] p-3 rounded-xl text-white font-mono text-sm focus:border-[#00FF88] focus:outline-none">
                      <option value="ويندوز">ويندوز (Windows)</option>
                      <option value="ماك">ماك (Mac)</option>
                      <option value="أندرويد">أندرويد (Android)</option>
                      <option value="لينكس">لينكس (Linux)</option>
                      <option value="الكل">الكل (Cross Platform)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-mono">رابط إضافي (اختياري)</label>
                    <input type="url" placeholder="https://..." value={newCourse.external_url} onChange={e => setNewCourse({...newCourse, external_url: e.target.value})} className="w-full bg-black border border-[#333] p-3 rounded-xl text-white font-mono text-sm" dir="ltr" />
                  </div>
                </div>

                <button type="submit" disabled={uploading} className="bg-[#00FF88] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#39FF14] disabled:opacity-50 font-mono text-sm mt-4">
                  {uploading ? "جاري الرفع..." : "حفظ الكورس"}
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6 font-mono">الكورسات الحالية</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {courses.map(c => (
                  <div key={c.id} className="bg-[#07070b] border border-[#222] p-4 rounded-2xl flex gap-4 items-center">
                    <img src={c.image_url || 'https://via.placeholder.com/100'} className="w-16 h-16 rounded-xl object-cover" />
                    <div><h3 className="font-bold text-sm">{c.title}</h3><p className="text-[#00FF88] font-mono text-sm mt-1">{c.is_free ? 'مجاني' : c.price + ' ج.م'}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}