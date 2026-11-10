import React from 'react';
import {
  Smartphone,
  LayoutDashboard,
  QrCode,
  FileCode,
  Database,
  FlaskConical,
  Trash2,
  Download,
  Share2,
} from 'lucide-react';
import { getStoredFirebaseConfig } from '../services/storage';

interface NavbarProps {
  currentTab: 'survey' | 'dashboard' | 'code';
  onSelectTab: (tab: 'survey' | 'dashboard' | 'code') => void;
  onOpenQr: () => void;
  onOpenFirebase: () => void;
  onSeedDemo: () => void;
  onClearData: () => void;
  responseCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenQr,
  onOpenFirebase,
  onSeedDemo,
  onClearData,
  responseCount,
}) => {
  const fbConfig = getStoredFirebaseConfig();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
            ⭐
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight">
                ประเมินการอบรม & Real-time Dashboard
              </span>
              {fbConfig ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Firebase RTDB 🟢
                </span>
              ) : (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Local Live Sync ⚡
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              ผู้ตอบ {responseCount} คน • อัปเดตขึ้นจอทันที
            </p>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs font-semibold">
          <button
            onClick={() => onSelectTab('survey')}
            className={`px-3 md:px-4 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              currentTab === 'survey'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Smartphone size={15} />
            <span>หน้าตอบ (มือถือ)</span>
          </button>

          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 md:px-4 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              currentTab === 'dashboard'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <LayoutDashboard size={15} />
            <span>หน้า Dashboard (ขึ้นจอ)</span>
          </button>

          <button
            onClick={() => onSelectTab('code')}
            className={`px-3 md:px-4 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              currentTab === 'code'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <FileCode size={15} />
            <span className="hidden sm:inline">โค้ด 2 ไฟล์ & คู่มือ</span>
            <span className="sm:hidden">โค้ด</span>
          </button>
        </nav>

        {/* Right Tools Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenQr}
            className="p-2 md:px-3 md:py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
            title="แสดง QR Code สำหรับสแกน"
          >
            <QrCode size={16} />
            <span className="hidden lg:inline">QR Code</span>
          </button>

          <button
            onClick={onOpenFirebase}
            className={`p-2 md:px-3 md:py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
              fbConfig
                ? 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="ตั้งค่าเชื่อมต่อ Firebase Realtime Database"
          >
            <Database size={16} />
            <span className="hidden lg:inline">ตั้งค่า Firebase</span>
          </button>

          <button
            onClick={onSeedDemo}
            className="p-2 md:px-3 md:py-1.5 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 transition flex items-center gap-1.5"
            title="จำลองคำตอบทดสอบ 5 รายการเพื่อดูผลบนจอทันที"
          >
            <FlaskConical size={15} />
            <span className="hidden xl:inline">จำลอง 5 คำตอบ</span>
          </button>

          <button
            onClick={onClearData}
            className="p-2 rounded-xl text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
            title="ล้างข้อมูลผลประเมินทั้งหมด"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
