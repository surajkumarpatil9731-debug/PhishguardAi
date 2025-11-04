
import React, { useMemo } from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import RiskPieChart from './RiskPieChart';
import RiskBarChart from './RiskBarChart';

interface DashboardProps {
  analysisHistory: AnalysisResult[];
}

const Dashboard: React.FC<DashboardProps> = ({ analysisHistory }) => {
  const chartData = useMemo(() => {
    const counts = {
      [RiskLevel.Safe]: 0,
      [RiskLevel.Suspicious]: 0,
      [RiskLevel.Malicious]: 0,
    };

    analysisHistory.forEach(item => {
      counts[item.riskLevel]++;
    });

    const pieData = [
      { name: 'Safe', value: counts.Safe, fill: '#22c55e' },
      { name: 'Suspicious', value: counts.Suspicious, fill: '#f59e0b' },
      { name: 'Malicious', value: counts.Malicious, fill: '#ef4444' },
    ].filter(d => d.value > 0);

    const barData = [
      { name: 'Safe', count: counts.Safe, fill: '#22c55e' },
      { name: 'Suspicious', count: counts.Suspicious, fill: '#f59e0b' },
      { name: 'Malicious', count: counts.Malicious, fill: '#ef4444' },
    ];

    return { pieData, barData };
  }, [analysisHistory]);

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Analysis History</h2>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="w-full h-64 md:h-80">
          <h3 className="text-lg font-semibold text-slate-300 text-center mb-2">Risk Distribution</h3>
          <RiskPieChart data={chartData.pieData} />
        </div>
        <div className="w-full h-64 md:h-80">
            <h3 className="text-lg font-semibold text-slate-300 text-center mb-2">Risk Category Count</h3>
          <RiskBarChart data={chartData.barData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
