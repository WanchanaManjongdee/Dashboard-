import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, ExternalLink, X, Save, Trash2 } from 'lucide-react';
import { FirebaseSettings } from '../types';
import { getStoredFirebaseConfig, saveFirebaseConfig } from '../services/storage';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({ isOpen, onClose, onSaved }) => {
  const current = getStoredFirebaseConfig();
  const [dbUrl, setDbUrl] = useState(current?.databaseUrl || '');
  const [nodePath, setNodePath] = useState(current?.nodePath || 'evaluations');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!dbUrl.trim()) {
      setErrorMsg('กรุณากรอก Firebase Realtime Database URL');
      setTestStatus('error');
      return;
    }
    setTestStatus('testing');
    setErrorMsg('');

    try {
      let clean = dbUrl.trim();
      if (!clean.endsWith('/')) clean += '/';
      const testEndpoint = `${clean}${nodePath.trim() || 'evaluations'}.json?shallow=true`;

      const res = await fetch(testEndpoint);
      if (res.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
        setErrorMsg(`HTTP Error ${res.status}: ตรวจสอบ Security Rules ว่าเปิด .read: true และ .write: true หรือไม่`);
      }
    } catch (err: unknown) {
      setTestStatus('error');
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`เชื่อมต่อไม่สำเร็จ: ${msg} (โปรดตรวจสอบ URL หรือ CORS)`);
    }
  };

  const handleSave = () => {
    if (!dbUrl.trim()) {
      saveFirebaseConfig(null);
    } else {
      let clean = dbUrl.trim();
      if (clean.endsWith('/')) clean = clean.slice(0, -1);
      saveFirebaseConfig({
        databaseUrl: clean,
        nodePath: nodePath.trim() || 'evaluations',
      });
    }
    onSaved();
    onClose();
  };

  const handleClear = () => {
    saveFirebaseConfig(null);
    setDbUrl('');
    setTestStatus('idle');
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-slate-800 dark:text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Database size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold">ตั้งค่า Firebase Realtime Database</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">เชื่อมต่อฐานข้อมูลสำหรับซิงค์ข้ามอุปกรณ์และเครื่องจริง</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Firebase Database URL
            </label>
            <input
              type="text"
              placeholder="https://your-project-rtdb.asia-southeast1.firebasedatabase.app"
              value={dbUrl}
              onChange={(e) => setDbUrl(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              คัดลอกจาก Firebase Console &gt; Realtime Database (หากเว้นว่างไว้ ระบบจะใช้ Local / BroadcastChannel อัตโนมัติ)
            </p>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              ชื่อ Node ที่จัดเก็บ (Database Node Path)
            </label>
            <input
              type="text"
              placeholder="evaluations"
              value={nodePath}
              onChange={(e) => setNodePath(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
            />
          </div>

          {/* Test Status feedback */}
          {testStatus === 'success' && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>เชื่อมต่อ Firebase Realtime Database สำเร็จเรียบร้อย!</span>
            </div>
          )}

          {testStatus === 'error' && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">💡 คำแนะนำ Security Rules:</span>
            <div className="mt-1 font-mono text-[10px] bg-slate-100 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              {`{ "rules": { ".read": true, ".write": true } }`}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1 font-medium py-2 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
          >
            <Trash2 size={14} />
            <span>ใช้โหมด Local เริ่มต้น</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing' || !dbUrl.trim()}
              className="text-xs py-2 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition disabled:opacity-50"
            >
              {testStatus === 'testing' ? 'กำลังทดสอบ...' : 'ทดสอบการเชื่อมต่อ'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-xs py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Save size={14} />
              <span>บันทึกการตั้งค่า</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
