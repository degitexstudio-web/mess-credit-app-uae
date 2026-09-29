import React from 'react';
import { useMess } from '../../context/MessContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function ToastNotifications() {
  const { toastMessage } = useMess();

  if (!toastMessage) return null;

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-emerald-500/10',
    error: 'bg-rose-50 border-rose-300 text-rose-900 shadow-rose-500/10',
    info: 'bg-blue-50 border-blue-300 text-blue-900 shadow-blue-500/10',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
  };

  return (
    <div className="fixed top-5 right-5 z-50 animate-fade-in transition-all">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium ${
          bgColors[toastMessage.type] || bgColors.success
        }`}
      >
        {icons[toastMessage.type] || icons.success}
        <span>{toastMessage.message}</span>
      </div>
    </div>
  );
}
