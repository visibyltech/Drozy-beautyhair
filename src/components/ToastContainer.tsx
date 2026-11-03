import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, Sparkles, MessageSquare, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-[#D4AF37]/30 bg-[#141417]/95 backdrop-blur-md shadow-2xl text-[#FAF7F2] transition-all transform animate-in slide-in-from-bottom-3"
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'gold' && <Sparkles className="w-5 h-5 text-[#D4AF37]" />}
            {toast.type === 'whatsapp' && <MessageSquare className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#E8A598]" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-[#FAF7F2]">{toast.title}</h4>
            <p className="text-xs text-[#9E9AA6] mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#9E9AA6] hover:text-[#FAF7F2] p-1 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
