
import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import RiskGauge from './RiskGauge';

interface ResultDisplayProps {
  result: AnalysisResult;
}

const riskStyles: { [key in RiskLevel]: { badge: string; text: string; border: string } } = {
  [RiskLevel.Safe]: {
    badge: 'bg-green-500/20 text-green-400 border-green-500/30',
    text: 'text-green-400',
    border: 'border-green-500/50',
  },
  [RiskLevel.Suspicious]: {
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    text: 'text-amber-400',
    border: 'border-amber-500/50',
  },
  [RiskLevel.Malicious]: {
    badge: 'bg-red-500/20 text-red-400 border-red-500/30',
    text: 'text-red-400',
    border: 'border-red-500/50',
  },
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const styles = riskStyles[result.riskLevel];

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border ${styles.border}`}>
      <h2 className="text-2xl font-bold text-white mb-4">Analysis Result</h2>
      <div className="grid md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-1 flex flex-col items-center justify-center">
          <RiskGauge score={result.score} />
          <div className={`mt-2 py-1 px-4 rounded-full text-lg font-semibold ${styles.badge}`}>
            {result.riskLevel}
          </div>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-slate-300">Reasoning</h3>
          <p className="mt-1 text-slate-300 bg-slate-900/50 p-4 rounded-md border border-slate-700">
            {result.reason}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
