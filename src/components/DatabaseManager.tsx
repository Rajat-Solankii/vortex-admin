'use client';

import { useState, useEffect } from 'react';
import { Database, Trash2, RefreshCw, ChevronDown, Copy, Check } from 'lucide-react';

const TABLES = ['users', 'collections', 'collection_items', 'bookmarks', 'user_profiles', 'profiles', 'profile_bookmarks', 'profile_history', 'settings', 'banned_ips'];

export default function DatabaseManager() {
  const [selectedTable, setSelectedTable] = useState(TABLES[0]);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCell, setCopiedCell] = useState<{row: number, col: string} | null>(null);
  
  // Custom Modal State
  const [deleteRecord, setDeleteRecord] = useState<any>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/database?table=${selectedTable}`);
      const json = await res.json();
      if (json.rows) {
        setData(json.rows);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedTable]);

  const requestDelete = (row: any) => {
    setDeleteRecord(row);
  };

  const confirmDelete = async () => {
    if (!deleteRecord) return;
    const row = deleteRecord;
    setDeleteRecord(null);
    
    // Determine the primary key field for the table
    let idField = 'id';
    if (selectedTable === 'settings') idField = 'key';
    if (selectedTable === 'banned_ips') idField = 'ip';
    if (selectedTable === 'user_profiles') idField = 'userId';
    if (selectedTable === 'profile_history') idField = 'profileId';

    try {
      const res = await fetch('/api/database', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: selectedTable,
          idField,
          idValue: row[idField]
        })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (text: string, rowIndex: number, colName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCell({ row: rowIndex, col: colName });
    setTimeout(() => setCopiedCell(null), 2000);
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Header and Controls */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01] shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <select 
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="appearance-none bg-black/40 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-white font-semibold focus:outline-none focus:border-vortex/50 cursor-pointer shadow-inner"
            >
              {TABLES.map(t => (
                <option key={t} value={t} className="bg-[#07090e] text-white">Table: {t}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full font-mono">{data.length} records</span>
        </div>
        
        <button 
          onClick={fetchData}
          className="p-2.5 bg-white/5 hover:bg-vortex/20 hover:text-vortex border border-white/10 rounded-xl transition-all group shadow-sm"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 group-hover:text-vortex ${isLoading ? 'animate-spin text-vortex' : ''}`} />
        </button>
      </div>

      {/* Table Data */}
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-vortex/30 border-t-vortex rounded-full animate-spin"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <Database className="w-12 h-12 mb-3 opacity-20" />
            <p>No records found in table <b>{selectedTable}</b>.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="sticky top-0 bg-[#07090e]/90 backdrop-blur-xl z-10 shadow-sm border-b border-white/5">
              <tr>
                {columns.map(col => (
                  <th key={col} className="px-6 py-4 font-semibold text-gray-400 text-sm tracking-wide">
                    {col}
                  </th>
                ))}
                <th className="px-6 py-4 font-semibold text-gray-400 text-sm tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.03] transition-colors group">
                  {columns.map(col => {
                    const isCopied = copiedCell?.row === idx && copiedCell?.col === col;
                    const valStr = String(row[col]);
                    return (
                      <td 
                        key={col} 
                        className="px-6 py-4 text-gray-300 font-mono whitespace-nowrap group/cell relative"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span>
                            {row[col] === null ? <span className="text-gray-600 italic">null</span> : valStr}
                          </span>
                          {row[col] !== null && valStr.length > 0 && (
                            <button
                              onClick={() => handleCopy(valStr, idx, col)}
                              className="opacity-0 group-hover/cell:opacity-100 p-1.5 hover:bg-white/10 rounded-md transition-all shrink-0 text-gray-400 hover:text-white"
                              title="Copy to clipboard"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => requestDelete(row)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/10 opacity-0 group-hover:opacity-100"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0a0d14] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" /> Confirm Deletion
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to permanently delete this record from the <b>{selectedTable}</b> table? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button 
                onClick={() => setDeleteRecord(null)}
                className="px-5 py-2.5 rounded-xl font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
