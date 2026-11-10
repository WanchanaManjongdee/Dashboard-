import React, { useState, useEffect } from 'react';
import { EVALUATION_QUESTIONS, SCALE_LEVELS, getLikertInterpretation } from '../data/questions';
import { submitResponse, hasDeviceSubmitted, setDeviceSubmitted } from '../services/storage';
import { SurveyResponse } from '../types';
import { Send, CheckCircle2, RotateCcw, AlertTriangle, Sparkles, MessageSquare, ShieldCheck, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SurveyViewProps {
  onGoToDashboard?: () => void;
  onOpenQr?: () => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ onGoToDashboard, onOpenQr }) => {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<SurveyResponse | null>(null);
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);

  useEffect(() => {
    setIsAlreadySubmitted(hasDeviceSubmitted());
  }, []);

  const handleSelectScore = (questionId: string, score: number) => {
    setScores((prev) => ({
      ...prev,
      [questionId]: score,
    }));
  };

  const answeredCount = Object.keys(scores).length;
  const progressPercent = Math.round((answeredCount / 5) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check all 5 questions
    for (let i = 1; i <= 5; i++) {
      if (!scores[`q${i}`]) {
        alert(`กรุณาประเมินข้อที่ ${i} ให้ครบถ้วน`);
        const el = document.getElementById(`question-card-q${i}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    setIsSubmitting(true);
    const avg = (scores.q1 + scores.q2 + scores.q3 + scores.q4 + scores.q5) / 5;

    try {
      const response = await submitResponse({
        timestamp: Date.now(),
        dateStr: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        q1: scores.q1,
        q2: scores.q2,
        q3: scores.q3,
        q4: scores.q4,
        q5: scores.q5,
        feedback: feedback.trim() || undefined,
        averageScore: Number(avg.toFixed(2)),
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore
      }

      setSubmittedData(response);
      setIsAlreadySubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล: ' + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForTesting = () => {
    setDeviceSubmitted(false);
    setIsAlreadySubmitted(false);
    setSubmittedData(null);
    setScores({});
    setFeedback('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 md:py-8">
      {/* Mobile-first Header Card */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white rounded-3xl p-6 shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-sm tracking-wide">
            <Sparkles size={13} className="text-amber-300" />
            แบบประเมินความพึงพอใจการอบรม
          </span>
          <span className="text-xs text-blue-100 font-medium">
            ข้อ {answeredCount}/5
          </span>
        </div>

        <h1 className="text-xl md:text-2xl font-black tracking-tight leading-snug">
          การประเมินผลการจัดฝึกอบรม
        </h1>
        <p className="text-xs md:text-sm text-blue-100/90 mt-1.5 leading-relaxed">
          ความคิดเห็นของท่านมีความสำคัญต่อการพัฒนาเนื้อหาและวิทยากรในครั้งถัดไป (ข้อมูลนิรนาม ไม่ระบุตัวตน)
        </p>

        {/* Progress bar */}
        <div className="w-full bg-white/20 h-2 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-amber-400 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Device has already submitted banner */}
      {isAlreadySubmitted && !submittedData && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-3xl p-5 mb-6 text-amber-900 dark:text-amber-200 shadow-sm flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div className="text-xs flex-1">
            <h4 className="font-bold text-sm">อุปกรณ์นี้ส่งแบบประเมินเรียบร้อยแล้ว</h4>
            <p className="text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
              ระบบป้องกันการตอบซ้ำ เพื่อความเที่ยงตรงของผลสรุปการอบรม หากท่านเป็นผู้จัดหรือต้องการทดสอบซ้ำ สามารถกดรีเซ็ตได้
            </p>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetForTesting}
                className="font-semibold text-blue-600 dark:text-blue-400 underline hover:text-blue-700 flex items-center gap-1"
              >
                <RotateCcw size={13} />
                <span>อนุญาตให้ตอบใหม่อีกครั้ง (โหมดทดสอบ)</span>
              </button>
              {onGoToDashboard && (
                <button
                  type="button"
                  onClick={onGoToDashboard}
                  className="font-semibold text-slate-700 dark:text-slate-300 hover:underline flex items-center gap-1"
                >
                  <span>ดูหน้าจอ Dashboard &rarr;</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Thank you card if just submitted */}
      {submittedData ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            ส่งแบบประเมินสำเร็จแล้ว!
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm mx-auto">
            ขอขอบพระคุณที่สละเวลาให้ข้อมูล ผลการประเมินได้ถูกส่งต่อไปยังจอ Dashboard ของผู้จัดอบรมแบบเรียลไทม์แล้ว
          </p>

          {/* Quick Summary of User's ratings */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 my-6 text-left border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200">
              <span>คะแนนเฉลี่ยที่คุณให้:</span>
              <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">
                {submittedData.averageScore.toFixed(2)} / 5.00 ⭐
              </span>
            </div>
            {EVALUATION_QUESTIONS.map((q) => (
              <div key={q.id} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="truncate pr-2">{q.shortLabel}</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 shrink-0">
                  {submittedData[q.id]} / 5
                </span>
              </div>
            ))}
            {submittedData.feedback && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 italic">
                &ldquo;{submittedData.feedback}&rdquo;
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            {onGoToDashboard && (
              <button
                type="button"
                onClick={onGoToDashboard}
                className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition shadow-md shadow-indigo-500/20"
              >
                <span>ดูผลลัพธ์บนจอ Dashboard</span>
                <ChevronRight size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={handleResetForTesting}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={15} />
              <span>ส่งคำตอบใหม่อีกครั้ง</span>
            </button>
          </div>
        </div>
      ) : (
        /* Evaluation Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {EVALUATION_QUESTIONS.map((question, index) => {
            const currentSelected = scores[question.id];
            return (
              <div
                key={question.id}
                id={`question-card-${question.id}`}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition duration-200 shadow-sm ${
                  currentSelected
                    ? 'border-blue-400 dark:border-blue-600/60 ring-1 ring-blue-400/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Question Title & Subtitle */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      currentSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {question.title.replace(/^\d+\.\s*/, '')}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {question.subtitle}
                    </p>
                  </div>
                </div>

                {/* Likert Scale Buttons (1 to 5) Mobile-Optimized Big Touch Targets */}
                <div className="grid grid-cols-5 gap-1.5 md:gap-2 pt-2">
                  {[...SCALE_LEVELS].reverse().map((level) => {
                    const isSelected = currentSelected === level.score;
                    return (
                      <button
                        key={level.score}
                        type="button"
                        onClick={() => handleSelectScore(question.id, level.score)}
                        className={`flex flex-col items-center justify-center py-3 px-1 rounded-2xl border transition-all duration-150 active:scale-95 ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300 font-bold shadow-md shadow-blue-500/15 scale-102 ring-2 ring-blue-500/30'
                            : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-2xl mb-1 select-none transition transform hover:scale-110">
                          {level.emoji}
                        </span>
                        <span
                          className={`text-sm font-black ${
                            isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {level.score}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap mt-0.5 font-medium">
                          {level.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Feedback Textarea (Optional) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <MessageSquare size={17} className="text-indigo-600 dark:text-indigo-400" />
              <label htmlFor="survey-feedback" className="text-sm font-bold text-slate-900 dark:text-white">
                ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)
              </label>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              สิ่งที่ท่านประทับใจ หรือสิ่งที่ต้องการให้ผู้จัดปรับปรุงในการอบรมรอบถัดไป
            </p>
            <textarea
              id="survey-feedback"
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="พิมพ์ข้อเสนอแนะหรือความประทับใจที่นี่..."
              className="w-full text-xs md:text-sm p-3.5 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 resize-none transition"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 active:scale-[0.98] text-white font-bold text-base shadow-xl shadow-blue-500/25 transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>กำลังส่งข้อมูล...</span>
                </>
              ) : (
                <>
                  <span>ส่งแบบประเมินความพึงพอใจ</span>
                  <Send size={18} />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              🔒 ข้อมูลทั้งหมดจะถูกส่งเข้า Dashboard ทันทีโดยไม่ระบุตัวตนผู้ตอบ
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
