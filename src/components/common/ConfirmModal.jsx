import React from 'react';
import { useScreenFlow } from '../../context/ScreenFlowContext';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal() {
  const { confirmModal, setConfirmModal } = useScreenFlow();

  if (!confirmModal.isOpen) return null;

  const handleConfirm = () => {
    if (confirmModal.onConfirm) {
      confirmModal.onConfirm();
    }
    setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#161c27] border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">{confirmModal.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{confirmModal.message}</p>
            </div>
          </div>
          <button
            onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all active:scale-95"
          >
            Confirm Action
          </button>
        </div>
      </div>
    </div>
  );
}
