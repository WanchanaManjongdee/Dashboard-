import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, ExternalLink, BookOpen, Rocket, ShieldCheck, Flame, CheckCircle2 } from 'lucide-react';

export const CodeExportView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard' | 'guide'>('survey');
  const [copiedSurvey, setCopiedSurvey] = useState(false);
  const [copiedDashboard, setCopiedDashboard] = useState(false);

  const downloadFile = (filename: string, path: string) => {
    fetch(path)
      .then((res) => res.text())
      .then((text) => {
        const blob = new Blob([text], { type: 'text/html;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch((err) => console.error(err));
  };

  const copyFileContent = (path: string, setCopiedState: (v: boolean) => void) => {
    fetch(path)
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard.writeText(text);
        setCopiedState(true);
        setTimeout(() => setCopiedState(false), 2500);
      });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl mb-6 border border-slate-800">
        <div className="flex items-center gap-2 mb-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
          <FileCode size={16} />
          <span>Standalone Code & Complete Setup Guide</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black">
          โค้ดแยก 2 ไฟล์ & วิธีตั้งค่า Firebase + Deploy ทีละขั้น
        </h2>
        <p className="text-slate-300 text-xs md:text-sm mt-2 max-w-2xl leading-relaxed">
          นำไฟล์ HTML ทั้ง 2 ไฟล์ไปใช้งานได้ทันที ไม่ต้องมี Node.js หรือ build tools ซับซ้อน เพียงแค่นำ databaseURL ของ Firebase Realtime Database มาใส่ ก็เชื่อมต่อกันแบบ Real-time ทันที
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 flex-wrap">
          <button
            onClick={() => setActiveTab('survey')}
            className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'survey'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>📱 ไฟล์ 1: survey.html</span>
            <span className="text-[10px] bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded-full">หน้าตอบ</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>📊 ไฟล์ 2: dashboard.html</span>
            <span className="text-[10px] bg-indigo-900/60 text-indigo-200 px-2 py-0.5 rounded-full">ขึ้นจอ</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'guide'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen size={16} />
            <span>📖 คู่มือตั้งค่า Firebase & Deploy</span>
          </button>
        </div>
      </div>

      {/* Content Panes */}
      {activeTab === 'survey' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs">
                  ไฟล์ที่ 1
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  survey.html (หน้าแบบประเมินสำหรับมือถือ)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                มีปุ่มประเมิน 1-5 ขนาดใหญ่ กดง่าย, ช่องข้อเสนอแนะ, ระบบป้องกันการตอบซ้ำ และเชื่อมต่อ Firebase Realtime DB
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyFileContent('/survey.html', setCopiedSurvey)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition"
              >
                {copiedSurvey ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copiedSurvey ? 'คัดลอกสำเร็จ!' : 'คัดลอกโค้ดทั้งหมด'}</span>
              </button>
              <button
                onClick={() => downloadFile('survey.html', '/survey.html')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition shadow-sm"
              >
                <Download size={14} />
                <span>ดาวน์โหลด survey.html</span>
              </button>
            </div>
          </div>

          <div className="mt-4 bg-slate-950 rounded-2xl p-4 text-slate-200 font-mono text-xs overflow-x-auto max-h-[480px]">
            <pre className="text-emerald-400 font-semibold mb-2">{`<!-- จุดที่ต้องแก้ไขใน survey.html: ใส่ URL ฐานข้อมูล Firebase ของคุณ -->`}</pre>
            <pre className="text-amber-300 bg-slate-900 p-2.5 rounded-xl border border-amber-500/30 mb-4">{`const firebaseConfig = {
  databaseURL: "https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app"
};`}</pre>
            <pre>{`<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
... (ดูโค้ดเต็มได้โดยกดปุ่มดาวน์โหลดหรือคัดลอก)`}</pre>
          </div>
        </div>
      )}

      {activeTab === 'dashboard' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                  ไฟล์ที่ 2
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  dashboard.html (หน้า Dashboard ขึ้นจอโปรเจกเตอร์)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                ออกแบบเหมาะกับจอใหญ่/โปรเจกเตอร์ กราฟแท่ง Chart.js อัปเดตทันที, QR Code ให้สแกน, สรุปเกณฑ์ 5 ระดับ และปุ่มโหลด CSV
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyFileContent('/dashboard.html', setCopiedDashboard)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition"
              >
                {copiedDashboard ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copiedDashboard ? 'คัดลอกสำเร็จ!' : 'คัดลอกโค้ดทั้งหมด'}</span>
              </button>
              <button
                onClick={() => downloadFile('dashboard.html', '/dashboard.html')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition shadow-sm"
              >
                <Download size={14} />
                <span>ดาวน์โหลด dashboard.html</span>
              </button>
            </div>
          </div>

          <div className="mt-4 bg-slate-950 rounded-2xl p-4 text-slate-200 font-mono text-xs overflow-x-auto max-h-[480px]">
            <pre className="text-emerald-400 font-semibold mb-2">{`<!-- จุดที่ต้องแก้ไขใน dashboard.html: ใส่ URL ฐานข้อมูล Firebase เดียวกันกับหน้าตอบ -->`}</pre>
            <pre className="text-amber-300 bg-slate-900 p-2.5 rounded-xl border border-amber-500/30 mb-4">{`const firebaseConfig = {
  databaseURL: "https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app"
};`}</pre>
            <pre>{`<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Real-time Dashboard แบบประเมินการอบรม</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
... (ดูโค้ดเต็มได้โดยกดปุ่มดาวน์โหลดหรือคัดลอก)`}</pre>
          </div>
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-8 text-slate-800 dark:text-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 mb-2">
              <Flame size={14} />
              <span>คู่มือตั้งค่า Firebase Realtime Database & วิธี Deploy ฟรี 100%</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black">
              ขั้นตอนการติดตั้งและนำไปใช้งานจริง (Step-by-Step)
            </h3>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              ทำตาม 5 ขั้นตอนนี้ ใช้เวลาไม่เกิน 5 นาที ไม่เสียค่าใช้จ่ายใดๆ ทั้งสิ้น (Spark Plan ฟรีตลอดชีพ)
            </p>
          </div>

          {/* Step 1 */}
          <div className="flex gap-4 items-start">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              1
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="text-sm md:text-base font-bold">สร้างโปรเจกต์บน Firebase Console</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                เข้าไปที่เว็บไซต์ <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline font-semibold">https://console.firebase.google.com</a> แล้วล็อกอินด้วยบัญชี Google &gt; กด <strong>"Create a project"</strong> (เพิ่มโปรเจกต์) ตั้งชื่อโปรเจกต์ เช่น <code>training-feedback-app</code> แล้วกดสร้าง
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 items-start">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
              2
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="text-sm md:text-base font-bold">เปิดใช้งาน Realtime Database</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                ในเมนูด้านซ้าย เลือก <strong>Build &gt; Realtime Database</strong> &gt; กดปุ่ม <strong>"Create Database"</strong>
              </p>
              <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-5 space-y-1">
                <li>เลือกที่ตั้งเซิร์ฟเวอร์ (Realtime Database Location): แนะนำเลือก <strong>Singapore (asia-southeast1)</strong> หรือ <strong>United States (us-central1)</strong> เพื่อความเร็วสูงสุดในไทย</li>
                <li>เมื่อระบบถามเรื่อง Security Rules ให้เลือก <strong>"Start in test mode"</strong> หรือกด Enable ไปก่อน</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 items-start">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              3
            </div>
            <div className="space-y-2 flex-1">
              <h4 className="text-sm md:text-base font-bold">ตั้งค่า Security Rules ให้ผู้เข้าอบรมตอบได้โดยไม่ต้องล็อกอิน</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                ไปที่แท็บ <strong>"Rules"</strong> ของ Realtime Database แล้ววางกฎด้านล่างนี้ จากนั้นกด <strong>"Publish"</strong>:
              </p>
              <div className="bg-slate-950 p-3.5 rounded-2xl text-amber-300 font-mono text-xs border border-slate-800">
                <pre>{`{
  "rules": {
    ".read": true,
    ".write": true
  }
}`}</pre>
              </div>
              <p className="text-[11px] text-slate-400">
                * กฎนี้อนุญาตให้ผู้เข้าอบรมส่งคำตอบและให้หน้า Dashboard อ่านผลสรุปได้ทันทีโดยไม่ต้องลงทะเบียนหรือเก็บชื่อ
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4 items-start">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              4
            </div>
            <div className="space-y-2 flex-1">
              <h4 className="text-sm md:text-base font-bold">คัดลอก Database URL มาวางในไฟล์โค้ดทั้ง 2 ไฟล์</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                ที่แท็บ <strong>Data</strong> ท่านจะเห็น URL ด้านบน เช่น: <br />
                <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono text-[11px]">
                  https://your-project-id-default-rtdb.asia-southeast1.firebasedatabase.app/
                </code>
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                เปิดไฟล์ <strong>survey.html</strong> และ <strong>dashboard.html</strong> แล้วค้นหาบรรทัด:
              </p>
              <div className="bg-slate-950 p-3 rounded-2xl text-emerald-300 font-mono text-xs border border-slate-800">
                <code>databaseURL: "https://your-project-id-default-rtdb.asia-southeast1.firebasedatabase.app",</code>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4 items-start">
            <div className="w-9 h-9 rounded-2xl bg-purple-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
              5
            </div>
            <div className="space-y-3 flex-1">
              <h4 className="text-sm md:text-base font-bold">วิธีนำขึ้นโฮสติ้งออนไลน์ (Deploy ฟรี)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                ท่านสามารถเลือกวิธีใดวิธีหนึ่งต่อไปนี้เพื่อเปิดลิงก์ให้ผู้ร่วมงานสแกนตอบ:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mb-1">
                    <Rocket size={14} />
                    <span>วิธีที่ 1: Vercel / Netlify (ง่ายสุด)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    เพียงลากโฟลเดอร์ที่มีไฟล์ <code>survey.html</code> และ <code>dashboard.html</code> ไปวางในเว็บ <strong>app.netlify.com/drop</strong> จะได้ URL เว็บพร้อมใช้งานทันทีใน 10 วินาที
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-1">
                    <Flame size={14} />
                    <span>วิธีที่ 2: Firebase Hosting</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    ใช้คำสั่ง <code>firebase init hosting</code> และ <code>firebase deploy</code> รวมอยู่ในโปรเจกต์เดียวกัน ฟรี SSL HTTPS ทันที
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 size={14} />
                    <span>วิธีที่ 3: GitHub Pages</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    อัปโหลดไฟล์ขึ้น GitHub Repository &gt; ไปที่ Settings &gt; Pages &gt; เลือก Branch main จะได้ลิงก์ออนไลน์ฟรีถาวร
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
