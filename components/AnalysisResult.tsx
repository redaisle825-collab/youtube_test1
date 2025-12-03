import React from 'react';
import { ScriptAnalysis } from '../types';
import { Microscope, Zap, Music } from 'lucide-react';

interface AnalysisResultProps {
  analysis: ScriptAnalysis;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 mb-8 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-indigo-400 mb-4 flex items-center gap-2">
        <Microscope className="w-5 h-5" />
        분석 리포트: 왜 이 영상이 떴을까?
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            후킹 전략
          </h4>
          <p className="text-slate-200 text-sm leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
            {analysis.hookStrategy}
          </p>
        </div>

        <div>
           <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-2">
            <Music className="w-4 h-4 text-pink-400" />
            톤앤매너
          </h4>
          <p className="text-slate-200 text-sm leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
            {analysis.tone}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">구조적 특징</h4>
        <ul className="space-y-2">
          {analysis.structuralAnalysis.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-indigo-500 mt-1">•</span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};