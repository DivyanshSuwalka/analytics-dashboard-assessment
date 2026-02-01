import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';

const PriceRangeScatter = ({ data }) => {
    // Filter out data with 0 range or 0 MSRP for a better visualization
    const plotData = data
        .filter(d => d['Electric Range'] > 0 && d['Base MSRP'] > 0)
        .slice(0, 1000); // Sample for performance

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                <XAxis
                    type="number"
                    dataKey="Base MSRP"
                    name="MSRP"
                    unit="$"
                    stroke="#64748b"
                    fontSize={10}
                />
                <YAxis
                    type="number"
                    dataKey="Electric Range"
                    name="Range"
                    unit="mi"
                    stroke="#64748b"
                    fontSize={10}
                />
                <ZAxis type="number" range={[50, 400]} />
                <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Scatter
                    name="Vehicles"
                    data={plotData}
                    fill="#3b82f6"
                    fillOpacity={0.6}
                />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default PriceRangeScatter;
