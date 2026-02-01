import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const EVGrowthChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="growthBev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="growthPhev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)'
                    }}
                    itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                />
                <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}
                />
                <Area
                    name="BEV"
                    type="monotone"
                    dataKey="bev"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#growthBev)"
                    strokeWidth={4}
                    animationDuration={1500}
                />
                <Area
                    name="PHEV"
                    type="monotone"
                    dataKey="phev"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#growthPhev)"
                    strokeWidth={4}
                    animationDuration={2000}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default EVGrowthChart;
