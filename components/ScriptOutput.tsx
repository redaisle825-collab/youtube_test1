import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, FileText } from 'lucide-react';

interface ScriptOutputProps {
  title: string;
  content: string;
}

export const ScriptOutput: React.FC<ScriptOutputProps> = ({ title, content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`# ${title}\n\n${content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-500" />
          완성된 대본
        </h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          {copied ? '복사됨' : '전체 복사'}
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex-1 shadow-2xl">
        <div className="p-6 bg-indigo-900/20 border-b border-indigo-500/30">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1 block">추천 제목</span>
            <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
              {title}
            </h1>
        </div>
        <div className="p-6 md:p-8 overflow-y-auto max-h-[600px] prose prose-invert prose-slate max-w-none">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-indigo-200 mb-4 mt-6" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-indigo-300 mb-3 mt-5" {...props} />,
              p: ({node, ...props}) => <p className="text-slate-300 leading-7 mb-4 whitespace-pre-line" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 text-slate-300" {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />,
              strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-4 bg-slate-800/50 rounded-r italic text-slate-400" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};