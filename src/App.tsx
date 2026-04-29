import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Gavel, 
  Files, 
  Plus,
  Search,
  ChevronLeft,
  MoreVertical,
  Bell,
  User,
  Sparkles,
  CreditCard,
  CheckCircle2,
  Send
} from 'lucide-react';
import { MOCK_CASES, MOCK_CLIENTS, MOCK_SESSIONS, MOCK_TASKS, MOCK_FINANCES, MOCK_TEMPLATES, MOCK_REFERENCES, MOCK_MEMOS, MOCK_POAS, MOCK_WITNESSES, Case, Client, Session, Task, Transaction, LegalTemplate, LegalReference, TeamMemo, PowerOfAttorney, Witness, Evidence } from './types';
import { GoogleGenAI } from "@google/genai";


// --- Shared Components ---

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم' },
    { id: 'calendar', label: 'التقويم القضائي' },
    { id: 'cases', label: 'الأرشيف القانوني' },
    { id: 'witnesses', label: 'سجل الشهود' },
    { id: 'assistant', label: 'المساعد الذكي' },
    { id: 'notary', label: 'أتمتة التوكيلات' },
    { id: 'conflicts', label: 'فحص التعارض' },
    { id: 'templates', label: 'قوالب الصياغة' },
    { id: 'library', label: 'المكتبة المرجعية' },
    { id: 'memos', label: 'المذكرات الداخلية' },
    { id: 'clients', label: 'سجل الموكلين' },
    { id: 'finances', label: 'المكتب المالي' },
    { id: 'sessions', label: 'محاضر الجلسات' },
    { id: 'documents', label: 'خزانة المستندات' },
  ];

  return (
    <aside className="w-72 bg-surface-low sticky top-0 h-screen flex flex-col py-10 flex-shrink-0 z-50">
      <div className="px-8 mb-16">
        <h1 className="font-serif text-3xl font-bold tracking-tighter text-primary leading-none">
          الأرشيف<br/>القانوني
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center w-full px-8 py-3 text-right transition-all outline-none ${
                isActive ? 'text-primary font-semibold' : 'text-gray-500 opacity-80 hover:opacity-100'
              }`}
            >
              {isActive && <div className="active-indicator" />}
              <span className="mr-0 text-md">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-8 mt-auto">
        <div className="p-4 bg-surface-highest rounded-xl">
          <p className="text-xs text-gray-500 mb-1 font-serif">المستخدم الحالي</p>
          <p className="text-sm font-bold underline decoration-gold underline-offset-4">المحامي سيف طارق</p>
        </div>
      </div>
    </aside>
  );
};

const Header = ({ title, activeTab }: { title: string, activeTab: string }) => {
  return (
    <header className="flex justify-between items-end mb-16">
      <div className="max-w-xl text-right">
        <h2 className="font-serif text-5xl font-black text-primary mb-4 leading-tight">{title}</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          {activeTab === 'dashboard' 
            ? 'نظام الأرشيف الرقمي للمحاماة - إدارة القضايا والوثائق بمنتهى الرقي والاحترافية.'
            : 'تصفح السجلات القانونية المسجلة في النظام وتحكم في تفاصيلها بدقة عالية.'}
        </p>
      </div>
      
      <div className="flex gap-4 items-center">
        <button className="gold-gradient text-white px-8 py-3 rounded-lg flex items-center gap-2 luxury-shadow hover:opacity-90 transition-all font-serif text-lg">
          <Plus size={20} strokeWidth={2.5} />
          <span>إجراء جديد</span>
        </button>
      </div>
    </header>
  );
};

const StatCard = ({ label, value, isLow = false }: { label: string, value: string | number, isLow?: boolean }) => (
  <div className={`${isLow ? 'bg-surface-low' : 'bg-surface-highest'} p-8 rounded-none flex flex-col gap-2`}>
    <span className="font-serif italic text-gray-400 text-sm uppercase tracking-widest">{label}</span>
    <span className="text-4xl font-light text-primary">{value}</span>
  </div>
);

// --- Page Components ---

const Dashboard = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-12 flex-1 flex flex-col"
  >
    {/* Quick Actions */}
    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
      {['قضية جديدة', 'موكل جديد', 'جلسة طارئة', 'تقرير مالي', 'نموذج عقد', 'مذكرة داخلية'].map((action) => (
        <button key={action} className="whitespace-nowrap px-6 py-3 bg-white border border-surface-highest text-primary text-[10px] tracking-widest font-bold luxury-shadow hover:border-gold hover:text-gold transition-all uppercase">
          + {action}
        </button>
      ))}
    </div>

    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard label="القضايا النشطة" value={MOCK_CASES.filter(c => c.status === 'نشطة').length} />
      <StatCard label="إجمالي العملاء" value={MOCK_CLIENTS.length} isLow />
      <StatCard label="الرصيد المحصل" value={`${MOCK_FINANCES.filter(f => f.status === 'مدفوع').reduce((s,f) => s+f.amount, 0).toLocaleString()} ر.س`} />
      <StatCard label="الجلسات القادمة" value={MOCK_SESSIONS.length} isLow />
    </section>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <section className="lg:col-span-2 flex flex-col gap-10">
        <div className="bg-white p-10 luxury-shadow space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-2xl font-bold">إحصائيات القضايا السنوية</h3>
            <div className="flex gap-4 text-[10px] font-bold text-gray-400">
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gold" /> قضايا جديدة</span>
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> قضايا مغلقة</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { month: 'يناير', new: 4, closed: 2 },
                { month: 'فبراير', new: 6, closed: 3 },
                { month: 'مارس', new: 8, closed: 5 },
                { month: 'أبريل', new: MOCK_CASES.length, closed: 1 },
              ]}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip cursor={{ fill: '#f8f8f8' }} />
                <Bar dataKey="new" fill="#C5A059" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="closed" fill="#1A1A1A" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 luxury-shadow space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-2xl font-bold">ميزان العدالة الذكي (AI)</h3>
            <span className="text-[10px] bg-gold/10 text-primary px-3 py-1 font-bold">تحليل احتمالي</span>
          </div>
          <p className="text-xs text-gray-400">توقعات النجاح بناءً على تحليل السوابق والبيانات الحالية لكل ملف قضائي.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { type: 'تجاري', probability: 78, color: '#C5A059' },
                { type: 'تقني', probability: 45, color: '#1A1A1A' },
                { type: 'أحوال شخصية', probability: 92, color: '#C5A059' },
                { type: 'شركات', probability: 60, color: '#1A1A1A' },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip cursor={{ fill: 'transparent' }} content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-primary p-4 border border-gold luxury-shadow text-white">
                        <p className="text-xs font-bold">{payload[0].payload.type}</p>
                        <p className="text-xl font-bold text-gold">{payload[0].value}% احتمال نجاح</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar dataKey="probability" radius={[10, 10, 0, 0]} barSize={40}>
                  {
                    [
                      { type: 'تجاري', probability: 78, color: '#C5A059' },
                      { type: 'تقني', probability: 45, color: '#1A1A1A' },
                      { type: 'أحوال شخصية', probability: 92, color: '#C5A059' },
                      { type: 'شركات', probability: 60, color: '#1A1A1A' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-serif text-2xl font-bold">أحدث سجلات القضايا</h3>
            <button className="text-sm underline cursor-pointer hover:text-gold transition-colors">عرض السجل</button>
          </div>
          
          <div className="bg-surface-highest rounded-2xl overflow-hidden luxury-shadow">
            <table className="w-full text-right border-collapse">
              <thead className="bg-primary-container text-white font-serif">
                <tr className="text-sm uppercase tracking-wider">
                  <th className="p-5 font-light">الرقم</th>
                  <th className="p-5 font-light">اسم الدعوى</th>
                  <th className="p-5 font-light text-left">الحالة</th>
                </tr>
              </thead>
              <tbody className="text-text-main">
                {MOCK_CASES.slice(0, 4).map((c) => (
                  <tr key={c.id} className="ledger-row group cursor-pointer transition-colors hover:bg-white/50 border-b border-surface-highest">
                    <td className="p-5 font-mono text-sm text-gray-400">#00{c.id}</td>
                    <td className="p-5 font-bold">{c.title}</td>
                    <td className="p-5 text-left">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                        c.status === 'نشطة' ? 'bg-gold text-primary' : 'bg-surface-highest text-gray-400'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-serif text-2xl font-bold">النشاط الأخير في المكتب</h3>
          <div className="bg-white p-8 luxury-shadow space-y-6">
            {[
              { text: 'تم إيداع مستند "عقد المبايعة" في خزانة شركة الأفق.', time: 'منذ ١٠ دقائق', type: 'doc' },
              { text: 'أضافت أ. سارة ملاحظة جديدة على قضية "آل رشيد".', time: 'منذ ساعة', type: 'note' },
              { text: 'تم استلام دفعة مالية بقيمة ٥٠٠٠ ر.س من الموكل أحمد محمود.', time: 'منذ ٣ ساعات', type: 'finance' },
            ].map((activity, i) => (
              <div key={i} className="flex justify-between items-center border-b border-surface-low pb-4 last:border-0 last:pb-0">
                <div className="flex gap-4 items-center">
                   <div className={`w-2 h-2 rounded-full ${activity.type === 'doc' ? 'bg-blue-400' : activity.type === 'note' ? 'bg-gold' : 'bg-green-400'}`} />
                   <p className="text-sm text-gray-600">{activity.text}</p>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-serif text-2xl font-bold">المهام العاجلة</h3>
            <button className="text-sm underline cursor-pointer hover:text-gold transition-colors">عرض الكل</button>
          </div>
          <div className="bg-white p-6 space-y-6 luxury-shadow grow">
            {MOCK_TASKS.map((task) => (
              <div key={task.id} className="flex gap-4 items-start border-r-2 border-surface-highest pr-4 hover:border-gold transition-all">
                <CheckCircle2 size={18} className={task.completed ? 'text-gold' : 'text-gray-300'} />
                <div>
                  <p className={`text-sm font-bold ${task.completed ? 'line-through text-gray-400' : 'text-primary'}`}>{task.title}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-1">{task.dueDate}</p>
                </div>
              </div>
            ))}
            <button className="w-full py-4 mt-4 border-2 border-dashed border-surface-highest text-gray-400 text-[10px] tracking-widest font-bold hover:border-gold hover:text-gold transition-all uppercase">
              + إضافة مهمة جديدة
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
           <h3 className="font-serif text-2xl font-bold text-gold italic">نصيحة اليوم القانونية</h3>
           <div className="bg-primary text-white p-8 luxury-shadow border-r-4 border-gold italic font-serif">
             "الدقة في صياغة العقود هي خط الدفاع الأول ضد النزاعات المستقبلية. اهتم دائماً بتفاصيل القوة القاهرة."
           </div>
        </div>
      </section>
    </div>
  </motion.div>
);


const CasesPage = () => {
  const [selectedCase, setSelectedCase] = React.useState<Case | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [detailTab, setDetailTab] = React.useState(0);

  const filteredCases = MOCK_CASES.filter(c => 
    c.title.includes(searchQuery) || 
    c.clientName.includes(searchQuery) ||
    c.id.includes(searchQuery)
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8 flex-1 flex flex-col"
    >
      <div className="flex justify-between items-center bg-surface-low p-4 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="البحث في الأرشيف بواسطة المسمى، العميل أو الرقم المرجعي..."
            className="w-full pr-12 pl-4 py-3 bg-white luxury-shadow outline-none border-b-2 border-transparent focus:border-gold transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-surface-highest text-xs font-bold hover:bg-white transition-colors">تصفية متقدمة</button>
          <button className="px-4 py-2 bg-surface-highest text-xs font-bold hover:bg-white transition-colors">تصدير السجل</button>
        </div>
      </div>

      <div className="bg-surface-highest rounded-2xl overflow-hidden flex-1 luxury-shadow">
        <table className="w-full text-right border-collapse">
          <thead className="bg-primary-container text-white font-serif">
            <tr>
              <th className="p-5 font-light">الرقم المرجعي</th>
              <th className="p-5 font-light">موضوع القضية</th>
              <th className="p-5 font-light">العميل</th>
              <th className="p-5 font-light">التاريخ</th>
              <th className="p-5 font-light">تاريخ الجلسة القادمة</th>
              <th className="p-5 font-light text-left">الإجراء</th>
            </tr>
          </thead>
          <tbody className="text-text-main">
            {filteredCases.map((c) => (
              <tr key={c.id} className="ledger-row hover:bg-white/50 transition-colors">
                <td className="p-5 font-mono text-sm text-gray-400">#2024-00{c.id}</td>
                <td className="p-5 font-bold">{c.title}</td>
                <td className="p-5">{c.clientName}</td>
                <td className="p-5 font-mono text-sm">{c.date}</td>
                <td className="p-5 font-mono text-sm text-gold">{c.nextHearingDate || 'غير محدد'}</td>
                <td className="p-5 text-left">
                  <button 
                    onClick={() => setSelectedCase(c)}
                    className="p-2 hover:bg-surface-low rounded-full transition-colors opacity-50 hover:opacity-100"
                  >
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredCases.length === 0 && (
              <tr>
                <td colSpan={6} className="p-20 text-center text-gray-400 font-serif italic">
                  لم يتم العثور على أي نتائج تطابق بحثك في الأرشيف الحالي.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedCase && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCase(null)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white luxury-shadow p-12 rounded-none border-t-8 border-gold flex flex-col md:flex-row gap-12"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-12">
                  <div className="text-right">
                    <span className="font-serif italic text-gold text-sm uppercase tracking-widest block mb-2">تفاصيل الملف القانوني</span>
                    <h3 className="font-serif text-4xl font-bold text-primary">{selectedCase.title}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 text-right">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-serif uppercase tracking-wider">الموكل</p>
                    <p className="text-xl font-bold">{selectedCase.clientName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-serif uppercase tracking-wider">التصنيف</p>
                    <p className="text-xl font-bold">{selectedCase.category}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-serif uppercase tracking-wider">تاريخ القيد</p>
                    <p className="text-xl font-mono">{selectedCase.date}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-serif uppercase tracking-wider">الجلسة القادمة</p>
                    <p className="text-xl font-mono text-gold">{selectedCase.nextHearingDate || 'غير محدد'}</p>
                  </div>
                </div>

                {/* Tabs Selector */}
                <div className="flex gap-8 border-b border-surface-low mt-10 overflow-x-auto no-scrollbar">
                  {['البيانات الأساسية', 'الشهود والإفادات', 'الأدلة والوثائق', 'المسار الزمني'].map((tab, idx) => (
                    <button 
                      key={tab}
                      onClick={() => setDetailTab(idx)}
                      className={`pb-4 px-2 text-sm font-bold transition-all whitespace-nowrap ${
                        detailTab === idx ? 'text-gold border-b-2 border-gold' : 'text-gray-400 hover:text-primary'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="mt-8 min-h-[300px]">
                  {detailTab === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h4 className="font-serif font-bold text-lg border-r-4 border-gold pr-4">ملخص الدعوى</h4>
                          <button className="text-[10px] font-bold text-gold flex items-center gap-2 hover:bg-gold/5 p-2 rounded transition-all">
                             <Sparkles size={12} />
                             توليد ملخص بالذكاء الاصطناعي
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed font-serif italic">
                          تم قيد هذه الدعوى بتاريخ {selectedCase.date}. تتعلق القضية بـ {selectedCase.category} لصالح {selectedCase.clientName}. 
                          الحالة الراهنة هي "{selectedCase.status}" بانتظار الجلسة القادمة في {selectedCase.nextHearingDate}.
                        </p>
                        
                        {selectedCase.aiPrediction && (
                          <div className="bg-primary/5 p-6 border-r-4 border-gold luxury-shadow space-y-4">
                            <h5 className="text-xs font-bold text-primary flex items-center gap-2">
                              <Sparkles size={14} className="text-gold" />
                              تحليل الاستراتيجية الذكي
                            </h5>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center">
                                <p className="text-[9px] text-gray-400">نسبة النجاح</p>
                                <p className="text-lg font-bold text-gold">{selectedCase.aiPrediction.successRate}%</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[9px] text-gray-400">الصعوبة</p>
                                <p className="text-sm font-bold">{selectedCase.aiPrediction.difficulty}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[9px] text-gray-400">المدة المتوقعة</p>
                                <p className="text-xs font-bold">{selectedCase.aiPrediction.estimatedDuration}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-surface-low p-4 border border-surface-highest">
                            <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">الخصم</p>
                            <p className="font-bold text-sm">{selectedCase.opponentName || 'غير محدد'}</p>
                          </div>
                          <div className="bg-surface-low p-4 border border-surface-highest">
                            <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">رقم القضية</p>
                            <p className="font-bold text-sm font-mono">{selectedCase.caseNumber || '---'}</p>
                          </div>
                        </div>
                        <div className="bg-surface-low p-6 luxury-shadow border border-surface-highest">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">الدائرة القضائية</p>
                          <p className="font-bold text-primary">{selectedCase.courtBranch || 'المحكمة لم تحدد بعد'}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-serif font-bold text-lg border-r-4 border-primary pr-4">الإجراءات المتخذة</h4>
                        <div className="space-y-3">
                          {['تقديم لائحة الدعوى', 'سداد الرسوم القضائية', 'تبليغ المدعى عليه'].map((action, i) => (
                            <div key={i} className="flex gap-3 items-center text-xs text-gray-600">
                              <CheckCircle2 size={14} className={`text-gold ${i < 2 ? 'opacity-100' : 'opacity-30'}`} />
                              {action}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {detailTab === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="font-serif font-bold text-xl">قائمة الشهود المعتمدة</h4>
                        <button className="text-[10px] font-bold text-gold border border-gold px-4 py-2 hover:bg-gold hover:text-primary transition-all">+ إضافة شاهد</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedCase.witnesses?.map((w, idx) => (
                          <div key={idx} className="bg-white p-6 luxury-shadow border border-surface-low flex justify-between items-start group hover:border-gold transition-all relative overflow-hidden">
                            {w.reliabilityScore && (
                              <div className="absolute top-0 left-0 w-1 pt-1 h-full bg-gold/30" style={{ height: `${w.reliabilityScore * 10}%` }} title={`درجة الموثوقية: ${w.reliabilityScore}/10`} />
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-primary">{w.name}</p>
                                {w.type && <span className="text-[8px] bg-primary/10 text-primary px-1 font-bold">{w.type}</span>}
                              </div>
                              <p className="text-[10px] text-gray-400 font-mono mb-3">{w.phone}</p>
                              <div className="flex gap-2 items-center">
                                <span className={`px-2 py-0.5 text-[9px] font-bold ${w.status === 'تم الاستماع' ? 'bg-green-50 text-green-600' : 'bg-gold/10 text-primary'}`}>
                                  {w.status}
                                </span>
                                {w.reliabilityScore && <span className="text-[9px] text-gray-400">موثوقية {w.reliabilityScore}/10</span>}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button className="p-1 hover:bg-surface-low"><Search size={14} className="text-gray-400" /></button>
                              <button className="p-1 hover:bg-surface-low"><MoreVertical size={14} className="text-gray-400" /></button>
                            </div>
                          </div>
                        )) || <p className="text-gray-400 italic text-center py-10">لا يوجد شهود مسجلين</p>}
                      </div>
                    </motion.div>
                  )}

                  {detailTab === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                       <div className="flex justify-between items-center">
                        <h4 className="font-serif font-bold text-xl">خزانة الأدلة الرقمية</h4>
                        <button className="text-[10px] font-bold text-primary border border-primary px-4 py-2 hover:bg-primary hover:text-white transition-all">+ رفع مستند</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {selectedCase.evidence?.map((e, idx) => (
                          <div key={idx} className="bg-surface-low p-5 rounded flex flex-col items-center text-center gap-3 hover:bg-white transition-colors luxury-shadow">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gold">
                              {e.type === 'مستند' ? <Files size={24} /> : <Gavel size={24} />}
                            </div>
                            <div>
                              <p className="font-bold text-xs truncate max-w-[120px]">{e.title}</p>
                              <p className="text-[9px] text-gray-400 mt-1 uppercase">{e.uploadDate}</p>
                            </div>
                          </div>
                        )) || <p className="text-gray-400 italic text-center py-10">لا توجد وثائق مرفقة</p>}
                      </div>
                    </motion.div>
                  )}

                  {detailTab === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                       <div className="flex justify-between items-center">
                        <h4 className="font-serif font-bold text-xl">تطورات ملف القضية</h4>
                        <p className="text-[10px] text-gray-400 font-mono italic">إجمالي أحداث المسار: {selectedCase.timeline?.length || 0}</p>
                      </div>
                      <div className="relative border-r-2 border-surface-low pr-8 space-y-10">
                        {(selectedCase.timeline || []).map((entry, i) => (
                          <div key={i} className="relative">
                            <div className={`absolute -right-[34px] top-1 w-4 h-4 rounded-full border-4 border-white luxury-shadow ${
                              entry.type === 'جلسة' ? 'bg-red-500' : entry.type === 'قرار' ? 'bg-gold' : 'bg-primary'
                            }`} />
                            <div className="bg-white p-6 luxury-shadow group hover:bg-surface-low transition-colors">
                              <div className="flex justify-between mb-2">
                                <span className="font-bold text-primary">{entry.event}</span>
                                <span className="text-[10px] font-mono text-gray-400">{entry.date}</span>
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed">{entry.description}</p>
                            </div>
                          </div>
                        ))}
                         {(!selectedCase.timeline || selectedCase.timeline.length === 0) && (
                            <div className="py-20 text-center text-gray-400 italic font-serif">
                              بانتظار تسجيل أول حدث في المسار الزمني لهذه القضية.
                            </div>
                         )}
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="mt-16 pt-8 border-t border-surface-highest flex justify-start gap-4">
                  <button className="px-8 py-3 bg-surface-highest text-primary font-bold hover:bg-surface-low transition-colors">طباعة التقرير</button>
                  <button className="gold-gradient text-white px-10 py-3 luxury-shadow font-bold">تعديل البيانات</button>
                </div>
              </div>

              <div className="w-full md:w-64 border-r border-surface-highest pr-8">
                <h4 className="font-serif text-lg font-bold mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gold rounded-full" />
                  سجل الأحداث
                </h4>
                <div className="space-y-8 relative before:absolute before:right-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-highest">
                  <div className="relative pr-8">
                    <div className="absolute right-0 top-1 w-4 h-4 rounded-full bg-gold luxury-shadow z-10" />
                    <p className="text-sm font-bold">إدراج قضية جديدة</p>
                    <p className="text-xs text-gray-400 font-mono">{selectedCase.date}</p>
                  </div>
                  <div className="relative pr-8">
                    <div className="absolute right-0 top-1 w-4 h-4 rounded-full bg-surface-highest z-10" />
                    <p className="text-sm font-bold">رفع مستندات أولية</p>
                    <p className="text-xs text-gray-400 font-mono">2024-04-22</p>
                  </div>
                  <div className="relative pr-8">
                    <div className="absolute right-0 top-1 w-4 h-4 rounded-full bg-surface-highest z-10" />
                    <p className="text-sm font-bold">تحديد موعد الجلسة</p>
                    <p className="text-xs text-gray-400 font-mono">2024-04-25</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedCase(null)}
                  className="mt-12 w-full py-2 text-sm text-gray-400 hover:text-primary transition-colors border border-surface-highest"
                >
                  إغلاق السجل
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ClientsPage = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8 flex-1 flex flex-col"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_CLIENTS.map((client) => (
          <div key={client.id} className="bg-surface-highest p-8 luxury-shadow group hover:bg-white transition-all border-r-4 border-transparent hover:border-gold">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-none font-serif text-xl border-b-4 border-gold">
                {client.name[0]}
              </div>
              <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">الموكل #00{client.id}</span>
            </div>
            <h4 className="font-serif text-2xl font-bold mb-4">{client.name}</h4>
            <div className="space-y-2 text-sm text-gray-500 mb-8 font-mono">
              <p className="flex justify-between"><span>البريد:</span> <span>{client.email}</span></p>
              <p className="flex justify-between"><span>الهاتف:</span> <span>{client.phone}</span></p>
              <p className="flex justify-between"><span>القضايا:</span> <span className="text-primary font-bold underline decoration-gold">{client.casesCount}</span></p>
            </div>
            <button 
              onClick={() => setSelectedClient(client)}
              className="w-full py-3 bg-surface-low text-primary font-bold hover:bg-primary hover:text-white transition-all"
            >
              عرض الملف الكامل
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClient(null)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white luxury-shadow p-12 border-t-8 border-gold"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="flex gap-6 items-center">
                   <div className="w-20 h-20 bg-surface-low flex items-center justify-center font-serif text-3xl font-bold text-primary border-4 border-gold">
                     {selectedClient.name[0]}
                   </div>
                   <div>
                     <h3 className="font-serif text-3xl font-bold">{selectedClient.name}</h3>
                     <p className="text-sm text-gray-400 font-mono">الرقم المرجعي: CL-00{selectedClient.id}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedClient(null)} className="text-gray-400 hover:text-primary transition-colors">إغلاق</button>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-6">
                   <h4 className="font-serif text-xl font-bold border-r-4 border-gold pr-4">اتصال الموكل</h4>
                   <div className="space-y-4">
                      <div className="bg-surface-low p-4">
                         <p className="text-[10px] text-gray-400 uppercase mb-1">البريد الإلكتروني</p>
                         <p className="font-bold">{selectedClient.email}</p>
                      </div>
                      <div className="bg-surface-low p-4">
                         <p className="text-[10px] text-gray-400 uppercase mb-1">رقم الجوال الرسمي</p>
                         <p className="font-bold font-mono">{selectedClient.phone}</p>
                      </div>
                   </div>
                </div>
                <div className="space-y-6">
                   <h4 className="font-serif text-xl font-bold border-r-4 border-primary pr-4">القضايا الحالية</h4>
                   <div className="space-y-3">
                      {MOCK_CASES.filter(c => c.clientName === selectedClient.name).map((c, i) => (
                        <div key={i} className="flex justify-between items-center text-sm border-b border-surface-low pb-2">
                           <span className="font-bold">{c.title}</span>
                           <span className="text-[10px] bg-gold/10 px-2 py-0.5 rounded text-primary">{c.status}</span>
                        </div>
                      ))}
                      {MOCK_CASES.filter(c => c.clientName === selectedClient.name).length === 0 && (
                        <p className="text-xs text-gray-400 italic">لا توجد قضايا نشطة حالياً.</p>
                      )}
                   </div>
                   <div className="bg-primary p-6 text-white text-center luxury-shadow mt-4">
                      <p className="text-xs text-gray-400 mb-1">إجمالي المبالغ المسددة</p>
                      <p className="text-2xl font-bold">
                        {MOCK_FINANCES.filter(f => f.clientName === selectedClient.name && f.status === 'مدفوع').reduce((s,f) => s+f.amount, 0).toLocaleString()} ر.س
                      </p>
                   </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                 <button className="flex-1 py-4 gold-gradient text-white font-bold luxury-shadow">تحديث ملف الموكل</button>
                 <button className="flex-1 py-4 bg-surface-low text-primary font-bold">تحميل كافة الوثائق</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ConflictCheckerPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ type: string, match: string, reason: string }[]>([]);

  const handleCheck = () => {
    if (!query) return;
    const matches: { type: string, match: string, reason: string }[] = [];
    
    MOCK_CASES.forEach(c => {
      if (c.clientName.includes(query)) matches.push({ type: 'موكل سابق', match: c.clientName, reason: `مرتبط بقضية: ${c.title}` });
      if (c.opponentName?.includes(query)) matches.push({ type: 'خصم سابق', match: c.opponentName, reason: `كان خصماً في قضية: ${c.title}` });
    });

    MOCK_CLIENTS.forEach(client => {
      if (client.name.includes(query)) matches.push({ type: 'عميل مسجل', match: client.name, reason: `مسجل في قاعدة البيانات برقم هاتف: ${client.phone}` });
    });

    setResults(matches);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
      <div className="bg-white p-12 luxury-shadow border-t-8 border-gold text-center space-y-6">
        <div className="w-20 h-20 bg-surface-low rounded-full flex items-center justify-center mx-auto text-gold mb-4">
          <Search size={40} />
        </div>
        <h3 className="font-serif text-3xl font-bold">فحص تعارض المصالح الذكي</h3>
        <p className="text-gray-500 max-w-2xl mx-auto">
          أدخل اسم الشخص أو المؤسسة للبحث في كامل الأرشيف القانوني وسجلات العملاء والخصوم للتأكد من عدم وجود تعارض قانوني أو مهني قبل قبول التوكيل.
        </p>
        <div className="flex gap-4 max-w-xl mx-auto pt-6">
          <input 
            type="text" 
            placeholder="اسم الشخص، الشركة، أو الكيان..." 
            className="flex-1 px-6 py-4 bg-surface-low outline-none border-b-2 border-transparent focus:border-gold transition-all font-bold"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={handleCheck}
            className="gold-gradient text-white px-10 py-4 luxury-shadow font-bold uppercase tracking-widest"
          >
            بدء الفحص
          </button>
        </div>
      </div>

      <AnimatePresence>
        {query && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.length > 0 ? results.map((res, i) => (
              <div key={i} className="bg-white p-8 luxury-shadow border-r-4 border-red-500 flex flex-col gap-4">
                <span className="text-[10px] bg-red-50 text-red-600 px-3 py-1 font-bold uppercase tracking-widest self-start">{res.type}</span>
                <h4 className="font-serif text-xl font-bold">{res.match}</h4>
                <p className="text-sm text-gray-500 italic leading-relaxed">{res.reason}</p>
              </div>
            )) : (
              <div className="col-span-full bg-green-50 p-10 text-center border-2 border-dashed border-green-200">
                <p className="text-green-700 font-bold">لم يتم العثور على أي تعارض مباشر لهذا الكيان في الأرشيف المتاح.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const WitnessesPage = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-8"
  >
    <div className="bg-white p-8 luxury-shadow flex flex-col md:flex-row justify-between items-center border-b-4 border-gold gap-6">
      <div>
        <h3 className="font-serif text-2xl font-bold italic text-primary">سجل الشهود القضائي</h3>
        <p className="text-sm text-gray-500 mt-1">إدارة بيانات الشهود، جدولة الاستماع، وتوثيق الإفادات القانونية.</p>
      </div>
      <button className="bg-primary text-white px-8 py-3 luxury-shadow font-bold text-xs uppercase tracking-widest hover:bg-gold transition-all">إضافة شاهد جديد</button>
    </div>

    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
      {['الكل', 'تم الاستماع', 'منتظر الجلسة', 'تخلف عن الحضور'].map((filter) => (
        <button key={filter} className={`whitespace-nowrap px-6 py-2 text-[10px] font-bold luxury-shadow transition-all border-b-2 ${
          filter === 'الكل' ? 'bg-primary text-white border-gold' : 'bg-white text-gray-400 border-transparent hover:border-gold hover:text-gold'
        }`}>
          {filter}
        </button>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {MOCK_WITNESSES.map((witness) => (
        <div key={witness.id} className="bg-white p-8 luxury-shadow border-r-4 border-surface-highest hover:border-gold transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-surface-low rounded-full flex items-center justify-center text-primary font-bold">{witness.name[0]}</div>
            <span className={`px-3 py-1 text-[10px] font-bold ${
              witness.status === 'تم الاستماع' ? 'bg-green-50 text-green-600' : 
              witness.status === 'منتظر الجلسة' ? 'bg-gold/10 text-primary border border-gold' : 
              'bg-red-50 text-red-600'
            }`}>
              {witness.status}
            </span>
          </div>
          <h4 className="font-serif text-xl font-bold mb-2 group-hover:text-gold transition-colors">{witness.name}</h4>
          <p className="text-xs text-gray-400 font-mono mb-4">{witness.phone}</p>
          <div className="pt-4 border-t border-surface-low">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 italic">القضية المرتبطة:</p>
            <p className="text-sm font-bold text-primary truncate">
              {MOCK_CASES.find(c => c.id === witness.caseId)?.title || 'غير محدد'}
            </p>
          </div>
          {witness.testimonySummary && (
            <div className="mt-4 p-4 bg-surface-low italic text-xs text-gray-600 leading-relaxed">
              "{witness.testimonySummary}"
            </div>
          )}
          <div className="mt-6 flex gap-2">
            <button className="flex-1 py-2 border border-surface-highest text-[10px] font-bold hover:border-gold transition-colors">تعديل الإفادة</button>
            <button className="flex-1 py-2 border border-surface-highest text-[10px] font-bold hover:border-gold transition-colors">اتصال</button>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const CalendarPage = () => {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-12"
    >
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
        {days.map((day, i) => (
          <div key={day} className={`flex-1 min-w-[200px] p-6 luxury-shadow border-t-4 transition-all ${i === 1 ? 'bg-primary text-white border-gold' : 'bg-white text-primary border-surface-highest'}`}>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">{day}</p>
            <p className="font-serif text-2xl font-bold">{12 + i} مايو</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-8">
           <h3 className="font-serif text-3xl font-bold flex items-center gap-4">
             أجندة الجلسات اليومية
             <span className="text-xs bg-gold text-primary px-3 py-1">١٣ مايو ٢٠٢٤</span>
           </h3>
           
           <div className="relative border-r-2 border-surface-low space-y-6">
              {[
                { time: '09:00 ص', event: 'قضية العقارات الدولية', location: 'محكمة الاستئناف - القاعة ٤', type: 'جلسة مرافعة' },
                { time: '11:00 ص', event: 'اجتماع موكل - شركة الأفق', location: 'مقر المكتب - غرفة الاجتماعات', type: 'مشاورة قانونية' },
                { time: '01:30 م', event: 'جلسة نطق بالحكم - آل رشيد', location: 'المحكمة العامة', type: 'جلسة حكم' },
              ].map((item, i) => (
                <div key={i} className="relative pr-10 items-center flex group whitespace-nowrap">
                  <div className="absolute right-[-9px] w-4 h-4 rounded-full bg-white border-2 border-gold luxury-shadow z-10" />
                  <div className="flex gap-10 items-center w-full bg-white p-6 luxury-shadow border-l-4 border-transparent group-hover:border-gold transition-all">
                    <span className="text-sm font-bold text-gold font-mono w-20">{item.time}</span>
                    <div className="flex-1">
                      <p className="font-bold text-lg">{item.event}</p>
                      <p className="text-xs text-gray-400">{item.location}</p>
                    </div>
                    <span className="text-[10px] bg-surface-low text-primary px-3 py-1 font-bold">{item.type}</span>
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-8">
          <div className="bg-surface-low p-8 border-t-8 border-primary">
            <h4 className="font-serif text-xl font-bold mb-6">مواعيد الشهر العقاري</h4>
            <div className="space-y-6">
              {MOCK_POAS.filter(p => p.appointmentDate).map((poa, i) => (
                <div key={i} className="border-b border-surface-highest pb-4 last:border-0 last:pb-0">
                  <p className="text-xs font-bold">{poa.clientName}</p>
                  <p className="text-[10px] text-gold font-mono mt-1">{poa.appointmentDate} - {poa.notaryOffice}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gold/10 p-8 border-r-4 border-gold">
             <p className="text-xs font-bold text-primary mb-2">تنبيه مواعيد الطعن</p>
             <p className="text-[10px] text-gray-500 italic">يتبقى ٣ أيام على انتهاء موعد الطعن في القضية رقم ٤٤٠/٢٣</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const NotaryPage = () => {
  const [trackId, setTrackId] = useState('');
  const [trackedRecord, setTrackedRecord] = useState<PowerOfAttorney | null>(null);

  const handleTrack = () => {
    const found = MOCK_POAS.find(p => p.nationalId === trackId || p.clientName.includes(trackId));
    setTrackedRecord(found || null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-12"
    >
      <div className="bg-surface-low p-8 border-r-4 border-gold luxury-shadow flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="font-serif text-2xl font-bold">تتبع حالة التوكيل</h3>
          <p className="text-sm text-gray-500 mt-1">أدخل الرقم القومي أو اسم الموكل لمتابعة مسار التوثيق.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="الرقم القومي / اسم الموكل..." 
            className="flex-1 md:w-64 px-4 py-3 bg-white luxury-shadow outline-none border-b-2 border-transparent focus:border-gold text-sm"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
          />
          <button 
            onClick={handleTrack}
            className="bg-primary text-white px-6 py-3 font-bold text-xs uppercase tracking-widest hover:opacity-90"
          >
            تتبع
          </button>
        </div>
      </div>

      <AnimatePresence>
        {trackedRecord && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-10 luxury-shadow relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 bg-gold text-primary font-bold text-[10px] uppercase tracking-widest">
              نتائج التتبع المباشر
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">الموكل</p>
                  <h4 className="text-2xl font-serif font-bold text-primary">{trackedRecord.clientName}</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">نوع التوكيل</p>
                    <p className="font-bold">{trackedRecord.poaType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">الحالة الحالية</p>
                    <p className="font-bold text-gold">{trackedRecord.status}</p>
                  </div>
                </div>
                {trackedRecord.expiryDate && (
                  <div className="p-4 bg-red-50 border border-red-100">
                    <p className="text-[9px] text-red-600 font-bold uppercase">تنبيه انتهاء الصلاحية</p>
                    <p className="font-bold text-red-700">ينتهي في: {trackedRecord.expiryDate}</p>
                  </div>
                )}
              </div>

              <div className="border-r-2 border-surface-low pr-10">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-6">مسار التوثيق</p>
                <div className="space-y-6">
                  {trackedRecord.timeline?.map((step, i) => (
                    <div key={i} className="flex gap-4 items-start relative pb-6 last:pb-0">
                      {i !== (trackedRecord.timeline?.length || 0) - 1 && (
                        <div className={`absolute top-6 right-2 w-[2px] h-full ${step.completed ? 'bg-gold' : 'bg-surface-highest'}`} />
                      )}
                      <div className={`w-4 h-4 rounded-full mt-1 z-10 flex items-center justify-center ${step.completed ? 'bg-gold' : 'border-2 border-surface-highest bg-white'}`}>
                        {step.completed && <CheckCircle2 size={10} className="text-primary" />}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${step.completed ? 'text-primary' : 'text-gray-400'}`}>{step.status}</p>
                        <p className="text-[10px] text-gray-400 font-mono italic">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center border-r-2 border-surface-low pr-10">
                <div className="w-32 h-32 bg-surface-low border-2 border-gold p-2 flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold cursor-pointer">تحميل QR</div>
                  <div className="grid grid-cols-4 gap-1 w-full h-full opacity-30">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className={`bg-primary rounded-sm ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-20'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 uppercase font-bold mt-4">كود التحقق الرقمي</p>
                <button className="mt-4 text-[10px] font-bold text-primary underline">التحقق عبر بوابة ناجز</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-10 luxury-shadow flex flex-col gap-6">
          <h3 className="font-serif text-2xl font-bold flex items-center gap-3">
            <CreditCard className="text-gold" />
            تجهيز وكالة جديدة
          </h3>
          <p className="text-sm text-gray-500">أدخل بيانات الموكل لتوليد نص الوكالة الرسمي المطلوب للشهر العقاري.</p>
          <div className="space-y-4">
            <input type="text" placeholder="اسم الموكل بالكامل" className="w-full p-4 bg-surface-low outline-none border-b-2 border-transparent focus:border-gold transition-all" />
            <input type="text" placeholder="الرقم القومي" className="w-full p-4 bg-surface-low outline-none border-b-2 border-transparent focus:border-gold transition-all" />
            <select className="w-full p-4 bg-surface-low outline-none border-b-2 border-transparent focus:border-gold transition-all appearance-none">
              <option>نوع التوكيل...</option>
              <option>توكيل رسمي عام</option>
              <option>توكيل خاص بالقضايا</option>
              <option>توكيل إدارة وتصرف</option>
            </select>
            <button className="w-full py-4 gold-gradient text-white font-bold luxury-shadow mt-4">توليد نص الوكالة (جاهز للطباعة)</button>
          </div>
        </div>

        <div className="bg-primary text-white p-10 luxury-shadow flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute -left-10 -bottom-10 text-gold opacity-10">
            <Gavel size={240} strokeWidth={1} />
          </div>
          <h3 className="font-serif text-2xl font-bold z-10">إجراءات الشهر العقاري الذكية</h3>
          <ul className="space-y-4 z-10">
            {[
              'حجز موعد مسبق عبر البوابة الرقمية',
              'التأكد من سريان الهوية الوطنية للموكل',
              'تجهيز صور السجل التجاري (للتوكيلات التجارية)',
              'مراجعة الصيغة القانونية لتجنب الرفض الإداري'
            ].map((step, i) => (
              <li key={i} className="flex gap-4 items-center text-sm">
                <div className="w-5 h-5 rounded-full border border-gold flex items-center justify-center text-[10px] text-gold">{i+1}</div>
                {step}
              </li>
            ))}
          </ul>
          <button className="mt-auto px-6 py-3 border border-gold text-gold font-bold text-xs uppercase tracking-widest hover:bg-gold hover:text-primary transition-all z-10 self-start">
            تحميل دليل الإجراءات الكامل
          </button>
        </div>
      </div>

      <div className="bg-white luxury-shadow overflow-hidden">
        <div className="bg-surface-low p-6 border-b border-surface-highest">
          <h4 className="font-serif text-xl font-bold">سجلات التوكيلات المعلقة</h4>
        </div>
        <table className="w-full text-right border-collapse">
          <thead className="bg-primary text-white font-serif text-xs uppercase tracking-widest">
            <tr>
              <th className="p-5 font-light">الموكل</th>
              <th className="p-5 font-light">النوع</th>
              <th className="p-5 font-light">المكتب المستهدف</th>
              <th className="p-5 font-light">الموعد</th>
              <th className="p-5 font-light text-left">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_POAS.map((poa) => (
              <tr key={poa.id} className="ledger-row border-b border-surface-low group">
                <td className="p-5 font-bold">{poa.clientName}</td>
                <td className="p-5 text-gray-500">{poa.poaType}</td>
                <td className="p-5 text-xs italic">{poa.notaryOffice || '---'}</td>
                <td className="p-5 font-mono text-sm">{poa.appointmentDate || '---'}</td>
                <td className="p-5 text-left">
                  <span className={`px-3 py-1 text-[10px] font-bold ${
                    poa.status === 'تم التوثيق' ? 'bg-green-50 text-green-600' : 
                    poa.status === 'في انتظار الزيارة' ? 'bg-gold/10 text-primary border border-gold' : 
                    'bg-surface-highest text-gray-400'
                  }`}>
                    {poa.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const TemplatesPage = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
  >
    {MOCK_TEMPLATES.map((template) => (
      <div key={template.id} className="bg-white p-8 luxury-shadow flex flex-col justify-between border-b-4 border-surface-highest hover:border-gold transition-all group">
         <div>
            <div className={`text-[10px] uppercase tracking-[0.2em] mb-4 font-bold ${
              template.category === 'عقود' ? 'text-primary' : 'text-gold'
            }`}>{template.category}</div>
            <h4 className="font-serif text-xl font-bold mb-6 leading-tight group-hover:text-gold transition-colors">{template.title}</h4>
         </div>
         <div className="space-y-4">
            <p className="text-[10px] text-gray-400 font-mono italic">آخر استخدام: {template.lastUsed}</p>
            <button className="w-full py-2 bg-primary text-white text-xs font-bold luxury-shadow hover:opacity-90">صياغة مستند جديد</button>
         </div>
      </div>
    ))}
  </motion.div>
);

const LibraryPage = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-8"
  >
    <div className="flex justify-between items-center bg-surface-low p-6 rounded-xl border-l-4 border-gold">
      <div>
        <h3 className="font-serif text-2xl font-bold">المكتبة القانونية المرجعية</h3>
        <p className="text-sm text-gray-500 mt-1">ابحث في الأنظمة، اللوائح، والسوابق القضائية المؤرشفة.</p>
      </div>
      <div className="relative w-72">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input type="text" placeholder="بحث سريع..." className="w-full pr-10 py-2 bg-white luxury-shadow outline-none border-b border-transparent focus:border-gold text-xs" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {[
        { title: 'الأنظمة التجارية', count: 42, icon: <Briefcase /> },
        { title: 'السوابق القضائية', count: 128, icon: <Gavel /> },
        { title: 'لوائح الأحوال الشخصية', count: 15, icon: <Users /> },
      ].map((collection, i) => (
        <div key={i} className="bg-white p-8 luxury-shadow border-t-4 border-gold hover:-translate-y-1 transition-all cursor-pointer">
          <div className="text-gold mb-4 opacity-50">{collection.icon}</div>
          <h5 className="font-serif text-lg font-bold mb-2">{collection.title}</h5>
          <p className="text-[10px] text-gray-400 font-mono italic">{collection.count} مستند مرجعي</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 gap-6">
      {MOCK_REFERENCES.map((ref) => (
        <div key={ref.id} className="bg-white p-8 luxury-shadow border-r-8 border-surface-highest hover:border-gold transition-all cursor-pointer">
          <div className="flex justify-between mb-4">
            <h4 className="font-serif text-xl font-bold text-primary">{ref.title}</h4>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">{ref.source}</span>
          </div>
          <p className="text-gray-600 leading-relaxed font-serif italic mb-6">"{ref.excerpt}"</p>
          <div className="flex gap-2">
            {ref.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-surface-low text-[10px] font-bold text-primary font-mono lowercase">#{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const MemosPage = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col h-[70vh] bg-surface-low p-10 gap-10"
  >
    <div className="flex justify-between items-center">
      <h3 className="font-serif text-3xl font-bold">المذكرات والرسائل الداخلية</h3>
      <button className="gold-gradient text-white px-8 py-3 luxury-shadow font-bold text-xs uppercase tracking-widest">+ رسالة جديدة</button>
    </div>

    <div className="space-y-6 overflow-y-auto pr-4">
      {MOCK_MEMOS.map((memo) => (
        <div key={memo.id} className="bg-white p-8 luxury-shadow flex gap-8 items-start relative group transition-all hover:-translate-x-2">
          <div className={`w-1 h-full absolute right-0 top-0 ${memo.priority === 'عالية' ? 'bg-red-500' : 'bg-gold'}`} />
          <div className="w-16 h-16 bg-surface-low flex-shrink-0 flex items-center justify-center font-serif text-2xl font-bold text-primary">
            {memo.sender[0]}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-primary text-lg">{memo.sender}</span>
              <span className="text-[10px] text-gray-400 font-mono italic">{memo.timestamp}</span>
            </div>
            <p className="text-gray-600 leading-relaxed">{memo.content}</p>
          </div>
          <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 hover:bg-surface-low transition-colors"><CheckCircle2 size={16} className="text-gray-400 hover:text-gold" /></button>
            <button className="p-2 hover:bg-surface-low transition-colors"><MoreVertical size={16} className="text-gray-400" /></button>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const SessionsPage = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-8 flex-1 flex flex-col"
  >
    <div className="bg-surface-highest rounded-2xl overflow-hidden flex-1 luxury-shadow">
      <table className="w-full text-right border-collapse">
        <thead className="bg-primary-container text-white font-serif">
          <tr>
            <th className="p-5 font-light">موضوع القضية</th>
            <th className="p-5 font-light">التاريخ</th>
            <th className="p-5 font-light">الوقت</th>
            <th className="p-5 font-light">المحكمة</th>
            <th className="p-5 font-light text-left">الإجراء</th>
          </tr>
        </thead>
        <tbody className="text-text-main">
          {MOCK_SESSIONS.map((s) => (
            <tr key={s.id} className="ledger-row hover:bg-white/50 transition-colors">
              <td className="p-5 font-bold">{s.caseTitle}</td>
              <td className="p-5 font-mono text-sm">{s.date}</td>
              <td className="p-5 font-mono text-sm text-gold">{s.time}</td>
              <td className="p-5 text-gray-500">{s.court}</td>
              <td className="p-5 text-left">
                <button className="px-6 py-2 bg-surface-low text-xs font-bold hover:bg-primary hover:text-white transition-all">إضافة محضر</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

const FinancesPage = () => {
  const chartData = [
    { name: 'يناير', value: 25000 },
    { name: 'فبراير', value: 31200 },
    { name: 'مارس', value: 54200 },
    { name: 'أبريل', value: 90700 },
  ];

  const pieData = [
    { name: 'أتعاب قضايا', value: 85000, color: '#1A1A1A' },
    { name: 'عقود واستشارات', value: 35000, color: '#C5A059' },
    { name: 'مصروفات مستردة', value: 4500, color: '#E5E5E5' },
  ];

  const totalRevenue = MOCK_FINANCES.reduce((acc, f) => acc + (f.status === 'مدفوع' ? f.amount : 0), 0);
  const pendingRevenue = MOCK_FINANCES.reduce((acc, f) => acc + (f.status === 'معلق' ? f.amount : 0), 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary text-white p-10 flex flex-col justify-between h-48 luxury-shadow border-r-8 border-gold">
          <CreditCard size={24} className="text-gold opacity-50" />
          <div>
            <p className="text-sm font-serif italic text-gray-400">إجمالي الأرباح المحصلة</p>
            <p className="text-4xl font-bold">{totalRevenue.toLocaleString()} ر.س</p>
          </div>
        </div>
        <div className="bg-surface-highest p-10 flex flex-col justify-between h-48 luxury-shadow">
          <Users size={24} className="text-primary opacity-20" />
          <div>
            <p className="text-sm font-serif italic text-gray-400">المطالبات المعلقة</p>
            <p className="text-4xl font-bold">{pendingRevenue.toLocaleString()} ر.س</p>
          </div>
        </div>
        <div className="bg-surface-highest p-10 flex flex-col justify-between h-48 luxury-shadow">
          <Briefcase size={24} className="text-primary opacity-20" />
          <div>
            <p className="text-sm font-serif italic text-gray-400">إجمالي الفواتير الصادرة</p>
            <p className="text-4xl font-bold">{(totalRevenue + pendingRevenue).toLocaleString()} ر.س</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 luxury-shadow space-y-6">
          <h4 className="font-serif text-xl font-bold border-r-4 border-gold pr-4">منحنى نمو الأرباح</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#C5A059' }}
                />
                <Line type="monotone" dataKey="value" stroke="#C5A059" strokeWidth={3} dot={{ r: 4, fill: '#C5A059' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 luxury-shadow space-y-6">
          <h4 className="font-serif text-xl font-bold border-r-4 border-primary pr-4">توزيع مصادر الدخل</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData}>
                <XAxis dataKey="name" hide />
                <Tooltip />
                <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                   <span className="text-[10px] text-gray-500 font-bold">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden luxury-shadow">
         <div className="p-8 border-b border-surface-low flex justify-between items-center">
            <h4 className="font-serif text-2xl font-bold">جدول الحركات المالية</h4>
            <button className="text-xs font-bold text-gold border-b-2 border-gold pb-1">تحميل التقرير المالي الكامل</button>
         </div>
         <table className="w-full text-right border-collapse">
          <thead className="bg-surface-low border-b-2 border-primary">
            <tr className="font-serif uppercase text-xs tracking-widest text-primary">
              <th className="p-6">العميل</th>
              <th className="p-6">النوع</th>
              <th className="p-6">التاريخ</th>
              <th className="p-6">المبلغ</th>
              <th className="p-6 text-left">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {[...MOCK_FINANCES].reverse().map(f => (
              <tr key={f.id} className="ledger-row border-b border-surface-low hover:bg-surface-low/50 transition-colors">
                <td className="p-6 font-bold">{f.clientName}</td>
                <td className="p-6 text-gray-500">{f.type}</td>
                <td className="p-6 font-mono text-sm">{f.date}</td>
                <td className="p-6 font-bold text-primary">{f.amount.toLocaleString()} ر.س</td>
                <td className="p-6 text-left">
                  <span className={`px-4 py-1 text-[10px] font-bold ${f.status === 'مدفوع' ? 'bg-gold/10 text-primary border border-gold' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                     {f.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const AssistantPage = () => {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      
      const prompt = `أنت مساعد قانوني ذكي وخبير في مكتب محاماة فاخر.
      مهمتك: تقديم استشارات قانونية دقيقة، صياغة مسودات عقود، أو شرح ثغرات قانونية.
      اللغة: العربية الفصحى بأسلوب مهني رفيع.
      طلب المحامي: ${input}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      setMessages([...newMessages, { role: 'assistant', content: response.text || "" }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', content: 'عذراً، حدث خطأ في معالجة طلبك القانوني.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="flex flex-col h-[70vh] bg-white luxury-shadow overflow-hidden"
    >
      <div className="bg-primary text-white p-8 flex items-center gap-4">
        <Sparkles size={24} className="text-gold" />
        <div>
          <h3 className="font-serif text-xl font-bold">المساعد الذكي "عدالة"</h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">نظام الذكاء القانوني المدعوم بـ Gemini</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12 space-y-8 bg-surface-low">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
             <Gavel size={64} className="text-gold" strokeWidth={1} />
             <p className="font-serif text-2xl italic">كيف يمكنني خدمتكم في موازين العدالة اليوم؟</p>
             <p className="text-sm text-gray-400 max-w-sm">يمكنك طلبي لصياغة مذكرات، تلخيص قضايا، أو البحث في ثنايا القوانين.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-6 ${m.role === 'user' ? 'bg-surface-highest border-r-4 border-gold text-primary' : 'bg-primary text-white font-serif leading-relaxed text-lg'} luxury-shadow`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end italic text-gray-400 animate-pulse font-serif">جاري البحث في الأرشيف القانوني...</div>
        )}
      </div>

      <div className="p-8 bg-white border-t border-surface-highest flex gap-4">
        <input 
          type="text" 
          placeholder="أدخل استشارتك القانونية هنا..."
          className="flex-1 bg-surface-low px-6 py-4 outline-none focus:border-gold border-2 border-transparent transition-all font-serif"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          className="gold-gradient text-white px-10 py-4 luxury-shadow flex items-center gap-2 hover:opacity-90 transition-all font-serif"
        >
          <Send size={20} />
          <span>استشارة</span>
        </button>
      </div>
    </motion.div>
  );
};

const DocumentsPage = () => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <div 
        className={`border-4 border-dashed rounded-3xl p-32 flex flex-col items-center justify-center transition-all ${
          isDragging ? 'border-gold bg-gold/5 bg-opacity-20 translate-y-[-4px]' : 'border-surface-highest bg-transparent'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
      >
        <Files size={64} className={`${isDragging ? 'text-gold' : 'text-surface-highest'} mb-8 transition-colors`} strokeWidth={1} />
        <h4 className="text-2xl font-serif font-bold text-gray-800 mb-2">خزانة المستندات الرقمية</h4>
        <p className="text-gray-400 text-lg mb-8">قم بسحب الملفات هنا أو انقر للإيداع يدوياً</p>
        <button className="gold-gradient text-white px-10 py-4 rounded-xl font-medium luxury-shadow hover:opacity-90">تصفح الخزانة</button>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface-highest p-8 flex items-center gap-4 group cursor-pointer hover:bg-white transition-all luxury-shadow border-r-4 border-gold/0 hover:border-gold">
            <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-primary group-hover:text-gold transition-colors">
              <Files size={24} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-bold truncate w-32">مستند_حقوقي_{i}.pdf</p>
              <p className="text-xs text-gray-400 font-mono">1.2 MB</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'السجل العام للمكتب';
      case 'calendar': return 'التقويم والمهام القضائية';
      case 'cases': return 'أرشيف القضايا المنظورة';
      case 'witnesses': return 'سجل الشهود والإفادات';
      case 'assistant': return 'المساعد القانوني الذكي';
      case 'conflicts': return 'محرك فحص تعارض المصالح';
      case 'notary': return 'نظام إدارة وأتمتة التوكيلات';
      case 'templates': return 'مكتبة القوالب القانونية';
      case 'library': return 'المكتبة المرجعية';
      case 'memos': return 'المذكرات الداخلية';
      case 'clients': return 'سجل الموكلين المعتمدين';
      case 'finances': return 'السجل المالي والأتعاب';
      case 'sessions': return 'محاضر الجلسات القضائية';
      case 'documents': return 'خزانة الوثائق الرسمية';
      default: return 'الأرشيف';
    }
  };

  return (
    <div className="flex bg-surface min-h-screen text-right font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-12 flex flex-col gap-10 overflow-auto">
        <Header title={getTitle()} activeTab={activeTab} />
        
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <Dashboard key="dashboard" />}
            {activeTab === 'calendar' && <CalendarPage key="calendar" />}
            {activeTab === 'cases' && <CasesPage key="cases" />}
            {activeTab === 'witnesses' && <WitnessesPage key="witnesses" />}
            {activeTab === 'assistant' && <AssistantPage key="assistant" />}
            {activeTab === 'conflicts' && <ConflictCheckerPage key="conflicts" />}
            {activeTab === 'notary' && <NotaryPage key="notary" />}
            {activeTab === 'templates' && <TemplatesPage key="templates" />}
            {activeTab === 'library' && <LibraryPage key="library" />}
            {activeTab === 'memos' && <MemosPage key="memos" />}
            {activeTab === 'documents' && <DocumentsPage key="documents" />}
            {activeTab === 'clients' && <ClientsPage key="clients" />}
            {activeTab === 'finances' && <FinancesPage key="finances" />}
            {activeTab === 'sessions' && <SessionsPage key="sessions" />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
