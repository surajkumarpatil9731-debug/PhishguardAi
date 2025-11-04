
import React from 'react';
import { AnalysisResult, RiskLevel, DetectedTactic, IOCs } from '../types';
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

const AlertTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
  );
  
const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  );
  
const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
  );
  
  
const TacticDisplay: React.FC<{ tactic: DetectedTactic }> = ({ tactic }) => {
      return (
          <div className={`flex items-start p-3 rounded-lg ${tactic.detected ? 'bg-slate-700/50' : 'bg-slate-800/30'}`}>
              {tactic.detected ? (
                   <AlertTriangleIcon className="w-6 h-6 mr-3 flex-shrink-0 text-amber-400" />
              ) : (
                  <CheckCircleIcon className="w-6 h-6 mr-3 flex-shrink-0 text-slate-500" />
              )}
              <div>
                  <h4 className={`font-semibold ${tactic.detected ? 'text-slate-200' : 'text-slate-400'}`}>{tactic.tactic}</h4>
                  <p className="text-sm text-slate-400">{tactic.description}</p>
              </div>
          </div>
      );
  };
  
const IOCDisplay: React.FC<{ iocs: IOCs }> = ({ iocs }) => {
      const hasIocs = iocs.urls.length > 0 || iocs.emails.length > 0;
  
      if (!hasIocs) {
          return null;
      }
  
      return (
          <div>
              <h3 className="text-xl font-semibold text-slate-300 mb-3">Extracted Indicators</h3>
              <div className="space-y-3">
              {iocs.urls.length > 0 && (
                  <div>
                      <h4 className="font-semibold text-slate-400">URLs:</h4>
                      {iocs.urls.map((url, index) => (
                          <code key={index} className="block bg-slate-900 p-2 rounded-md text-cyan-300 text-sm mt-1 break-all">{url}</code>
                      ))}
                  </div>
              )}
              {iocs.emails.length > 0 && (
                   <div>
                      <h4 className="font-semibold text-slate-400">Emails:</h4>
                      {iocs.emails.map((email, index) => (
                          <code key={index} className="block bg-slate-900 p-2 rounded-md text-cyan-300 text-sm mt-1 break-all">{email}</code>
                      ))}
                  </div>
              )}
              </div>
          </div>
      );
  };

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const styles = riskStyles[result.riskLevel];
  const detectedTactics = result.tactics.filter(t => t.detected);
  const notDetectedTactics = result.tactics.filter(t => !t.detected);

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border ${styles.border}`}>
      <h2 className="text-2xl font-bold text-white mb-6">Threat Analysis Report</h2>

      {/* Summary Section */}
      <div className="grid md:grid-cols-3 gap-6 items-center border-b border-slate-700 pb-6 mb-6">
        <div className="md:col-span-1 flex flex-col items-center justify-center">
          <RiskGauge score={result.score} />
          <div className={`mt-2 py-1 px-4 rounded-full text-lg font-semibold ${styles.badge}`}>
            {result.riskLevel}
          </div>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-slate-300">Summary</h3>
          <p className="mt-1 text-slate-300 bg-slate-900/50 p-4 rounded-md border border-slate-700">
            {result.reason}
          </p>
        </div>
      </div>

      {/* Details Section */}
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Tactics Section */}
        <div>
            <h3 className="text-xl font-semibold text-slate-300 mb-3">Threat Tactics Detected</h3>
            <div className="space-y-2">
                {detectedTactics.map((tactic, index) => <TacticDisplay key={index} tactic={tactic} />)}
                {detectedTactics.length === 0 && <p className="text-slate-400">No specific phishing tactics were detected.</p>}
            </div>
            {notDetectedTactics.length > 0 && (
                <>
                    <h4 className="text-lg font-semibold text-slate-500 mt-4 mb-3">Checks Passed</h4>
                     <div className="space-y-2">
                        {notDetectedTactics.map((tactic, index) => <TacticDisplay key={index} tactic={tactic} />)}
                     </div>
                </>
            )}
        </div>

        {/* IOCs and Recommendation */}
        <div className="space-y-6">
            <IOCDisplay iocs={result.iocs} />

            {/* Recommendation Section */}
            <div>
                <h3 className="text-xl font-semibold text-slate-300 mb-3">Recommended Action</h3>
                <div className="bg-cyan-900/50 border border-cyan-700 p-4 rounded-lg flex items-start">
                    <LightbulbIcon className="w-6 h-6 mr-3 flex-shrink-0 text-cyan-400" />
                    <p className="text-cyan-200">{result.recommendation}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
