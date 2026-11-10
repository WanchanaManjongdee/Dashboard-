export interface SurveyResponse {
  id: string;
  timestamp: number;
  dateStr: string;
  q1: number; // เนื้อหาการอบรมมีความน่าสนใจและเป็นประโยชน์
  q2: number; // วิทยากรมีความรู้ความเชี่ยวชาญและถ่ายทอดได้ชัดเจน
  q3: number; // การจัดสรรเวลาและกิจกรรมมีความเหมาะสม
  q4: number; // เอกสารและสื่อประกอบการบรรยายมีคุณภาพ
  q5: number; // ความพึงพอใจในภาพรวมต่อการจัดอบรม
  feedback?: string;
  averageScore: number;
  deviceFingerprint?: string;
}

export interface QuestionDef {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
  title: string;
  subtitle: string;
  shortLabel: string;
  iconName: string;
}

export interface ScaleLevel {
  score: number;
  label: string;
  emoji: string;
  color: string;
}

export interface LikertInterpretation {
  min: number;
  max: number;
  level: string;
  levelEn: string;
  color: string;
  bgLight: string;
  textColor: string;
  description: string;
}

export interface FirebaseSettings {
  databaseUrl: string;
  apiKey?: string;
  projectId?: string;
  nodePath: string; // default "evaluations"
}
