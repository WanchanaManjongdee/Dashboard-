/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { CodeExportView } from './components/CodeExportView';
import { QrModal } from './components/QrModal';
import { FirebaseConfigModal } from './components/FirebaseConfigModal';
import {
  getLocalResponses,
  subscribeToUpdates,
  seedSampleData,
  clearAllResponses,
  syncFromFirebase,
  getStoredFirebaseConfig,
} from './services/storage';
import { SurveyResponse } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'survey' | 'dashboard' | 'code'>('dashboard');
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isFirebaseOpen, setIsFirebaseOpen] = useState(false);
  const [surveyUrl, setSurveyUrl] = useState('');

  // Read URL query params on mount to support direct links (e.g. ?view=survey)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'survey' || viewParam === 'dashboard' || viewParam === 'code') {
        setCurrentTab(viewParam);
      }

      // Build survey link for QR code
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      setSurveyUrl(`${origin}${pathname}?view=survey`);
    }
  }, []);

  // Load and subscribe to data changes
  const reloadData = () => {
    let data = getLocalResponses();
    if (data.length === 0) {
      // Seed initial realistic data for preview presentation
      data = seedSampleData();
    }
    setResponses(data);
  };

  useEffect(() => {
    reloadData();

    // Subscribe to multi-tab BroadcastChannel & storage events
    const unsubscribe = subscribeToUpdates(() => {
      reloadData();
    });

    // If Firebase RTDB configured, do an initial sync and periodic poll
    const fbConfig = getStoredFirebaseConfig();
    if (fbConfig?.databaseUrl) {
      syncFromFirebase().then((remoteData) => {
        if (remoteData) setResponses(remoteData);
      });

      const interval = setInterval(() => {
        syncFromFirebase().then((remoteData) => {
          if (remoteData) setResponses(remoteData);
        });
      }, 5000);

      return () => {
        unsubscribe();
        clearInterval(interval);
      };
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSelectTab = (tab: 'survey' | 'dashboard' | 'code') => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('view', tab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleSeedDemo = () => {
    const updated = seedSampleData();
    setResponses([...updated]);
  };

  const handleClearData = () => {
    if (window.confirm('คุณต้องการล้างข้อมูลคำตอบทั้งหมดใช่หรือไม่? (สามารถกดจำลองข้อมูลกลับมาใหม่ได้ทุกเมื่อ)')) {
      clearAllResponses();
      setResponses([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenQr={() => setIsQrOpen(true)}
        onOpenFirebase={() => setIsFirebaseOpen(true)}
        onSeedDemo={handleSeedDemo}
        onClearData={handleClearData}
        responseCount={responses.length}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentTab === 'survey' && (
          <SurveyView
            onGoToDashboard={() => handleSelectTab('dashboard')}
            onOpenQr={() => setIsQrOpen(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            responses={responses}
            onOpenQrModal={() => setIsQrOpen(true)}
            surveyUrl={surveyUrl}
          />
        )}

        {currentTab === 'code' && <CodeExportView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>ระบบแบบประเมินความพึงพอใจการอบรม & Real-time Live Projector Dashboard</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleSelectTab('code')}
              className="hover:underline text-blue-600 dark:text-blue-400 font-medium"
            >
              ดูโค้ด survey.html & dashboard.html
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              onClick={() => setIsFirebaseOpen(true)}
              className="hover:underline text-amber-600 dark:text-amber-400 font-medium"
            >
              ตั้งค่า Firebase
            </button>
          </div>
        </div>
      </footer>

      {/* QR Code Modal */}
      <QrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        surveyUrl={surveyUrl}
      />

      {/* Firebase Configuration Modal */}
      <FirebaseConfigModal
        isOpen={isFirebaseOpen}
        onClose={() => setIsFirebaseOpen(false)}
        onSaved={reloadData}
      />
    </div>
  );
}
