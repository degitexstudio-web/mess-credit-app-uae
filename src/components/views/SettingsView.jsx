import React, { useRef, useState } from 'react';
import { useMess } from '../../context/MessContext';
import { Settings, Download, Upload, RotateCcw, Database, Globe, Flame, Check, Save } from 'lucide-react';

export default function SettingsView() {
  const {
    exportBackup,
    importBackup,
    resetDefaults,
    customers,
    dailyLogs,
    payments,
    isFirebaseConnected,
    getFirebaseConfig,
    saveFirebaseConfig,
    showToast,
  } = useMess();

  const fileInputRef = useRef(null);

  const initialConfig = getFirebaseConfig();
  const [apiKey, setApiKey] = useState(initialConfig.apiKey || '');
  const [authDomain, setAuthDomain] = useState(initialConfig.authDomain || '');
  const [projectId, setProjectId] = useState(initialConfig.projectId || '');
  const [storageBucket, setStorageBucket] = useState(initialConfig.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(initialConfig.messagingSenderId || '');
  const [appId, setAppId] = useState(initialConfig.appId || '');

  const handleDownloadBackup = () => {
    const backup = exportBackup();
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mess_Credit_UAE_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        importBackup(data);
      } catch (err) {
        alert('Failed to parse backup JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleSaveFirebaseKeys = (e) => {
    e.preventDefault();
    const config = {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    };

    const res = saveFirebaseConfig(config);
    if (res.success) {
      showToast('Firebase connected successfully! Real-time Cloud Sync active.', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Settings & Firebase Cloud Sync
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect to Firebase Cloud Firestore for real-time multi-device sync
            </p>
          </div>
        </div>
      </div>

      {/* Firebase Cloud Firestore Integration Card */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-600" />
            Firebase Cloud Firestore Integration
          </h3>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              isFirebaseConnected
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {isFirebaseConnected ? '🔥 Firebase Cloud Connected' : '📱 Offline / LocalStorage Mode'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Connect your app to <strong>Firebase Cloud Firestore</strong> to enable instant multi-device sync across all mobile phones, tablets, and PCs.
        </p>

        {/* Firebase Config Form */}
        <form onSubmit={handleSaveFirebaseKeys} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Firebase Console Keys Configuration:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">API Key</label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 font-mono outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Project ID</label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="my-mess-app-123"
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 font-mono outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Auth Domain</label>
              <input
                type="text"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                placeholder="my-mess-app.firebaseapp.com"
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 font-mono outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">App ID</label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="1:123456789:web:abcdef"
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 font-mono outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              Save Firebase Keys & Connect
            </button>
          </div>
        </form>
      </div>

      {/* Region Card */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Globe className="w-5 h-5 text-amber-600" />
          Regional & UI Settings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-inner">
            <span className="text-slate-500 font-bold block mb-1">Theme Mode</span>
            <span className="text-slate-900 font-bold text-sm">Light Mode ☀️</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-inner">
            <span className="text-slate-500 font-bold block mb-1">Currency</span>
            <span className="text-slate-900 font-bold text-sm">United Arab Emirates Dirham (AED)</span>
          </div>
        </div>
      </div>

      {/* Data Stats Card */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-600" />
          Database Records Count
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
            <p className="text-slate-500 font-bold">Stored Customers</p>
            <p className="text-xl font-bold font-mono text-slate-900 mt-1">{customers.length}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
            <p className="text-slate-500 font-bold">Total Meal Logs</p>
            <p className="text-xl font-bold font-mono text-amber-700 mt-1">{dailyLogs.length}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
            <p className="text-slate-500 font-bold">Total Payments Recorded</p>
            <p className="text-xl font-bold font-mono text-emerald-600 mt-1">{payments.length}</p>
          </div>
        </div>
      </div>

      {/* Backup & Restore Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600" />
            Export Data Backup
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Download a full JSON backup file containing all your customer records, daily logs, payment history, and menu items.
          </p>
          <button
            onClick={handleDownloadBackup}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
          >
            <Download className="w-4 h-4" />
            Download JSON Backup File
          </button>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-600" />
            Restore Data Backup
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Upload a previously exported JSON backup file to restore your database onto this device.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
          >
            <Upload className="w-4 h-4" />
            Select JSON File to Restore
          </button>
        </div>
      </div>

      {/* Reset Defaults */}
      <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl space-y-3 shadow-sm">
        <h3 className="font-bold text-rose-800 text-base flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-rose-600" />
          Reset to Sample Data
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Need a fresh start or want to test with UAE sample data? This action resets the application state back to default sample customer records.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all data back to default UAE sample records?')) {
              resetDefaults();
            }
          }}
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-rose-600/20"
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
}
