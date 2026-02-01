import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

const CustomizedContent = (props) => {
    const { x, y, width, height, index, name } = props;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: '#3b82f6',
                    fillOpacity: 0.5 + (index % 5) * 0.1,
                    stroke: '#fff',
                    strokeWidth: 1,
                    strokeOpacity: 0.1,
                }}
            />
            {width > 50 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontSize={10}
                    fontWeight="bold"
                >
                    {name}
                </text>
            )}
        </g>
    );
};

const TopModelsTreemap = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <Treemap
                data={data}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
                content={<CustomizedContent />}
            >
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px'
                    }}
                />
            </Treemap>
        </ResponsiveContainer>
    );
};

export default TopModelsTreemap;
