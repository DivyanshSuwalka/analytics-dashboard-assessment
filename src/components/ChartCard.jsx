import React from 'react';
import { motion } from 'framer-motion';

const ChartCard = ({ title, children, className = "", subtitle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] flex flex-col ${className}`}
        >
            <div className="mb-6 flex flex-col gap-1">
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-brand-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                    {title}
                </h3>
                {subtitle && <p className="text-slate-500 text-xs font-medium ml-4">{subtitle}</p>}
            </div>
            <div className="flex-1 w-full min-h-[300px]">
                {children}
            </div>
        </motion.div>
    );
};

export default ChartCard;
