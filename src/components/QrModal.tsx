import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Copy, Check, Download, ExternalLink, X } from 'lucide-react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl: string;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose, surveyUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, surveyUrl, {
        width: 260,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      }, (err) => {
        if (err) console.error(err);
      });
    }
  }, [isOpen, surveyUrl]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'training-evaluation-qrcode.png';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <QrCode size={26} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">QR Code แบบประเมิน</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ให้ผู้เข้าร่วมอบรมสแกนด้วยสมาร์ตโฟนเพื่อตอบแบบสอบถามได้ทันที
          </p>

          <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-indigo-200 dark:border-slate-700 inline-block my-5 shadow-sm">
            <canvas ref={canvasRef} className="mx-auto block" />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-left mb-5">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">ลิงก์แบบประเมิน:</div>
            <div className="text-xs font-mono text-blue-600 dark:text-blue-400 break-all select-all">
              {surveyUrl}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleCopy}
              className="py-2.5 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="py-2.5 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white transition shadow-md shadow-blue-500/20"
            >
              <Download size={16} />
              <span>ดาวน์โหลดรูป QR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
