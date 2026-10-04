import React, { useState } from 'react';
import { useAxeron } from '../context/AxeronContext';
import { PluginItem } from '../types';
import {
  Puzzle,
  Search,
  Plus,
  Flame,
  Globe,
  Settings,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  FileCode,
  Download,
  Info
} from 'lucide-react';

export const PluginScreen: React.FC = () => {
  const {
    plugins,
    togglePlugin,
    ignitePlugin,
    uninstallPlugin,
    installPlugin,
    updatePluginConfig,
    setWebUIPlugin
  } = useAxeron();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPluginForConfig, setSelectedPluginForConfig] = useState<PluginItem | null>(null);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [newPluginName, setNewPluginName] = useState<string>('');
  const [newPluginAuthor, setNewPluginAuthor] = useState<string>('');
  const [newPluginDesc, setNewPluginDesc] = useState<string>('');

  const filteredPlugins = plugins.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePlugin = () => {
    if (!newPluginName) return;
    installPlugin({
      name: newPluginName,
      author: newPluginAuthor || 'Astro Star User',
      description: newPluginDesc || 'Custom user installed module',
      hasWebUI: true,
      webUIUrl: 'axeron.js'
    });
    setShowInstallModal(false);
    setNewPluginName('');
    setNewPluginAuthor('');
    setNewPluginDesc('');
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Plugin Service</h2>
          <p className="text-xs text-zinc-400">Axeron background modules & DEX hooks</p>
        </div>
        <button
          onClick={() => setShowInstallModal(true)}
          className="px-3 py-2 rounded-2xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-teal-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Install Plugin</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs text-zinc-100 focus:outline-none focus:border-teal-500"
          placeholder="Search module name or ID..."
        />
      </div>

      {/* Plugins List */}
      <div className="space-y-3">
        {filteredPlugins.length === 0 ? (
          <div className="glass-card p-8 rounded-3xl text-center space-y-2">
            <Puzzle className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No plugins installed.</p>
          </div>
        ) : (
          filteredPlugins.map((plugin) => (
            <div
              key={plugin.id}
              className="glass-card p-5 rounded-3xl space-y-4 border border-zinc-800/80 hover:border-zinc-700/80 transition"
            >
              {/* Top Details */}
              <div className="flex items-start justify-between">
                <div className="space-y-1 pr-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">{plugin.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-teal-400 border border-zinc-700/80 font-semibold">
                      v{plugin.version}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{plugin.description}</p>
                  <div className="text-[11px] text-zinc-400 font-mono pt-1">
                    ID: <span className="text-zinc-300">{plugin.id}</span> • Author: <span className="text-zinc-300">{plugin.author}</span> • Size: <span className="text-zinc-300">{plugin.sizeMb} MB</span>
                  </div>
                </div>

                {/* Enable Switch */}
                <button
                  onClick={() => togglePlugin(plugin.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    plugin.enabled ? 'bg-teal-500' : 'bg-zinc-800'
                  }`}
                  title={plugin.enabled ? 'Disable Plugin' : 'Enable Plugin'}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      plugin.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-2">
                {plugin.enabled && !plugin.needsIgnite && (
                  <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Active & Ignited
                  </span>
                )}
                {plugin.enabled && plugin.needsIgnite && (
                  <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    Requires Ignite
                  </span>
                )}
                {!plugin.enabled && (
                  <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400">
                    Disabled
                  </span>
                )}
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex items-center space-x-2 pt-2 border-t border-zinc-800/80">
                {/* Ignite Button */}
                {plugin.enabled && (
                  <button
                    onClick={() => ignitePlugin(plugin.id)}
                    className="flex-1 py-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center justify-center space-x-1.5 transition"
                  >
                    <Flame className="w-3.5 h-3.5 text-teal-400" />
                    <span>Ignite</span>
                  </button>
                )}

                {/* WebUI Launch Button */}
                {plugin.hasWebUI && plugin.enabled && (
                  <button
                    onClick={() => setWebUIPlugin(plugin)}
                    className="flex-1 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center justify-center space-x-1.5 transition"
                  >
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>WebUI</span>
                  </button>
                )}

                {/* Config Modal Button */}
                <button
                  onClick={() => setSelectedPluginForConfig(plugin)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                  title="Configure Module Properties"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {/* Uninstall Button */}
                <button
                  onClick={() => uninstallPlugin(plugin.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                  title="Uninstall Plugin"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* INSTALL PLUGIN MODAL */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md glass-panel rounded-3xl border border-teal-500/30 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Install New Axeron Module</h3>
              <button
                onClick={() => setShowInstallModal(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Plugin Name
                </label>
                <input
                  type="text"
                  value={newPluginName}
                  onChange={(e) => setNewPluginName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-teal-500"
                  placeholder="e.g. GPU Driver Enhancer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={newPluginAuthor}
                  onChange={(e) => setNewPluginAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-teal-500"
                  placeholder="e.g. Axeron Community"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newPluginDesc}
                  onChange={(e) => setNewPluginDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-teal-500"
                  placeholder="Describe module functionality..."
                />
              </div>
            </div>

            <div className="pt-2 flex space-x-2">
              <button
                onClick={() => setShowInstallModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlugin}
                className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-xs"
              >
                Install Module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIGURE PLUGIN PROPERTIES MODAL */}
      {selectedPluginForConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md glass-panel rounded-3xl border border-zinc-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{selectedPluginForConfig.name}</h3>
                <p className="text-xs text-zinc-400 font-mono">module.prop Configuration</p>
              </div>
              <button
                onClick={() => setSelectedPluginForConfig(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-xs p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
              {selectedPluginForConfig.configProps ? (
                Object.entries(selectedPluginForConfig.configProps).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-1 border-b border-zinc-900">
                    <span className="text-teal-400">{key}:</span>
                    <span className="text-zinc-200">{val}</span>
                  </div>
                ))
              ) : (
                <div className="text-zinc-500">No properties defined.</div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedPluginForConfig(null)}
                className="w-full py-2.5 rounded-xl bg-teal-500 text-zinc-950 text-xs font-bold"
              >
                Save & Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
