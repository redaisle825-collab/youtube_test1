import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';

interface TopicSelectorProps {
  suggestions: string[];
  onSelect: (topic: string) => void;
  isLoading: boolean;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ suggestions, onSelect, isLoading }) => {
  const [customTopic, setCustomTopic] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      onSelect(customTopic);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">이 구조에 딱 맞는 추천 주제</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((topic, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(topic)}
            disabled={isLoading}
            className="group relative flex flex-col items-start p-5 bg-slate-900/80 border border-slate-700 hover:border-indigo-500 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/10 text-left w-full"
          >
            <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-400 mb-2 transition-colors">
              OPTION {idx + 1}
            </span>
            <span className="text-slate-200 font-medium group-hover:text-white transition-colors">
              {topic}
            </span>
            <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
               <ArrowRight className="w-4 h-4 text-indigo-400" />
            </div>
          </button>
        ))}
      </div>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-slate-800"></div>
        <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">또는 직접 입력하기</span>
        <div className="flex-grow border-t border-slate-800"></div>
      </div>

      <form onSubmit={handleCustomSubmit} className="relative">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl opacity-30 group-hover:opacity-100 transition duration-500 blur"></div>
          <div className="relative flex items-center bg-slate-950 rounded-xl p-1">
             <div className="pl-4">
                <Lightbulb className="w-5 h-5 text-slate-400" />
             </div>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="원하는 다른 주제가 있다면 입력해주세요..."
              disabled={isLoading}
              className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 px-4 py-3"
            />
            <button
              type="submit"
              disabled={!customTopic.trim() || isLoading}
              className="bg-slate-800 hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-slate-800 text-white p-2.5 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};