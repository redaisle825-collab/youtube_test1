import React, { useState } from 'react';
import { Wand2, Youtube, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { analyzeScript, generateFinalScript } from './services/geminiService';
import { AnalysisResponse, GeneratedContent, LoadingState, AppStep } from './types';
import { AnalysisResult } from './components/AnalysisResult';
import { ScriptOutput } from './components/ScriptOutput';
import { LoadingView } from './components/LoadingView';
import { TopicSelector } from './components/TopicSelector';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [originalScript, setOriginalScript] = useState('');
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [finalResult, setFinalResult] = useState<GeneratedContent | null>(null);
  
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Analyze Script
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalScript.trim()) return;

    setLoadingState(LoadingState.ANALYZING);
    setError(null);
    
    try {
      const data = await analyzeScript(originalScript);
      setAnalysisData(data);
      setStep(AppStep.SELECTION);
      setLoadingState(LoadingState.IDLE);
    } catch (err) {
      setError("대본 분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  // Step 2: Generate Script with Selected Topic
  const handleGenerate = async (topic: string) => {
    if (!originalScript || !topic) return;

    setLoadingState(LoadingState.GENERATING);
    setError(null);

    try {
      const data = await generateFinalScript(originalScript, topic);
      setFinalResult(data);
      setStep(AppStep.RESULT);
      setLoadingState(LoadingState.COMPLETE);
    } catch (err) {
      setError("스크립트 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleReset = () => {
    setOriginalScript('');
    setAnalysisData(null);
    setFinalResult(null);
    setStep(AppStep.INPUT);
    setLoadingState(LoadingState.IDLE);
  };

  const handleBackToInput = () => {
    setStep(AppStep.INPUT);
    setAnalysisData(null);
    setLoadingState(LoadingState.IDLE);
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 font-sans">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            onClick={handleReset}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-lg">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">ViralScript AI</h1>
          </div>
          <div className="text-xs font-medium px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
            {step === AppStep.INPUT && 'Step 1. 대본 입력'}
            {step === AppStep.SELECTION && 'Step 2. 주제 선택'}
            {step === AppStep.RESULT && 'Step 3. 완성'}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Error Display */}
        {loadingState === LoadingState.ERROR && (
           <div className="mb-6 flex items-center gap-3 p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-400 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-sm underline hover:text-red-300">닫기</button>
           </div>
        )}

        {/* STEP 1: INPUT VIEW */}
        {step === AppStep.INPUT && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                떡상 영상 복제기
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                성공한 유튜브 영상의 대본을 붙여넣으세요. <br/>
                구조를 완벽하게 분석하여 새로운 대본으로 재탄생시킵니다.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
               {loadingState === LoadingState.ANALYZING ? (
                 <LoadingView 
                    message="대본 구조 분석 중..." 
                    subMessage="영상 대본의 DNA를 추출하고 어울리는 주제를 찾고 있습니다." 
                  />
               ) : (
                <form onSubmit={handleAnalyze} className="space-y-6 relative z-10">
                  <div>
                    <label htmlFor="original" className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                      <Youtube className="w-4 h-4 text-red-500" />
                      원본 떡상 영상 대본
                    </label>
                    <textarea
                      id="original"
                      value={originalScript}
                      onChange={(e) => setOriginalScript(e.target.value)}
                      placeholder="영상 시작('안녕하세요')부터 끝('구독 좋아요')까지 전체 내용을 붙여넣어주세요..."
                      className="w-full h-80 bg-slate-950 border border-slate-700 rounded-xl p-5 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all text-base leading-relaxed"
                      required
                    />
                    <div className="flex justify-between items-center mt-2">
                       <p className="text-xs text-slate-500">
                        {originalScript.length > 0 ? `${originalScript.length}자 입력됨` : '최소 200자 이상 권장'}
                       </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!originalScript.trim()}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-lg"
                  >
                    <Wand2 className="w-5 h-5" />
                    구조 분석하고 주제 추천받기
                  </button>
                </form>
               )}
            </div>
            
             <div className="flex gap-4 justify-center">
                 <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    무료 사용
                 </div>
                 <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Gemini AI 엔진
                 </div>
             </div>
          </div>
        )}

        {/* STEP 2: SELECTION VIEW */}
        {step === AppStep.SELECTION && analysisData && (
          <div className="grid lg:grid-cols-12 gap-8 items-start animate-in slide-in-from-right-8 duration-500">
             {/* Left: Analysis */}
             <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <button 
                    onClick={handleBackToInput} 
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    다시 입력하기
                  </button>
                  <span className="text-indigo-400 text-sm font-semibold">분석 완료</span>
                </div>
                
                <AnalysisResult analysis={analysisData.analysis} />
                
                <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-800 text-sm text-slate-400">
                   <p>💡 이 대본은 <strong>{analysisData.analysis.tone}</strong> 톤과 <strong>{analysisData.analysis.structuralAnalysis.length}단계</strong>의 명확한 구조를 가지고 있습니다. 오른쪽에서 주제를 선택하면 이 형식을 그대로 적용해드립니다.</p>
                </div>
             </div>

             {/* Right: Topic Selection */}
             <div className="lg:col-span-5 relative">
                <div className="sticky top-24 bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                   {loadingState === LoadingState.GENERATING ? (
                      <LoadingView 
                        message="새로운 대본 작성 중..." 
                        subMessage="선택하신 주제로 원본의 호흡을 살려 다시 쓰는 중입니다." 
                      />
                   ) : (
                      <TopicSelector 
                        suggestions={analysisData.suggestedTopics} 
                        onSelect={handleGenerate} 
                        isLoading={loadingState === LoadingState.GENERATING}
                      />
                   )}
                </div>
             </div>
          </div>
        )}

        {/* STEP 3: RESULT VIEW */}
        {step === AppStep.RESULT && finalResult && (
           <div className="animate-in zoom-in-95 duration-500">
              <div className="mb-6 flex justify-between items-center">
                 <button 
                    onClick={() => setStep(AppStep.SELECTION)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-slate-900"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    다른 주제로 다시 만들기
                 </button>
                 <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors px-4 py-2 rounded-lg hover:bg-indigo-950/30"
                  >
                    <RefreshCw className="w-4 h-4" />
                    처음부터 다시하기
                 </button>
              </div>

              <ScriptOutput title={finalResult.title} content={finalResult.script} />
           </div>
        )}
      </main>
    </div>
  );
};

export default App;