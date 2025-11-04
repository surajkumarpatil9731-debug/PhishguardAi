
export enum RiskLevel {
  Safe = 'Safe',
  Suspicious = 'Suspicious',
  Malicious = 'Malicious',
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  score: number;
  reason: string;
}
