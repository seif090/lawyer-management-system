/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Witness {
  id: string;
  name: string;
  phone: string;
  caseId: string;
  status: 'تم الاستماع' | 'منتظر الجلسة' | 'لم يحضر';
  testimonySummary?: string;
}

export interface Evidence {
  id: string;
  title: string;
  type: 'مستند' | 'صورة' | 'تسجيل صوتي' | 'فيديو';
  uploadDate: string;
}

export interface CaseTimelineEntry {
  id: string;
  date: string;
  event: string;
  type: 'جلسة' | 'قرار' | 'مستند' | 'إجراء';
  description: string;
}

export interface Case {
  id: string;
  title: string;
  category: string;
  status: 'نشطة' | 'مغلقة' | 'قيد المراجعة' | 'معلقة';
  clientName: string;
  opponentName?: string;
  date: string;
  nextSession?: string;
  nextHearingDate?: string;
  witnesses?: Witness[];
  evidence?: Evidence[];
  timeline?: CaseTimelineEntry[];
  courtBranch?: string;
  caseNumber?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  casesCount: number;
}

export interface Session {
  id: string;
  caseTitle: string;
  date: string;
  time: string;
  court: string;
}

export const MOCK_WITNESSES: Witness[] = [
  { id: '1', name: 'سعيد بن خالد', phone: '0501112233', caseId: '1', status: 'تم الاستماع', testimonySummary: 'أفاد الشاهد بوجود نزاع مسبق على حدود العقار بين الطرفين.' },
  { id: '2', name: 'منيرة العبدالله', phone: '0554445566', caseId: '1', status: 'منتظر الجلسة' },
  { id: '3', name: 'عصام المصري', phone: '0567778899', caseId: '3', status: 'لم يحضر' },
];

export const MOCK_CASES: Case[] = [
  { 
    id: '1', 
    title: 'قضية العقارات الدولية - المجموعة أ', 
    category: 'تجاري', 
    status: 'نشطة', 
    clientName: 'شركة الأفق للاستثمار', 
    opponentName: 'مؤسسة إعمار العقارية',
    date: '2024-04-20', 
    nextHearingDate: '2024-05-15',
    courtBranch: 'المحكمة التجارية بالرياض',
    caseNumber: '٤٤٠/٢٣',
    witnesses: [MOCK_WITNESSES[0], MOCK_WITNESSES[1]],
    evidence: [
      { id: 'e1', title: 'صك الملكية الأصلي', type: 'مستند', uploadDate: '2024-04-16' },
      { id: 'e2', title: 'مخطط الموقع المساحي', type: 'صورة', uploadDate: '2024-04-17' },
    ],
    timeline: [
      { id: 't1', date: '2024-04-20', event: 'قيد الدعوى', type: 'إجراء', description: 'تم إيداع صحيفة الدعوى إلكترونياً.' },
      { id: 't2', date: '2024-04-25', event: 'سداد الرسوم', type: 'إجراء', description: 'تم سداد رسوم القضية المقررة بقيمة ٥٠٠٠ ر.س.' },
      { id: 't3', date: '2024-05-01', event: 'عقد جلسة صلح', type: 'جلسة', description: 'تعذر الصلح بين الطرفين وتمت الإحالة للمحكمة.' },
    ]
  },
  { 
    id: '2', 
    title: 'نزاع ملكية فكرية - تطبيق نود', 
    category: 'تقني', 
    status: 'قيد المراجعة', 
    clientName: 'أحمد محمود القحطاني', 
    opponentName: 'شركة تك لابز',
    date: '2024-04-15', 
    nextHearingDate: '2024-05-20',
    courtBranch: 'المحكمة العامة المجمع الحقوقي',
    caseNumber: '٧٨٩/أ/٦'
  },
  { 
    id: '3', 
    title: 'تصفية تركة آل رشيد', 
    category: 'أحوال شخصية', 
    status: 'نشطة', 
    clientName: 'سارة آل رشيد', 
    date: '2024-04-10', 
    nextHearingDate: '2024-05-12',
    witnesses: [MOCK_WITNESSES[2]],
    courtBranch: 'محكمة الأحوال الشخصية شمال الرياض'
  },
  { 
    id: '4', 
    title: 'دمج واستحواذ - المصرفي المتحد', 
    category: 'شركات', 
    status: 'مغلقة', 
    clientName: 'البنك الوطني', 
    opponentName: 'المجموعة العقارية الدولية',
    date: '2024-03-25', 
    nextHearingDate: '2024-06-01' 
  },
];

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'شركة الأفق للاستثمار', email: 'contact@alofuq.com', phone: '0501234567', casesCount: 5 },
  { id: '2', name: 'أحمد محمود القحطاني', email: 'ahmed@khtani.com', phone: '0559988776', casesCount: 2 },
  { id: '3', name: 'سارة آل رشيد', email: 'sara@alrashid.sa', phone: '0567766554', casesCount: 1 },
  { id: '4', name: 'مؤسسة الفهد للتجارة', email: 'info@alfahad.com', phone: '0544112233', casesCount: 3 },
  { id: '5', name: 'ليلى بن علي', email: 'layla@law.tn', phone: '0598877665', casesCount: 1 },
];

export const MOCK_SESSIONS: Session[] = [
  { id: '1', caseTitle: 'قضية العقارات الدولية - المجموعة أ', date: '2024-05-15', time: '09:00 ص', court: 'محكمة الاستئناف - القاعة ٤' },
  { id: '2', caseTitle: 'تصفية تركة آل رشيد', date: '2024-05-12', time: '11:30 ص', court: 'المحكمة العامة - مكتب ٣' },
  { id: '3', caseTitle: 'نزاع ملكية فكرية - تطبيق نود', date: '2024-05-20', time: '10:00 ص', court: 'محكمة التنفيذ' },
  { id: '4', caseTitle: 'دمج واستحواذ - المصرفي المتحد', date: '2024-06-01', time: '01:00 م', court: 'الغرفة التجارية' },
];

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'عالية' | 'متوسطة' | 'عادية';
  completed: boolean;
  relatedCase?: string;
}

export interface Transaction {
  id: string;
  clientName: string;
  amount: number;
  type: 'أتعاب' | 'مصروفات قضائية' | 'دفعة مقدمة';
  date: string;
  status: 'مدفوع' | 'معلق';
}

export interface PowerOfAttorney {
  id: string;
  clientName: string;
  nationalId: string;
  poaType: 'عام رسمي' | 'قضايا' | 'خاص' | 'تجاري';
  status: 'تحت التجهيز' | 'تم التوثيق' | 'في انتظار الزيارة' | 'مرفوض';
  notaryOffice?: string;
  appointmentDate?: string;
  timeline?: { status: string, date: string, completed: boolean }[];
}

export interface LegalTemplate {
  id: string;
  title: string;
  category: 'عقود' | 'مذكرات' | 'اتفاقيات';
  lastUsed: string;
}

export interface LegalReference {
  id: string;
  title: string;
  source: string;
  excerpt: string;
  tags: string[];
}

export interface TeamMemo {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  priority: 'عالية' | 'عادية';
}

export const MOCK_REFERENCES: LegalReference[] = [
  { id: '1', title: 'نظام المرافعات الشرعية - المادة ٣١', source: 'البوابة القانونية', excerpt: 'يجب أن يقدم الاعتراض على الحكم خلال ثلاثين يوماً من تاريخ استلام نسخة الحكم...', tags: ['مرافعات', 'مواعيد'] },
  { id: '2', title: 'نظام الشركات الجديد - الملحق ألف', source: 'الجريدة الرسمية', excerpt: 'تحدد مسؤولية الشركاء في الشركة ذات المسؤولية المحدودة بقدر حصصهم في رأس المال...', tags: ['شركات', 'مسؤولية'] },
  { id: '3', title: 'سوابق قضائية - نزاعات إيجارية', source: 'مركز البحوث القضائية', excerpt: 'تم الحكم في القضية رقم ٥٤٢١ لصالح المستأجر نظراً لعدم استيفاء المؤجر لشروط الصيانة...', tags: ['عقارات', 'إيجارات'] },
];

export const MOCK_MEMOS: TeamMemo[] = [
  { id: '1', sender: 'أ. سارة (مساعد قانوني)', content: 'تم تحديث كافة ملفات قضية شركة الأفق، يرجى مراجعة مذكرة الرد قبل الجلسة.', timestamp: 'منذ ساعتين', priority: 'عالية' },
  { id: '2', sender: 'مكتب السكرتارية', content: 'هناك موكل جديد ينتظر في صالة الاستقبال لمناقشة قضية إرث.', timestamp: 'منذ ١٥ دقيقة', priority: 'عادية' },
  { id: '3', sender: 'النظام الآلي', content: 'تنبيه: اقترب موعد تجديد بطاقة الهوية المهنية للمحامي سيف.', timestamp: 'يوم أمس', priority: 'عالية' },
];

export const MOCK_TEMPLATES: LegalTemplate[] = [
  { id: '1', title: 'عقد بيع عقار نهائي', category: 'عقود', lastUsed: '2024-04-25' },
  { id: '2', title: 'مذكرة دفاع في دعوى تعويض', category: 'مذكرات', lastUsed: '2024-04-20' },
  { id: '3', title: 'اتفاقية عدم إفصاح (NDA)', category: 'اتفاقيات', lastUsed: '2024-04-28' },
  { id: '4', title: 'عقد توريد خدمات تقنية', category: 'عقود', lastUsed: '2024-04-15' },
];

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'تقديم مذكرة الرد النهائية', dueDate: '2024-05-02', priority: 'عالية', completed: false, relatedCase: 'قضية العقارات الدولية' },
  { id: '2', title: 'مراجعة عقود الاستحواذ', dueDate: '2024-05-05', priority: 'عالية', completed: false, relatedCase: 'المصرفي المتحد' },
  { id: '3', title: 'الاتصال بالخبير العقاري', dueDate: '2024-05-03', priority: 'متوسطة', completed: true },
  { id: '4', title: 'تجهيز ملف الجلسة القادمة', dueDate: '2024-05-10', priority: 'عالية', completed: false },
];

export const MOCK_FINANCES: Transaction[] = [
  { id: '1', clientName: 'شركة الأفق للاستثمار', amount: 25000, type: 'أتعاب', date: '2024-01-15', status: 'مدفوع' },
  { id: '2', clientName: 'أحمد محمود القحطاني', amount: 5000, type: 'دفعة مقدمة', date: '2024-02-10', status: 'مدفوع' },
  { id: '3', clientName: 'سارة آل رشيد', amount: 1200, type: 'مصروفات قضائية', date: '2024-02-25', status: 'مدفوع' },
  { id: '4', clientName: 'لبنى بن علي', amount: 15000, type: 'أتعاب', date: '2024-03-05', status: 'مدفوع' },
  { id: '5', clientName: 'مؤسسة الفهد للتجارة', amount: 8000, type: 'أتعاب', date: '2024-03-20', status: 'مدفوع' },
  { id: '6', clientName: 'شركة الأفق للاستثمار', amount: 12000, type: 'أتعاب', date: '2024-04-01', status: 'مدفوع' },
  { id: '7', clientName: 'أحمد محمود القحطاني', amount: 4500, type: 'أتعاب', date: '2024-04-12', status: 'معلق' },
  { id: '8', clientName: 'سيف الدين خالد', amount: 20000, type: 'أتعاب', date: '2024-04-25', status: 'مدفوع' },
];

export const MOCK_POAS: PowerOfAttorney[] = [
  { 
    id: '1', 
    clientName: 'شركة الأفق للاستثمار', 
    nationalId: '1029384756', 
    poaType: 'تجاري', 
    status: 'تم التوثيق', 
    notaryOffice: 'مكتب توثيق شمال الرياض', 
    appointmentDate: '2024-04-10',
    timeline: [
      { status: 'تقديم الطلب', date: '2024-04-01', completed: true },
      { status: 'مراجعة الصيغة', date: '2024-04-02', completed: true },
      { status: 'تصديق الغرفة التجارية', date: '2024-04-05', completed: true },
      { status: 'التوثيق النهائي', date: '2024-04-10', completed: true },
    ]
  },
  { 
    id: '2', 
    clientName: 'أحمد محمود القحطاني', 
    nationalId: '1122334455', 
    poaType: 'قضايا', 
    status: 'في انتظار الزيارة', 
    notaryOffice: 'مكتب توثيق العليا', 
    appointmentDate: '2024-05-05',
    timeline: [
      { status: 'تقديم الطلب', date: '2024-04-20', completed: true },
      { status: 'مراجعة الصيغة', date: '2024-04-21', completed: true },
      { status: 'حجز موعد الشهر العقاري', date: '2024-04-25', completed: true },
      { status: 'زيارة المكتب وتوقيع الموكل', date: '2024-05-05', completed: false },
    ]
  },
  { 
    id: '3', 
    clientName: 'ليلى بن علي', 
    nationalId: '2233445566', 
    poaType: 'خاص', 
    status: 'تحت التجهيز',
    timeline: [
      { status: 'تقديم الطلب', date: '2024-04-28', completed: true },
      { status: 'مراجعة الصيغة القانونية', date: 'قيد التنفيذ', completed: false },
    ]
  },
];
