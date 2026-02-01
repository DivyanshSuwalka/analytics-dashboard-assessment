import React from 'react';
import { motion } from 'framer-motion';

const KPICard = ({ title, value, icon: Icon, description, trend }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl flex flex-col justify-between h-full group hover:border-brand-500/30 transition-all duration-300"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-brand-500/10 rounded-2xl border border-brand-500/20">
                    <Icon className="w-6 h-6 text-brand-400" />
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>

            <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-extrabold text-white tracking-tighter">{value}</h3>
                {description && <p className="text-slate-500 text-[10px] mt-2 font-medium">{description}</p>}
            </div>
        </motion.div>
    );
};

export default KPICard;
