import React, { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, Search, Download } from 'lucide-react';

const DataTable = ({ data }) => {
    const [globalFilter, setGlobalFilter] = useState('');

    const columns = React.useMemo(() => [
        { header: 'VIN (1-10)', accessorKey: 'VIN (1-10)' },
        { header: 'Make', accessorKey: 'Make' },
        { header: 'Model', accessorKey: 'Model' },
        { header: 'Year', accessorKey: 'Model Year' },
        { header: 'EV Type', accessorKey: 'Electric Vehicle Type' },
        { header: 'Range', accessorKey: 'Electric Range', cell: info => `${info.getValue()} mi` },
        { header: 'City', accessorKey: 'City' },
    ], []);

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: { pagination: { pageSize: 12 } }
    });

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:max-w-sm group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search registrations..."
                        className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all text-white"
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-auto rounded-[2rem] border border-white/5 bg-slate-950/30">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="sticky top-0 z-10 bg-slate-1000">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="bg-slate-900 shadow-sm">
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-6 py-4 font-bold text-slate-400 border-b border-white/5 uppercase tracking-wider text-[10px]">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-brand-500/5 transition-colors group">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-6 py-4 text-slate-300 font-medium">
                                        {cell.column.id === 'Electric Vehicle Type' ? (
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight ${cell.getValue()?.includes('BEV') ? 'bg-brand-500/10 text-brand-400' : 'bg-emerald-500/10 text-emerald-400'
                                                }`}>
                                                {cell.getValue()?.includes('BEV') ? 'BEV' : 'PHEV'}
                                            </span>
                                        ) : (
                                            flexRender(cell.column.columnDef.cell, cell.getContext())
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center px-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {table.getFilteredRowModel().rows.length.toLocaleString()} Total Records
                </p>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="p-3 bg-slate-900 border border-white/5 rounded-2xl disabled:opacity-20 hover:bg-slate-800 transition-all shadow-xl text-white"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="text-xs font-bold font-mono text-slate-400">
                        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </span>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="p-3 bg-slate-900 border border-white/5 rounded-2xl disabled:opacity-20 hover:bg-slate-800 transition-all shadow-xl text-white"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
