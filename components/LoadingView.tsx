import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingViewProps {
  message?: string;
  subMessage?: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ 
  message = "분석 중...", 
  subMessage = "잠시만 기다려주세요." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800 animate-in fade-in zoom-in duration-300">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
        <Loader2 className="w-12 h-12 text-indigo-400 animate-spin relative z-10" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-white">{message}</h3>
      <p className="mt-2 text-slate-400 max-w-sm">
        {subMessage}
      </p>
    </div>
  );
};