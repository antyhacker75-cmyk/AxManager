import React, { useState } from 'react';
import { useAxeron } from '../context/AxeronContext';
import { AppPrivilege } from '../types';
import {
  ShieldCheck,
  Search,
  Filter,
  Sliders,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Smartphone
} from 'lucide-react';

export const PrivilegeScreen: React.FC = () => {
  const { apps, toggleAppPermission } = useAxeron();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'granted' | 'user' | 'system'>('all');
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'system') return app.isSystemApp;
    if (filterType === 'user') return !app.isSystemApp;
    if (filterType === 'granted') {
      return Object.values(app.permissions).some(Boolean);
    }
    return true;
  });

  const permissionLabels: Record<keyof AppPrivilege['permissions'], { label: string; desc: string }> = {
    globalSettings: { label: 'Global Settings', desc: 'Write access to Settings.Global' },
    secureSettings: { label: 'Secure Settings', desc: 'Write access to Settings.Secure' },
    systemSettings: { label: 'System Settings', desc: 'Write access to Settings.System' },
    androidProps: { label: 'Android Properties', desc: 'Permission to modify resetprop/setprop' },
    shellRestriction: { label: 'Shell Restriction', desc: 'Restrict background process throttling' },
    keyEventBlocker: { label: 'Key Event Blocker', desc: 'Block hardware button key events' }
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Privilege Manager</h2>
          <p className="text-xs text-zinc-400">Astro Star Permission Intercept</p>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
          {apps.length} Apps
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs text-zinc-100 focus:outline-none focus:border-teal-500"
            placeholder="Search package or application name..."
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {(['all', 'granted', 'user', 'system'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition shrink-0 ${
                filterType === type
                  ? 'bg-teal-500 text-zinc-950 font-bold'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Apps List */}
      <div className="space-y-3">
        {filteredApps.length === 0 ? (
          <div className="glass-card p-8 rounded-3xl text-center space-y-2">
            <Smartphone className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No applications match your filter.</p>
          </div>
        ) : (
          filteredApps.map((app) => {
            const isExpanded = expandedApp === app.packageName;
            const grantedCount = Object.values(app.permissions).filter(Boolean).length;

            return (
              <div
                key={app.packageName}
                className="glass-card rounded-3xl overflow-hidden border border-zinc-800/80 transition"
              >
                {/* App Row Summary */}
                <div
                  onClick={() => setExpandedApp(isExpanded ? null : app.packageName)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-800/40 transition"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="text-2xl p-2 rounded-2xl bg-zinc-900 border border-zinc-800 shrink-0">
                      {app.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">
                        {app.appName}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono truncate">
                        {app.packageName}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        UID: {app.uid} • {app.isSystemApp ? 'System App' : 'User App'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        grantedCount > 0
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {grantedCount} Perms
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-zinc-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Permission Toggles */}
                {isExpanded && (
                  <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 space-y-3 animate-fade-in">
                    <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                      Axeron Permission Intercept List
                    </div>

                    <div className="space-y-2">
                      {(Object.keys(permissionLabels) as Array<keyof AppPrivilege['permissions']>).map((permKey) => {
                        const isGranted = app.permissions[permKey];
                        const meta = permissionLabels[permKey];

                        return (
                          <div
                            key={permKey}
                            onClick={() => toggleAppPermission(app.packageName, permKey)}
                            className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition"
                          >
                            <div>
                              <div className="text-xs font-semibold text-zinc-200">
                                {meta.label}
                              </div>
                              <div className="text-[10px] text-zinc-400">
                                {meta.desc}
                              </div>
                            </div>

                            <button
                              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                                isGranted ? 'bg-teal-500' : 'bg-zinc-800'
                              }`}
                            >
                              <span
                                className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                                  isGranted ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              ></span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
