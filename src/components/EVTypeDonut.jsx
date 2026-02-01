import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const EVTypeDonut = ({ data }) => {
    const COLORS = ['#3b82f6', '#10b981'];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '16px',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)'
                    }}
                />
                <Legend verticalAlign="bottom" align="center" iconType="circle" />
                <Pie
                    data={data}
                    cx="50%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1500}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                    ))}
                </Pie>
                <text
                    x="50%"
                    y="45%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-2xl font-black"
                >
                    {data.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
                </text>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default EVTypeDonut;
