import { SurveyResponse, FirebaseSettings } from '../types';

const STORAGE_KEY = 'training_evaluations_v1';
const SUBMISSION_FLAG_KEY = 'training_has_submitted_device';
const FIREBASE_CONFIG_KEY = 'training_firebase_config';

// BroadcastChannel for instant real-time synchronization between tabs on the same machine
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('training_evaluations_channel');
  }
} catch {
  // Ignore if unsupported
}

export function getStoredFirebaseConfig(): FirebaseSettings | null {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveFirebaseConfig(config: FirebaseSettings | null) {
  try {
    if (!config) {
      localStorage.removeItem(FIREBASE_CONFIG_KEY);
    } else {
      localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
    }
    notifyUpdate();
  } catch (err) {
    console.error('Failed to save Firebase config', err);
  }
}

export function hasDeviceSubmitted(): boolean {
  try {
    return localStorage.getItem(SUBMISSION_FLAG_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setDeviceSubmitted(value: boolean) {
  try {
    if (value) {
      localStorage.setItem(SUBMISSION_FLAG_KEY, 'true');
    } else {
      localStorage.removeItem(SUBMISSION_FLAG_KEY);
    }
  } catch (err) {
    console.error('Failed to set submission flag', err);
  }
}

export function getLocalResponses(): SurveyResponse[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse responses from localStorage', err);
    return [];
  }
}

export function saveLocalResponses(responses: SurveyResponse[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
    notifyUpdate();
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

function notifyUpdate() {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: 'DATA_UPDATED', timestamp: Date.now() });
    } catch {
      // ignore
    }
  }
}

export function subscribeToUpdates(callback: () => void): () => void {
  const handler = () => {
    callback();
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handler);
  }

  // Also listen for standard storage event
  window.addEventListener('storage', handler);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handler);
    }
    window.removeEventListener('storage', handler);
  };
}

// Push to Firebase Realtime Database if configured
export async function submitResponse(response: Omit<SurveyResponse, 'id'>): Promise<SurveyResponse> {
  const fullResponse: SurveyResponse = {
    ...response,
    id: 'resp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
  };

  // 1. Save locally
  const current = getLocalResponses();
  const updated = [fullResponse, ...current];
  saveLocalResponses(updated);
  setDeviceSubmitted(true);

  // 2. If Firebase RTDB is configured, push to REST endpoint
  const fbConfig = getStoredFirebaseConfig();
  if (fbConfig && fbConfig.databaseUrl) {
    try {
      let cleanUrl = fbConfig.databaseUrl.trim();
      if (!cleanUrl.endsWith('/')) cleanUrl += '/';
      const nodePath = fbConfig.nodePath?.trim() || 'evaluations';
      const endpoint = `${cleanUrl}${nodePath}.json`;

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullResponse),
      });
    } catch (err) {
      console.warn('Firebase RTDB submission warning:', err);
    }
  }

  return fullResponse;
}

// Fetch from Firebase Realtime Database
export async function syncFromFirebase(): Promise<SurveyResponse[] | null> {
  const fbConfig = getStoredFirebaseConfig();
  if (!fbConfig || !fbConfig.databaseUrl) return null;

  try {
    let cleanUrl = fbConfig.databaseUrl.trim();
    if (!cleanUrl.endsWith('/')) cleanUrl += '/';
    const nodePath = fbConfig.nodePath?.trim() || 'evaluations';
    const endpoint = `${cleanUrl}${nodePath}.json`;

    const res = await fetch(endpoint);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data) return [];

    const list: SurveyResponse[] = [];
    Object.keys(data).forEach((key) => {
      const item = data[key];
      if (item && item.q1 && item.q2) {
        list.push({
          ...item,
          id: item.id || key,
        });
      }
    });

    list.sort((a, b) => b.timestamp - a.timestamp);
    // Sync into localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list;
  } catch (err) {
    console.warn('Firebase sync failed:', err);
    return null;
  }
}

// Seed Demo Data for Testing
export function seedSampleData(): SurveyResponse[] {
  const sampleComments = [
    'วิทยากรสอนเข้าใจง่ายมาก มีตัวอย่างจริงให้ฝึกปฏิบัติ ชัดเจนดีครับ',
    'เนื้อหาทันสมัย นำไปปรับใช้กับการทำงานได้ทันที บรรยากาศสนุกสนาน',
    'อยากให้เพิ่มเวลาในการ workshop ทำเคสจริงอีกสัก 30 นาทีครับ',
    'สไลด์สรุปเนื้อหาได้สวยงามและอ่านง่ายมากครับ ขอบคุณทีมงานครับ',
    'จัดสถานที่และอุปกรณ์ได้ดีมาก อาหารว่างอร่อย มีโอกาสจะเข้าร่วมอีกแน่นอน',
    'เทคนิคที่แชร์มีประโยชน์มาก โดยเฉพาะเครื่องมือและการแก้ปัญหาเฉพาะหน้า',
    'เป็นหลักสูตรที่ดีมาก คุ้มค่าเวลาที่มาเรียนครับ',
    'อยากให้มีคอร์สระดับ Advanced ต่อเนื่องในเดือนถัดไปครับ',
  ];

  const now = Date.now();
  const samples: SurveyResponse[] = [];

  const baseRatings = [
    [5, 5, 5, 5, 5],
    [5, 5, 4, 5, 5],
    [4, 5, 4, 4, 5],
    [5, 4, 4, 5, 4],
    [4, 4, 3, 4, 4],
    [5, 5, 5, 4, 5],
    [4, 5, 4, 5, 4],
    [5, 4, 5, 5, 5],
    [3, 4, 4, 4, 4],
    [5, 5, 5, 5, 5],
    [4, 5, 5, 4, 5],
    [5, 4, 4, 4, 4],
  ];

  baseRatings.forEach((ratings, idx) => {
    const timeOffset = (baseRatings.length - idx) * 120000 + Math.floor(Math.random() * 60000);
    const ts = now - timeOffset;
    const avg = Number((ratings.reduce((a, b) => a + b, 0) / 5).toFixed(2));
    const comment = idx < sampleComments.length ? sampleComments[idx] : undefined;

    samples.push({
      id: 'demo_' + idx + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: ts,
      dateStr: new Date(ts).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      q1: ratings[0],
      q2: ratings[1],
      q3: ratings[2],
      q4: ratings[3],
      q5: ratings[4],
      feedback: comment,
      averageScore: avg,
    });
  });

  saveLocalResponses(samples);
  return samples;
}

export function clearAllResponses() {
  localStorage.removeItem(STORAGE_KEY);
  notifyUpdate();
}

// Export responses to CSV with Thai UTF-8 BOM
export function exportToCSV(responses: SurveyResponse[]): void {
  if (responses.length === 0) return;

  const headers = [
    'ลำดับ',
    'วันเวลาที่ตอบ',
    'ข้อ 1 (เนื้อหา & ประโยชน์)',
    'ข้อ 2 (วิทยากร & การถ่ายทอด)',
    'ข้อ 3 (การจัดสรรเวลา & กิจกรรม)',
    'ข้อ 4 (เอกสาร & สื่อประกอบ)',
    'ข้อ 5 (ความพึงพอใจภาพรวม)',
    'คะแนนเฉลี่ยรวม',
    'ระดับความพึงพอใจ',
    'ข้อเสนอแนะเพิ่มเติม',
  ];

  const escapeCSV = (text: string | number | undefined) => {
    if (text === undefined || text === null) return '""';
    const str = String(text).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = responses.map((r, index) => {
    const dateFormatted = new Date(r.timestamp).toLocaleString('th-TH');
    let level = 'ปานกลาง';
    if (r.averageScore >= 4.51) level = 'มากที่สุด';
    else if (r.averageScore >= 3.51) level = 'มาก';
    else if (r.averageScore >= 2.51) level = 'ปานกลาง';
    else if (r.averageScore >= 1.51) level = 'น้อย';
    else level = 'น้อยที่สุด';

    return [
      escapeCSV(index + 1),
      escapeCSV(dateFormatted),
      escapeCSV(r.q1),
      escapeCSV(r.q2),
      escapeCSV(r.q3),
      escapeCSV(r.q4),
      escapeCSV(r.q5),
      escapeCSV(r.averageScore.toFixed(2)),
      escapeCSV(level),
      escapeCSV(r.feedback || '-'),
    ].join(',');
  });

  // Prepend UTF-8 Byte Order Mark (BOM) \uFEFF to guarantee Excel displays Thai characters properly
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `แบบประเมินความพึงพอใจ_อบรม_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
