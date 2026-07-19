import React, { useEffect, useRef } from 'react';
import { Terminal, Trash2, Power, ShieldCheck, ChevronRight } from 'lucide-react';

export function NetworkConsole({ logs, onClearLogs, apiMode, onChangeApiMode }) {
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const getLogColor = (type) => {
    switch (type) {
      case 'success': return 'text-emerald-450 text-emerald-450';
      case 'error': return 'text-rose-400 font-semibold';
      case 'warning': return 'text-amber-400';
      case 'info': return 'text-sky-300';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden console-scanner shadow-2xl">
      {/* Console Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-black/40 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-black text-zinc-350 uppercase tracking-widest">
            Diagnostics console
          </span>
        </div>
        <button
          onClick={onClearLogs}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
          title="Clear Console Output"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Simulator Control Board */}
      <div className="px-5 py-3.5 bg-black/20 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">API Response Mode:</span>
          <div className="flex bg-black/60 p-0.5 rounded-xl border border-white/5">
            <button
              onClick={() => onChangeApiMode('succeed')}
              className={`px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                apiMode === 'succeed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Force Success
            </button>
            <button
              onClick={() => onChangeApiMode('intermittent')}
              className={`px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                apiMode === 'intermittent'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Intermittent
            </button>
            <button
              onClick={() => onChangeApiMode('fail')}
              className={`px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                apiMode === 'fail'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Force Fail
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Retries Enabled (Max 3)</span>
          </div>
          <div className="flex items-center gap-1">
            <Power className="w-3.5 h-3.5 text-indigo-400" />
            <span>Timeout: 1000ms</span>
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 p-5 font-mono text-[11px] overflow-y-auto min-h-[160px] max-h-[220px] flex flex-col gap-2 bg-black/30">
        {logs.length === 0 ? (
          <div className="text-zinc-650 italic py-6 text-center select-none">
            &gt; Diagnostics inactive. Submit a post save transaction to begin...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="leading-relaxed flex items-start gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-zinc-600 flex-shrink-0" />
              <span className="text-zinc-600 flex-shrink-0">[{log.time}]</span>
              
              {/* Custom Badge tags */}
              <span className={`px-1.5 py-0.25 rounded text-[8px] font-black uppercase tracking-wider border select-none mr-1 flex-shrink-0 ${
                log.type === 'error' ? 'bg-rose-950/30 border-rose-900/50 text-rose-400' :
                log.type === 'success' ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400' :
                log.type === 'warning' ? 'bg-amber-950/30 border-amber-900/50 text-amber-400' :
                'bg-indigo-950/30 border-indigo-900/50 text-indigo-400'
              }`}>
                {log.source}
              </span>
              
              <span className={getLogColor(log.type)}>{log.message}</span>
            </div>
          ))
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
