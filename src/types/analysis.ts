export type ThreatLevel = 'Minimal' | 'Low' | 'Medium' | 'High' | 'Critical';

export interface AnalysisFinding {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface AnalysisResult {
  id: string;
  type: 'email' | 'url' | 'audio' | 'prompt' | 'agent';
  riskScore: number;
  threatLevel: ThreatLevel;
  findings: AnalysisFinding[];
  explanation: string;
  confidenceScore: number;
  timestamp: string;
}
