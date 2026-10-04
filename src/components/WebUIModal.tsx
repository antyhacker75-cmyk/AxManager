import React, { useState } from 'react';
import { useAxeron } from '../context/AxeronContext';
import { Globe, X, Play, RefreshCw, Terminal, CheckCircle, Code } from 'lucide-react';

export const WebUIModal: React.FC = () => {
  const { webUIPlugin, setWebUIPlugin } = useAxeron();
  const [webOutput, setWebOutput] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'interface' | 'console' | 'config'>('interface');
  const [customParam, setCustomParam] = useState<string>('axeron --version');

  if (!webUIPlugin) return null;

  const handleRunCommand = () => {
    if (!customParam) return;
    setWebOutput((prev) => [
      ...prev,
      `> [AxWebInterface] ${customParam}`,
      `> Output: Executed successfully in WebUI sandbox. Result: OK`
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl h-[85vh] glass-panel rounded-3xl border border-teal-500/30 flex flex-col overflow-hidden shadow-2xl">
        {/* WebUI Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900/90 border-b border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">{webUIPlugin.name} WebUI</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-teal-400 border border-zinc-700">
                  {webUIPlugin.webUIUrl || 'axeron.js'}
                </span>
              </div>
              <p className="text-xs text-zinc-400">Axeron Web Interface Sandbox Host</p>
            </div>
          </div>

          <button
            onClick={() => setWebUIPlugin(null)}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-zinc-800 bg-zinc-950/60 px-4 py-2 space-x-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('interface')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
              activeTab === 'interface'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Interactive Web UI</span>
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
              activeTab === 'console'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Eruda Console</span>
          </button>
        </div>

        {/* WebUI Body Sandbox */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-950/40">
          {activeTab === 'interface' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Module Web Controller
                  </span>
                  <span className="flex items-center text-[11px] text-emerald-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    AxWebInterface Active
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  {webUIPlugin.description}
                </p>

                {/* Configuration Toggles */}
                {webUIPlugin.configProps && (
                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <div className="text-xs font-semibold text-teal-400">Module Runtime Variables:</div>
                    {Object.entries(webUIPlugin.configProps).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-zinc-950/80 border border-zinc-800 font-mono">
                        <span className="text-zinc-300">{key}</span>
                        <span className="text-teal-400">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* WebUI Execute Shell Tester */}
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <label className="text-xs font-semibold text-zinc-300">
                  Execute WebUI Script Trigger
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={customParam}
                    onChange={(e) => setCustomParam(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono bg-zinc-950 rounded-xl border border-zinc-700 text-zinc-100 focus:outline-none focus:border-teal-500"
                    placeholder="Enter command or function..."
                  />
                  <button
                    onClick={handleRunCommand}
                    className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-xs flex items-center space-x-1 transition active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run</span>
                  </button>
                </div>
              </div>

              {/* Console logs */}
              {webOutput.length > 0 && (
                <div className="p-3 rounded-2xl bg-black/90 border border-zinc-800 font-mono text-xs space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase font-semibold">WebUI Output Log:</div>
                  {webOutput.map((out, i) => (
                    <div key={i} className="text-emerald-400">{out}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'console' && (
            <div className="font-mono text-xs p-4 rounded-2xl bg-black border border-zinc-800 space-y-2 h-full min-h-[300px]">
              <div className="text-teal-400 font-bold">[Eruda Console v3.0.0 Ready]</div>
              <div className="text-zinc-400">Axeron JS Bridge: window.axeron = &#123; exec: fn(), getProp: fn() &#125;</div>
              <div className="text-zinc-500">----------------------------------------------------</div>
              <div className="text-zinc-300">[12:00:01] Initializing WebUI interface...</div>
              <div className="text-emerald-400">[12:00:02] AxPathHandler loaded root path.</div>
              <div className="text-teal-300">[12:00:03] MonetColorsProvider bound to Android system theme.</div>
            </div>
          )}
        </div>

        {/* WebUI Footer */}
        <div className="p-4 bg-zinc-900/90 border-t border-zinc-800 flex justify-end">
          <button
            onClick={() => setWebUIPlugin(null)}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition"
          >
            Close WebUI
          </button>
        </div>
      </div>
    </div>
  );
};
