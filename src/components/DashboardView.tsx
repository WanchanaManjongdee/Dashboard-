import React, { useState, useEffect, useRef } from 'react';
import { SurveyResponse } from '../types';
import { EVALUATION_QUESTIONS, getLikertInterpretation, LIKERT_CRITERIA } from '../data/questions';
import { exportToCSV, clearAllResponses, seedSampleData } from '../services/storage';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  Users,
  Award,
  TrendingUp,
  Download,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  MessageSquare,
  QrCode,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface DashboardViewProps {
  responses: SurveyResponse[];
  onOpenQrModal: () => void;
  surveyUrl: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ responses, onOpenQrModal, surveyUrl }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'withComments'>('all');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const prevCountRef = useRef(responses.length);

  // Generate QR code for the projector widget
  useEffect(() => {
    if (qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, surveyUrl, {
        width: 130,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
    }
  }, [surveyUrl]);

  // Audio chime & Confetti on new responses
  useEffect(() => {
    if (responses.length > prevCountRef.current && prevCountRef.current > 0) {
      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      // Audio notification using Web Audio API
      if (soundEnabled) {
        try {
          const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.35);
        } catch {
          // ignore
        }
      }
    }
    prevCountRef.current = responses.length;
  }, [responses.length, soundEnabled]);

  // Calculations
  const totalCount = responses.length;

  let sumQ1 = 0, sumQ2 = 0, sumQ3 = 0, sumQ4 = 0, sumQ5 = 0;
  responses.forEach((r) => {
    sumQ1 += Number(r.q1 || 0);
    sumQ2 += Number(r.q2 || 0);
    sumQ3 += Number(r.q3 || 0);
    sumQ4 += Number(r.q4 || 0);
    sumQ5 += Number(r.q5 || 0);
  });

  const avgQ1 = totalCount > 0 ? sumQ1 / totalCount : 0;
  const avgQ2 = totalCount > 0 ? sumQ2 / totalCount : 0;
  const avgQ3 = totalCount > 0 ? sumQ3 / totalCount : 0;
  const avgQ4 = totalCount > 0 ? sumQ4 / totalCount : 0;
  const avgQ5 = totalCount > 0 ? sumQ5 / totalCount : 0;
  const overallAvg = totalCount > 0 ? (avgQ1 + avgQ2 + avgQ3 + avgQ4 + avgQ5) / 5 : 0;

  const interpretation = getLikertInterpretation(overallAvg);

  const questionAverages = [
    { def: EVALUATION_QUESTIONS[0], avg: avgQ1, color: 'bg-blue-500', barGradient: 'from-blue-600 to-indigo-500' },
    { def: EVALUATION_QUESTIONS[1], avg: avgQ2, color: 'bg-emerald-500', barGradient: 'from-emerald-600 to-teal-500' },
    { def: EVALUATION_QUESTIONS[2], avg: avgQ3, color: 'bg-amber-500', barGradient: 'from-amber-500 to-orange-500' },
    { def: EVALUATION_QUESTIONS[3], avg: avgQ4, color: 'bg-purple-500', barGradient: 'from-purple-600 to-indigo-500' },
    { def: EVALUATION_QUESTIONS[4], avg: avgQ5, color: 'bg-rose-500', barGradient: 'from-rose-500 to-pink-500' },
  ];

  // Feedback list
  const feedbackItems = responses.filter((r) => r.feedback && r.feedback.trim() !== '');
  const displayItems = selectedFilter === 'withComments' ? feedbackItems : responses;

  const toggleFullscreenMode = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col gap-6">
      {/* Top Banner / Projector Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/25">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE REAL-TIME SYNC
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                • อัปเดตทันทีที่มีการส่งแบบสอบถาม
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight mt-0.5">
              แดชบอร์ดสรุปผลความพึงพอใจการอบรม
            </h1>
          </div>
        </div>

        {/* Action Buttons for Presenter / Projector */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-500'
            }`}
            title={soundEnabled ? 'ปิดเสียงแจ้งเตือนคำตอบใหม่' : 'เปิดเสียงแจ้งเตือนคำตอบใหม่'}
          >
            {soundEnabled ? <Volume2 size={16} className="text-emerald-400" /> : <VolumeX size={16} />}
            <span className="hidden md:inline">{soundEnabled ? 'เสียง: เปิด' : 'เสียง: ปิด'}</span>
          </button>

          <button
            onClick={onOpenQrModal}
            className="px-3.5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-md shadow-blue-500/20"
          >
            <QrCode size={16} />
            <span>ขยาย QR Code</span>
          </button>

          <button
            onClick={() => exportToCSV(responses)}
            disabled={totalCount === 0}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition disabled:opacity-40"
          >
            <Download size={16} />
            <span>ดาวน์โหลด CSV</span>
          </button>

          <button
            onClick={toggleFullscreenMode}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            title="สลับโหมดเต็มจอ"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span className="hidden md:inline">{isFullscreen ? 'ย่อจอ' : 'ขึ้นจอเต็ม'}</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Big KPIs & Live QR Code on Projector (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Key Metric 1: Total Respondents */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  จำนวนผู้เข้าอบรมที่ตอบแบบประเมิน
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {totalCount}
                  </span>
                  <span className="text-base text-slate-500 dark:text-slate-400 font-semibold">
                    คน
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl">
                <Users size={30} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                พร้อมรับข้อมูลแบบ Real-time
              </span>
              <span>มีข้อเสนอแนะ {feedbackItems.length} รายการ</span>
            </div>
          </div>

          {/* Key Metric 2: Overall Satisfaction & Likert Interpretation */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white border border-indigo-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  คะแนนความพึงพอใจเฉลี่ยรวม (5 ข้อ)
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-black tracking-tight text-white">
                    {totalCount > 0 ? overallAvg.toFixed(2) : '0.00'}
                  </span>
                  <span className="text-lg text-indigo-200/80 font-semibold">/ 5.00</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center text-3xl">
                <Award size={32} />
              </div>
            </div>

            {/* Likert Interpretation Badge */}
            <div className="mt-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl text-sm font-black border backdrop-blur-md bg-white/10 border-white/20">
                <span>ผลการแปลระดับ:</span>
                <span className="text-amber-300 font-extrabold">{interpretation.level}</span>
                <span className="text-xs text-indigo-200 font-normal">({interpretation.levelEn})</span>
              </div>
              <p className="text-xs text-indigo-200/90 mt-2 leading-relaxed">
                {interpretation.description}
              </p>
            </div>

            {/* Likert Scale Legend Scale Visualizer */}
            <div className="mt-5 pt-4 border-t border-indigo-500/20 grid grid-cols-5 gap-1 text-center text-[10px]">
              {LIKERT_CRITERIA.map((crit) => (
                <div
                  key={crit.level}
                  className={`p-1.5 rounded-xl border transition ${
                    interpretation.level === crit.level
                      ? 'bg-white/20 border-white font-bold text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-indigo-200/60'
                  }`}
                >
                  <div className="font-bold">{crit.level}</div>
                  <div className="text-[9px] opacity-75">{crit.min.toFixed(2)}-{crit.max.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Embedded QR Code Card for Audience Screen */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-1">
              <QrCode size={18} className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                สแกนตอบแบบประเมินผ่านมือถือ
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              ใช้กล้องมือถือสแกน QR Code ด้านล่างเพื่อส่งผลประเมินทันที
            </p>

            <div className="p-3 bg-white rounded-2xl border-2 border-dashed border-indigo-200 dark:border-slate-700 shadow-md inline-block mb-3">
              <canvas ref={qrCanvasRef} />
            </div>

            <div className="w-full bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 text-[11px] font-mono text-blue-600 dark:text-blue-400 truncate select-all">
              {surveyUrl}
            </div>

            <button
              onClick={onOpenQrModal}
              className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Share2 size={13} />
              <span>แสดง QR Code หน้าต่างใหญ่ / ดาวน์โหลดรูป</span>
            </button>
          </div>

        </div>

        {/* Right Column: Detailed Breakdown by Question & Live Feedback (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* Chart Card: 5 Questions Comparison */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 size={20} className="text-indigo-600 dark:text-indigo-400" />
                  <span>กราฟคะแนนเฉลี่ยแยกรายข้อ (เต็ม 5.00 คะแนน)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  เปรียบเทียบผลประเมินใน 5 มิติหลักของการฝึกอบรม
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                สเกล 1 - 5
              </span>
            </div>

            {/* Horizontal Bar Chart representation */}
            <div className="space-y-4 pt-2">
              {questionAverages.map((item, idx) => {
                const percentage = totalCount > 0 ? (item.avg / 5) * 100 : 0;
                const itemInterp = getLikertInterpretation(item.avg);

                return (
                  <div key={item.def.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 max-w-[70%]">
                        <span className="font-bold text-slate-700 dark:text-slate-200 truncate">
                          {idx + 1}. {item.def.shortLabel}
                        </span>
                        <span className="text-[10px] text-slate-400 hidden sm:inline truncate">
                          ({item.def.title.slice(3, 40)}...)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-black text-sm text-slate-900 dark:text-white">
                          {totalCount > 0 ? item.avg.toFixed(2) : '0.00'}
                        </span>
                        <span className="text-[10px] text-slate-400">/ 5.00</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${itemInterp.bgLight}`}>
                          {itemInterp.level}
                        </span>
                      </div>
                    </div>

                    {/* Animated Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-xl overflow-hidden p-0.5 relative">
                      <div
                        className={`h-full rounded-lg bg-gradient-to-r ${item.barGradient} transition-all duration-700 ease-out`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Feedback Cards Feed */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={19} className="text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  ข้อเสนอแนะล่าสุดจากผู้เข้าอบรม
                </h3>
                <span className="text-xs bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
                  {feedbackItems.length} ความคิดเห็น
                </span>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    selectedFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  ทั้งหมด ({totalCount})
                </button>
                <button
                  onClick={() => setSelectedFilter('withComments')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    selectedFilter === 'withComments'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  มีข้อเสนอแนะ ({feedbackItems.length})
                </button>
              </div>
            </div>

            {/* Feed Scroll Container */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 flex-1">
              {displayItems.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <div className="text-3xl mb-2">📬</div>
                  <p>ยังไม่มีข้อมูลข้อเสนอแนะในขณะนี้</p>
                  <p className="text-[11px] mt-1 text-slate-400">
                    เมื่อผู้เข้าร่วมอบรมส่งความคิดเห็น ข้อความจะปรากฏขึ้นที่นี่โดยอัตโนมัติ
                  </p>
                </div>
              ) : (
                displayItems.map((r, i) => (
                  <div
                    key={r.id || i}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 transition hover:border-blue-400 dark:hover:border-blue-500/50"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md text-[11px]">
                          ⭐ เฉลี่ย {r.averageScore.toFixed(2)}
                        </span>
                        <span className="text-[11px]">
                          ข้อ 1-5: [{r.q1}, {r.q2}, {r.q3}, {r.q4}, {r.q5}]
                        </span>
                      </div>
                      <span className="text-[11px] font-mono">
                        {r.dateStr || new Date(r.timestamp).toLocaleTimeString('th-TH')}
                      </span>
                    </div>

                    {r.feedback ? (
                      <p className="text-xs md:text-sm text-slate-800 dark:text-slate-100 font-medium leading-relaxed mt-1">
                        &ldquo;{r.feedback}&rdquo;
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        (ไม่ได้ระบุข้อเสนอแนะเพิ่มเติม)
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
