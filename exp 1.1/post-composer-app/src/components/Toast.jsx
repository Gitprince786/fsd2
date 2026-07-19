import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

/**
 * Single Toast Item with auto-dismiss timer.
 */
export function ToastItem({ toast, onRemove }) {
  const { id, message, type, duration = 3000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);

    return () => {
      clearTimeout(timer); // Clean up to prevent memory leaks / stale closure bugs
    };
  }, [id, duration, onRemove]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  const borderColors = {
    success: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-100 shadow-emerald-950/20',
    error: 'border-rose-500/30 bg-rose-950/40 text-rose-100 shadow-rose-950/20',
    warning: 'border-amber-500/30 bg-amber-950/40 text-amber-100 shadow-amber-950/20',
    info: 'border-blue-500/30 bg-blue-950/40 text-blue-100 shadow-blue-950/20'
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 transform translate-y-0 animate-fade-in-slide ${
        borderColors[type] || borderColors.info
      }`}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1 text-sm font-medium pr-2">{message}</div>
      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 text-white/50 hover:text-white transition-colors focus:outline-none"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Toast Container displaying list of active alerts.
 */
export function ToastContainer({ toasts, onRemoveToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemoveToast} />
        ))}
      </div>
    </div>
  );
}
