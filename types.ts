export interface ScriptAnalysis {
  structuralAnalysis: string[];
  tone: string;
  hookStrategy: string;
}

export interface AnalysisResponse {
  analysis: ScriptAnalysis;
  suggestedTopics: string[];
}

export interface GeneratedContent {
  title: string;
  script: string;
  analysis?: ScriptAnalysis;
}

export enum LoadingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export enum AppStep {
  INPUT = 'INPUT',
  SELECTION = 'SELECTION',
  RESULT = 'RESULT'
}