import React, { useState, useRef, useEffect } from 'react';
import { useAxeron } from '../context/AxeronContext';
import { QUICK_COMMANDS } from '../data/mockData';
import {
  Terminal,
  Send,
  Trash2,
  Copy,
  Check,
  Play,
  Save,
  SlidersHorizontal,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const QuickShellScreen: React.FC = () => {
  const { terminalLogs, executeCommand, clearTerminalLogs } = useAxeron();
  const [inputCmd, setInputCmd] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleSend = () => {
    if (!inputCmd.trim()) return;
    executeCommand(inputCmd);
    setInputCmd('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleCopyLogs = () => {
    const text = terminalLogs.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLogs = terminalLogs.filter((l) =>
    l.text.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-24 animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      {/* Top Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-teal-400" />
            <span>QuickShell Terminal</span>
          </h2>
          <p className="text-xs text-zinc-400">Interactive Axeron shell process runner</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyLogs}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
            title="Copy Logs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={clearTerminalLogs}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-rose-400 transition"
            title="Clear Terminal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* QUICK COMMAND MACROS */}
      <div className="shrink-0 space-y-1.5">
        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-teal-400" />
          <span>Quick Commands</span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {QUICK_COMMANDS.map((macro) => (
            <button
              key={macro.id}
              onClick={() => executeCommand(macro.command)}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-teal-300 font-mono font-semibold shrink-0 transition active:scale-95 flex items-center space-x-1"
            >
              <Play className="w-3 h-3 text-teal-400 fill-current" />
              <span>{macro.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TERMINAL OUTPUT BOX */}
      <div className="flex-1 rounded-3xl bg-black border border-zinc-800/90 p-4 font-mono text-xs overflow-y-auto space-y-2 shadow-inner">
        {filteredLogs.length === 0 ? (
          <div className="text-zinc-600 text-center py-10">
            [No logs to display in terminal]
          </div>
        ) : (
          filteredLogs.map((log) => {
            let colorClass = 'text-zinc-300';
            if (log.type === 'input') colorClass = 'text-teal-400 font-bold';
            if (log.type === 'system') colorClass = 'text-emerald-400';
            if (log.type === 'error') colorClass = 'text-rose-400 font-bold';

            return (
              <div key={log.id} className="leading-relaxed break-all">
                <span className="text-zinc-600 text-[10px] mr-2">[{log.timestamp}]</span>
                <span className={colorClass}>{log.text}</span>
              </div>
            );
          })
        )}
        <div ref={logEndRef} />
      </div>

      {/* COMMAND INPUT BAR */}
      <div className="shrink-0 flex items-center space-x-2">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-3 text-teal-400 font-mono font-bold text-xs">$</span>
          <input
            type="text"
            value={inputCmd}
            onChange={(e) => setInputCmd(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-8 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-mono text-white focus:outline-none focus:border-teal-500"
            placeholder="Type command (e.g. axeron, getprop, su)..."
          />
        </div>

        <button
          onClick={handleSend}
          className="px-4 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-xs flex items-center space-x-1 shadow-lg shadow-teal-500/20 transition active:scale-95"
        >
          <Send className="w-4 h-4" />
          <span>Exec</span>
        </button>
      </div>
    </div>
  );
};
