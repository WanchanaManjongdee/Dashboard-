import { QuestionDef, ScaleLevel, LikertInterpretation } from '../types';

export const EVALUATION_QUESTIONS: QuestionDef[] = [
  {
    id: 'q1',
    title: '1. เนื้อหาการอบรมมีความน่าสนใจและเป็นประโยชน์ในการปฏิบัติงาน',
    subtitle: 'ความทันสมัย ตรงเป้าหมาย สามารถนำไปประยุกต์ใช้ได้จริง',
    shortLabel: 'เนื้อหา & ประโยชน์',
    iconName: 'BookOpen',
  },
  {
    id: 'q2',
    title: '2. วิทยากรมีความรู้ความเชี่ยวชาญ ถ่ายทอดเข้าใจง่ายและเปิดโอกาสให้ซักถาม',
    subtitle: 'ความชัดเจน เทคนิคการสอน การตอบข้อซักถามอย่างเป็นกันเอง',
    shortLabel: 'วิทยากร & การถ่ายทอด',
    iconName: 'UserCheck',
  },
  {
    id: 'q3',
    title: '3. การจัดสรรเวลา ความต่อเนื่อง และกิจกรรมการเรียนรู้มีความเหมาะสม',
    subtitle: 'จังหวะการบรรยาย เวลาพัก และการมีส่วนร่วมในกิจกรรม',
    shortLabel: 'การจัดสรรเวลา & กิจกรรม',
    iconName: 'Clock',
  },
  {
    id: 'q4',
    title: '4. เอกสาร สไลด์ และสื่อประกอบการอบรมมีคุณภาพและชัดเจน',
    subtitle: 'ความสมบูรณ์ เข้าใจง่าย สามารถใช้ทบทวนภายหลังได้',
    shortLabel: 'เอกสาร & สื่อประกอบ',
    iconName: 'FileText',
  },
  {
    id: 'q5',
    title: '5. ความพึงพอใจในภาพรวมต่อการจัดอบรมในครั้งนี้',
    subtitle: 'ความคุ้มค่า ความประทับใจ และภาพรวมของการให้บริการ',
    shortLabel: 'ความพึงพอใจภาพรวม',
    iconName: 'Award',
  },
];

export const SCALE_LEVELS: ScaleLevel[] = [
  { score: 5, label: 'มากที่สุด', emoji: '🤩', color: '#10b981' },
  { score: 4, label: 'มาก', emoji: '😊', color: '#3b82f6' },
  { score: 3, label: 'ปานกลาง', emoji: '😐', color: '#f59e0b' },
  { score: 2, label: 'น้อย', emoji: '🙁', color: '#f97316' },
  { score: 1, label: 'น้อยที่สุด', emoji: '😞', color: '#ef4444' },
];

// เกณฑ์การแปลผลตามค่าเฉลี่ยสเกลลิเคิร์ต 5 ระดับ (Likert Scale Interpretation)
export const LIKERT_CRITERIA: LikertInterpretation[] = [
  {
    min: 4.51,
    max: 5.00,
    level: 'มากที่สุด',
    levelEn: 'Highest / Excellent',
    color: '#059669',
    bgLight: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    description: 'ผู้เข้าร่วมอบรมมีความพึงพอใจในระดับดีเยี่ยมอย่างยิ่ง',
  },
  {
    min: 3.51,
    max: 4.50,
    level: 'มาก',
    levelEn: 'High / Good',
    color: '#2563eb',
    bgLight: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700',
    textColor: 'text-blue-600 dark:text-blue-400',
    description: 'ผู้เข้าร่วมอบรมมีความพึงพอใจในเกณฑ์ดี ผ่านเป้าหมายมาตรฐาน',
  },
  {
    min: 2.51,
    max: 3.50,
    level: 'ปานกลาง',
    levelEn: 'Moderate / Fair',
    color: '#d97706',
    bgLight: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700',
    textColor: 'text-amber-600 dark:text-amber-400',
    description: 'ระดับความพึงพอใจอยู่ในเกณฑ์ปานกลาง ควรพิจารณาปรับปรุงบางจุด',
  },
  {
    min: 1.51,
    max: 2.50,
    level: 'น้อย',
    levelEn: 'Low / Poor',
    color: '#ea580c',
    bgLight: 'bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-700',
    textColor: 'text-orange-600 dark:text-orange-400',
    description: 'ความพึงพอใจต่ำกว่าเกณฑ์ จำเป็นต้องปรับปรุงเนื้อหาหรือวิธีการ',
  },
  {
    min: 1.00,
    max: 1.50,
    level: 'น้อยที่สุด',
    levelEn: 'Lowest / Very Poor',
    color: '#dc2626',
    bgLight: 'bg-red-50 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-700',
    textColor: 'text-red-600 dark:text-red-400',
    description: 'ความพึงพอใจน้อยที่สุด ควรทบทวนกระบวนการและเนื้อหาใหม่ทั้งหมด',
  },
];

export function getLikertInterpretation(score: number): LikertInterpretation {
  const rounded = Number(score.toFixed(2));
  for (const item of LIKERT_CRITERIA) {
    if (rounded >= item.min && rounded <= item.max) {
      return item;
    }
  }
  if (rounded > 5.0) return LIKERT_CRITERIA[0];
  if (rounded < 1.0 && rounded > 0) return LIKERT_CRITERIA[4];
  return {
    min: 0,
    max: 0,
    level: 'ยังไม่มีข้อมูล',
    levelEn: 'No data yet',
    color: '#64748b',
    bgLight: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800',
    textColor: 'text-slate-500',
    description: 'รอผู้เข้าร่วมอบรมส่งแบบประเมิน',
  };
}
