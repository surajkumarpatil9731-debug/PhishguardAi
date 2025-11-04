
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BarChartData {
  name: string;
  count: number;
  fill: string;
}

interface RiskBarChartProps {
  data: BarChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-2 border border-slate-600 rounded-md shadow-lg">
          <p className="label text-slate-200">{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  

const RiskBarChart: React.FC<RiskBarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
        <YAxis allowDecimals={false} tick={{ fill: '#94a3b8' }} />
        <Tooltip cursor={{fill: 'rgba(71, 85, 105, 0.5)'}} content={<CustomTooltip />} />
        <Bar dataKey="count">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RiskBarChart;
