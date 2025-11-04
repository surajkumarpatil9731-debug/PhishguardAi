
export enum RiskLevel {
  Safe = 'Safe',
  Suspicious = 'Suspicious',
  Malicious = 'Malicious',
}

export interface DetectedTactic {
  tactic: string;
  description: string;
  detected: boolean;
}

export interface IOCs {
  urls: string[];
  emails: string[];
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  score: number;
  reason: string;
  tactics: DetectedTactic[];
  iocs: IOCs;
  recommendation: string;
}
