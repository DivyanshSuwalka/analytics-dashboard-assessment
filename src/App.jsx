import React, { useState, useMemo } from 'react';
import {
    Zap,
    Car,
    Calendar,
    Globe,
    Gauge,
    Landmark,
    ShieldCheck,
    BarChart3,
    Search,
    Filter,
    ChevronDown,
    Map as MapIcon,
    Table as TableIcon,
    PieChart as PieIcon,
    TrendingUp
} from 'lucide-react';
import { useEVData } from './hooks/useEVData';
import KPICard from './components/KPICard';
import ChartCard from './components/ChartCard';
import EVGrowthChart from './components/EVGrowthChart';
import EVTypeDonut from './components/EVTypeDonut';
import DataTable from './components/DataTable';
import EVDistributionMap from './components/EVDistributionMap';
import ManufacturersBar from './components/ManufacturersBar';
import RangeByYearLine from './components/RangeByYearLine';
import RangeDistributionHistogram from './components/RangeDistributionHistogram';
import TopModelsTreemap from './components/TopModelsTreemap';
import PriceRangeScatter from './components/PriceRangeScatter';
import {
    aggregateByYear,
    aggregateByMake,
    aggregateByType,
    aggregateByCity,
    getKPIs,
    aggregateRangeByYear,
    aggregateCAFVStatus,
    aggregateMapData,
    aggregateRangeDistribution,
    aggregateUtilityDistribution,
    aggregateTopModelsTreemap
} from './utils/data-utils';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
    const { data, loading, error } = useEVData();
    const [selectedMake, setSelectedMake] = useState('All');
    const [yearRange, setYearRange] = useState([2010, 2024]);
    const [showFilters, setShowFilters] = useState(false);

    // Derived Data
    const filteredData = useMemo(() => {
        return data.filter(d => {
            const matchesMake = selectedMake === 'All' || d.Make === selectedMake;
            const matchesYear = d['Model Year'] >= yearRange[0] && d['Model Year'] <= yearRange[1];
            return matchesMake && matchesYear;
        });
    }, [data, selectedMake, yearRange]);

    const kpis = useMemo(() => getKPIs(filteredData), [filteredData]);
    const yearData = useMemo(() => aggregateByYear(filteredData), [filteredData]);
    const typeData = useMemo(() => aggregateByType(filteredData), [filteredData]);
    const cityData = useMemo(() => aggregateByCity(filteredData), [filteredData]);
    const makeData = useMemo(() => aggregateByMake(filteredData), [filteredData]);
    const rangeYearData = useMemo(() => aggregateRangeByYear(filteredData), [filteredData]);
    const cafvData = useMemo(() => aggregateCAFVStatus(filteredData), [filteredData]);
    const mapData = useMemo(() => aggregateMapData(filteredData), [filteredData]);
    const rangeDistData = useMemo(() => aggregateRangeDistribution(filteredData), [filteredData]);
    const utilityData = useMemo(() => aggregateUtilityDistribution(filteredData), [filteredData]);
    const treemapData = useMemo(() => aggregateTopModelsTreemap(filteredData), [filteredData]);

    const uniqueMakes = useMemo(() => ['All', ...new Set(data.map(d => d.Make).filter(Boolean).sort())], [data]);

    const resetFilters = () => {
        setSelectedMake('All');
        setYearRange([2010, 2024]);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Processing EV Registry...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
            <div className="bg-slate-900 border border-rose-500/20 p-8 rounded-3xl max-w-md text-center">
                <h2 className="text-xl font-bold text-white mb-2">Error Loading Data</h2>
                <p className="text-slate-400 text-sm mb-6">{error}</p>
                <button onClick={() => window.location.reload()} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-2xl transition-colors">
                    Retry
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5 px-6 lg:px-12 py-4">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                            <Zap className="w-6 h-6 text-white fill-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tighter leading-none uppercase">MapUp <span className="text-brand-500">EV</span></h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">WA Population Analytics</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${showFilters ? 'bg-brand-500 text-white border-brand-500' : 'bg-slate-900 text-slate-400 border-white/5 hover:border-white/10'
                                }`}
                        >
                            <Filter size={16} />
                            Analysis Filters
                            <ChevronDown size={14} className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                        <button onClick={resetFilters} className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-xl text-sm font-bold border border-white/5">
                            Reset
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-slate-900/50 mt-4 rounded-2xl border border-white/5"
                        >
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest pl-1">Manufacturer</label>
                                    <select
                                        value={selectedMake}
                                        onChange={(e) => setSelectedMake(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-brand-500/50"
                                    >
                                        {uniqueMakes.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest pl-1">Model Year Range: {yearRange[0]} - {yearRange[1]}</label>
                                    <div className="flex items-center gap-4 py-2">
                                        <input type="range" min="2010" max="2024" value={yearRange[0]} onChange={e => setYearRange([parseInt(e.target.value), yearRange[1]])} className="w-full accent-brand-500" />
                                        <input type="range" min="2010" max="2024" value={yearRange[1]} onChange={e => setYearRange([yearRange[0], parseInt(e.target.value)])} className="w-full accent-brand-500" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="max-w-[1600px] mx-auto p-6 lg:p-12 space-y-12">
                {/* TIER 1: KPIs */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="text-brand-500" />
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Market Summary</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        <KPICard title="Total EVs" value={kpis.total?.toLocaleString()} icon={Car} description="Active population in dataset" />
                        <KPICard title="Top Manufacturer" value={kpis.topMake} icon={Landmark} description="Market share leader" />
                        <KPICard title="Most Popular Model" value={kpis.topModel} icon={Zap} description={`Most frequent registration`} />
                        <KPICard title="Avg Range" value={`${kpis.avgRange} mi`} icon={Gauge} description="Real-world average capability" />
                        <KPICard title="Dominant Year" value={kpis.dominantYear} icon={Calendar} description="Highest production volume year" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        <KPICard title="BEV Intensity" value={`${kpis.bevPercent}%`} icon={Zap} description="Fully electric share" />
                        <KPICard title="CAFV Eligible" value={`${kpis.eligiblePercent}%`} icon={ShieldCheck} description="Qualifies for incentives" />
                        <KPICard title="Market Concentration" value={kpis.hhi} icon={PieIcon} description="HHI Index (Brand Diversity)" />
                        <KPICard title="Top City" value={kpis.topCity} icon={Globe} description="Highest adoption urban center" />
                        <KPICard title="Unique Models" value={kpis.uniqueModels} icon={BarChart3} description="Diversity of available options" />
                    </div>
                </section>

                {/* TIER 2: PRIMARY ANALYSIS */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <ChartCard title="EV Growth Timeline" subtitle="Adoption trends by year and type" className="lg:col-span-2">
                        <EVGrowthChart data={yearData} />
                    </ChartCard>
                    <ChartCard title="EV Type Split" subtitle="Battery Electric vs Plug-in Hybrid">
                        <EVTypeDonut data={typeData} />
                    </ChartCard>
                </section>

                {/* TIER 3: DEEP DIVE SECTION */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ChartCard title="Manufacturer Presence" subtitle="Top 10 brands by volume">
                        <ManufacturersBar data={makeData} />
                    </ChartCard>
                    <ChartCard title="Capability Roadmap" subtitle="Average electric range improvement YoY">
                        <RangeByYearLine data={rangeYearData} />
                    </ChartCard>
                </section>

                {/* TIER 4: GEOSPATIAL & INFRASTRUCTURE */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <ChartCard title="Regional Distribution Map" subtitle="GPS density visualization of WA" className="lg:col-span-2 h-[600px]">
                        <EVDistributionMap data={mapData} />
                    </ChartCard>
                    <div className="space-y-8">
                        <ChartCard title="Utility Load Distribution" subtitle="Main service providers" className="h-[284px]">
                            <div className="space-y-4">
                                {utilityData.slice(0, 5).map((util, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-bold uppercase">
                                            <span className="text-slate-400 truncate w-32">{util.name}</span>
                                            <span className="text-white">{util.count.toLocaleString()}</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-500" style={{ width: `${(util.count / utilityData[0].count) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ChartCard>
                        <ChartCard title="CAFV Compliance" subtitle="Incentive eligibility status" className="h-[284px]">
                            <div className="space-y-4">
                                {cafvData.map((item, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-bold uppercase">
                                            <span className="text-slate-400">{item.name}</span>
                                            <span className="text-white">{Math.round((item.value / filteredData.length) * 100)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-500" style={{ width: `${(item.value / filteredData.length) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ChartCard>
                    </div>
                </section>

                {/* TIER 5: MARKET DYNAMICS & RANGE */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ChartCard title="Model Portfolio Treemap" subtitle="Distribution by Make and Model">
                        <TopModelsTreemap data={treemapData} />
                    </ChartCard>
                    <ChartCard title="Price-Range Correlation" subtitle="Relationship between MSRP and Range capability">
                        <PriceRangeScatter data={filteredData} />
                    </ChartCard>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    <ChartCard title="Range Saturation" subtitle="Histogram of electric range frequency">
                        <RangeDistributionHistogram data={rangeDistData} />
                    </ChartCard>
                </section>

                {/* TIER 6: RAW DATA REGISTRY */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <TableIcon className="text-brand-500" />
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Population Explorer</h2>
                    </div>
                    <ChartCard title="Raw Registration Intel" subtitle="Detailed vehicle registry view" className="min-h-0 h-auto">
                        <DataTable data={filteredData} />
                    </ChartCard>
                </section>
            </main>

            <footer className="bg-slate-900 border-t border-white/5 py-12 px-6 lg:px-12 mt-24">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-brand-500" />
                            <span className="text-lg font-black text-white tracking-widest uppercase">MapUp</span>
                        </div>
                        <p className="text-sm text-slate-500">© 2024 Washington State EV Dashboard Assessment. Professional Data Intelligence.</p>
                    </div>
                    <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <p>Data Source: WA State DOL</p>
                        <p>Total Records Processed: {data.length.toLocaleString()}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
