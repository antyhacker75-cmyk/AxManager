import React from 'react';
import { useAxeron } from '../context/AxeronContext';
import { Power, Terminal, Zap, ShieldCheck, AlertTriangle } from 'lucide-react';

export const Header: React.FC = () => {
  const { axeronInfo, activateStatus, setPowerModalOpen, setActiveTab, activeTab } = useAxeron();

  const isRunning = activateStatus === 'Running';
  const isUpdating = activateStatus === 'Updating';
  const isNeedFix = activateStatus === 'NeedExtraStep';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-800/80 px-4 py-3">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {/* App Title & Version */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20">
            <Zap className="w-5 h-5 animate-pulse" />
            {isRunning && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-zinc-950"></span>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-zinc-100 tracking-tight leading-none">
                Astro Star
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                Axeron
              </span>
            </div>
            <p className="text-xs font-semibold text-teal-400 mt-0.5 font-mono">
              v{axeronInfo.versionName} ({axeronInfo.versionCode})
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* QuickShell floating shortcut button */}
          {isRunning && activeTab !== 'quickshell' && (
            <button
              onClick={() => setActiveTab('quickshell')}
              className="p-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-teal-400 border border-zinc-700/60 transition-all active:scale-95 shadow-sm"
              title="QuickShell Terminal"
            >
              <Terminal className="w-4 h-4" />
            </button>
          )}

          {/* Status badge pill */}
          <div className="hidden sm:flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-zinc-900/80">
            {isRunning && (
              <span className="flex items-center text-emerald-400 space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Running ({axeronInfo.serverInfo.mode})</span>
              </span>
            )}
            {isUpdating && (
              <span className="flex items-center text-amber-400 space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>Updating</span>
              </span>
            )}
            {isNeedFix && (
              <span className="flex items-center text-rose-400 space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Need Fix</span>
              </span>
            )}
            {activateStatus === 'NotRunning' && (
              <span className="flex items-center text-zinc-400 space-x-1">
                <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
                <span>Stopped</span>
              </span>
            )}
          </div>

          {/* Power Options Dialog Trigger */}
          {isRunning && (
            <button
              onClick={() => setPowerModalOpen(true)}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all active:scale-95"
              title="Power & Service Controls"
            >
              <Power className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
