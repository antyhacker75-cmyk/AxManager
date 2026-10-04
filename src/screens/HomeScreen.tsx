import React, { useState, useEffect } from 'react';
import { useAxeron } from '../context/AxeronContext';
import {
  Flame,
  ShieldCheck,
  Puzzle,
  Smartphone,
  Cpu,
  Shield,
  ExternalLink,
  Github,
  Send,
  AlertOctagon,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Terminal,
  Activity
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    axeronInfo,
    activateStatus,
    plugins,
    apps,
    setActiveTab,
    setPowerModalOpen
  } = useAxeron();

  const isRunning = activateStatus === 'Running';
  const isUpdating = activateStatus === 'Updating';
  const isNeedFix = activateStatus === 'NeedExtraStep';

  // Live uptime counter
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(0);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - axeronInfo.serverInfo.starting) / 1000);
      setUptimeSeconds(elapsed > 0 ? elapsed : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, axeronInfo.serverInfo.starting]);

  const formatUptime = (totalSec: number) => {
    const days = Math.floor(totalSec / 86400);
    const hrs = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    const dayStr = days === 1 ? '1 Day ' : days > 1 ? `${days} Days ` : '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `T+${dayStr}${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  const activePluginsCount = plugins.filter((p) => p.enabled).length;
  const grantedAppsCount = apps.filter((a) =>
    Object.values(a.permissions).some(Boolean)
  ).length;

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* STATUS CARD */}
      <div className="relative overflow-hidden rounded-3xl transition-all duration-300">
        {isRunning && (
          <div className="glass-card-accent p-6 relative overflow-hidden rounded-3xl border border-teal-500/30">
            {/* Background Glow & Icon watermark */}
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none text-teal-400">
              <Flame className="w-52 h-52" />
            </div>

            <div className="relative z-10 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    Running
                  </h2>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    {axeronInfo.serverInfo.mode}
                  </span>
                </div>

                <button
                  onClick={() => setPowerModalOpen(true)}
                  className="p-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 transition"
                  title="Service Options"
                >
                  <Activity className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-zinc-300 font-mono space-y-0.5">
                <div>
                  Version: <span className="font-bold text-teal-400">{axeronInfo.versionCode}</span> | PID: <span className="font-bold text-teal-400">{axeronInfo.serverInfo.pid}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-teal-500/20">
                <span className="text-xs font-semibold text-zinc-400">System Uptime</span>
                <span className="text-sm font-mono font-bold text-teal-300 tracking-wider">
                  {formatUptime(uptimeSeconds)}
                </span>
              </div>
            </div>
          </div>
        )}

        {activateStatus === 'NotRunning' && (
          <div
            onClick={() => setActiveTab('activate')}
            className="glass-card-error p-6 rounded-3xl cursor-pointer hover:border-rose-500/50 transition group"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <AlertOctagon className="w-5 h-5 text-rose-400" />
                  <h2 className="text-xl font-bold text-rose-200">Need to Activate</h2>
                </div>
                <p className="text-xs text-rose-300/80">
                  Click here to start Astro Star daemon service
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-rose-400 group-hover:translate-x-1 transition" />
            </div>
          </div>
        )}

        {isNeedFix && (
          <div
            onClick={() => setActiveTab('activate')}
            className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 cursor-pointer hover:border-amber-500/60 transition group"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-amber-200">Need Extra Step</h2>
                <p className="text-xs text-amber-300/80">
                  ADB TCP port needs reconfiguration. Click for guide.
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-amber-400 group-hover:translate-x-1 transition" />
            </div>
          </div>
        )}

        {isUpdating && (
          <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 animate-pulse">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
              <div>
                <h2 className="text-lg font-bold text-indigo-200">Updating Daemon...</h2>
                <p className="text-xs text-indigo-300/80">Re-injecting DEX hooks and binder services</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUICK STATS CARDS GRID */}
      {isRunning && (
        <div className="grid grid-cols-2 gap-3">
          {/* Plugin Card */}
          <div
            onClick={() => setActiveTab('plugin')}
            className="glass-card p-4 rounded-3xl cursor-pointer hover:border-teal-500/40 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Puzzle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {activePluginsCount} / {plugins.length}
              </span>
            </div>
            <div className="text-sm font-bold text-white">Plugins</div>
            <div className="text-[11px] text-zinc-400 flex items-center justify-between mt-1">
              <span>Active Modules</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </div>
          </div>

          {/* Privilege Card */}
          <div
            onClick={() => setActiveTab('privilege')}
            className="glass-card p-4 rounded-3xl cursor-pointer hover:border-teal-500/40 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {grantedAppsCount} Apps
              </span>
            </div>
            <div className="text-sm font-bold text-white">Privileges</div>
            <div className="text-[11px] text-zinc-400 flex items-center justify-between mt-1">
              <span>Intercept Manager</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        </div>
      )}

      {/* DEVICE & AXERON INFO CARD */}
      <div className="glass-card p-5 rounded-3xl space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          System Environment
        </h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs">
            <div className="flex items-center space-x-2.5 text-zinc-300">
              <Smartphone className="w-4 h-4 text-teal-400" />
              <span>Android Version</span>
            </div>
            <span className="font-mono font-bold text-white">
              Android 15 (SDK 35)
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs">
            <div className="flex items-center space-x-2.5 text-zinc-300">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>ABI Supported</span>
            </div>
            <span className="font-mono font-bold text-white">
              arm64-v8a, armeabi-v7a
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs">
            <div className="flex items-center space-x-2.5 text-zinc-300">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>SELinux Context</span>
            </div>
            <span className="font-mono font-bold text-emerald-400">
              {axeronInfo.serverInfo.selinuxContext}
            </span>
          </div>
        </div>
      </div>

      {/* QUICK LAUNCH SHELL CARD */}
      {isRunning && (
        <div
          onClick={() => setActiveTab('quickshell')}
          className="glass-card p-4 rounded-3xl cursor-pointer hover:border-teal-500/40 transition flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Launch QuickShell Terminal</div>
              <div className="text-xs text-zinc-400">Run axeron commands & shell macros</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-teal-400 group-hover:translate-x-1 transition" />
        </div>
      )}

      {/* LEARN & COMMUNITY CARDS */}
      <div className="glass-card p-5 rounded-3xl space-y-3">
        <div className="flex items-center space-x-2 text-teal-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Learn Astro Star</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Astro Star (Axeron Manager) is an open-source ADB & KernelSU privilege manager and plugin daemon.
        </p>
        <a
          href="https://github.com/antyhacker75-cmyk/AxManager"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition"
        >
          <span>View Documentation & GitHub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* REPORT ISSUE CARD */}
      <div className="glass-card p-5 rounded-3xl flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white">Having Trouble?</h4>
          <p className="text-xs text-zinc-400">Report bugs or submit feedback</p>
        </div>
        <div className="flex items-center space-x-2">
          <a
            href="https://github.com/antyhacker75-cmyk/AxManager/issues"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
            title="GitHub Issues"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://t.me/WashiWashi123"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition"
            title="Telegram Support"
          >
            <Send className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
