import React, { useState } from 'react';
import { useAxeron } from '../context/AxeronContext';
import { Power, Flame, RefreshCw, X, Loader2 } from 'lucide-react';

export const PowerModal: React.FC = () => {
  const { powerModalOpen, setPowerModalOpen, reigniteService, restartDaemon, shutdownAxeron } = useAxeron();
  const [loading, setLoading] = useState<boolean>(false);

  if (!powerModalOpen) return null;

  const handleReignite = async () => {
    setLoading(true);
    await reigniteService();
    setLoading(false);
    setPowerModalOpen(false);
  };

  const handleRestart = () => {
    restartDaemon();
    setPowerModalOpen(false);
  };

  const handleShutdown = () => {
    shutdownAxeron();
    setPowerModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm glass-panel rounded-3xl border border-zinc-700/80 p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => setPowerModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Power className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Power & Service</h3>
            <p className="text-xs text-zinc-400">Manage Axeron background daemon state</p>
          </div>
        </div>

        {/* Actions List */}
        <div className="space-y-3">
          {/* Reignite Button */}
          <button
            disabled={loading}
            onClick={handleReignite}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-teal-500/15 to-emerald-500/15 hover:from-teal-500/25 hover:to-emerald-500/25 text-teal-300 border border-teal-500/30 font-semibold transition active:scale-[0.98]"
          >
            <div className="flex items-center space-x-3">
              <Flame className="w-5 h-5 text-teal-400" />
              <div className="text-left">
                <div className="text-sm">Re-ignite Service</div>
                <div className="text-[11px] text-teal-400/80 font-normal">Reload active DEX modules & hooks</div>
              </div>
            </div>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="text-xs font-mono">DEX</span>}
          </button>

          {/* Restart Service Button */}
          <button
            onClick={handleRestart}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700/70 font-semibold transition active:scale-[0.98]"
          >
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-5 h-5 text-indigo-400" />
              <div className="text-left">
                <div className="text-sm">Restart Daemon</div>
                <div className="text-[11px] text-zinc-400 font-normal">Restart ADB server process & PID</div>
              </div>
            </div>
          </button>

          {/* Shutdown Service Button */}
          <button
            onClick={handleShutdown}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold transition active:scale-[0.98]"
          >
            <div className="flex items-center space-x-3">
              <Power className="w-5 h-5 text-rose-400" />
              <div className="text-left">
                <div className="text-sm">Shutdown Axeron</div>
                <div className="text-[11px] text-rose-400/80 font-normal">Stop daemon and release listeners</div>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
          <button
            onClick={() => setPowerModalOpen(false)}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
