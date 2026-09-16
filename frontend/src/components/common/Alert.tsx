import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export interface AlertProps {
  type?: 'error' | 'success' | 'info';
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'error',
  message,
  onClose,
  className = '',
}) => {
  const typeStyles = {
    error: 'bg-red-500/10 border-red-500/30 text-red-300',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm animate-fadeIn transition-all ${typeStyles[type]} ${className}`}
      role="alert"
    >
      {icons[type]}
      <div className="flex-1 leading-snug">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-0.5 text-slate-400 hover:text-slate-200 transition-colors shrink-0 rounded"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
