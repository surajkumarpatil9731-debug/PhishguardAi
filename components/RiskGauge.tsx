
import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { RiskLevel } from '../types';

interface RiskGaugeProps {
  score: number;
}

const getScoreColor = (score: number) => {
  if (score < 40) return '#22c55e'; // Safe - green-500
  if (score < 75) return '#f59e0b'; // Suspicious - amber-500
  return '#ef4444'; // Malicious - red-500
};

const RiskGauge: React.FC<RiskGaugeProps> = ({ score }) => {
  const color = getScoreColor(score);
  const data = [{ name: 'score', value: score, fill: color }];

  return (
    <div className="w-40 h-40 relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="90%"
          data={data}
          startAngle={180}
          endAngle={0}
          barSize={20}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
            className="fill-slate-700"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="text-sm text-slate-400">Risk Score</span>
      </div>
    </div>
  );
};

export default RiskGauge;
