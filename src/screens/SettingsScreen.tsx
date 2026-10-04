import React, { useState } from 'react';
import { useAxeron } from '../context/AxeronContext';
import { ThemeColor } from '../types';
import {
  Settings,
  Palette,
  Sliders,
  Code,
  Trash2,
  Plus,
  Moon,
  Sun,
  ShieldAlert,
  AlertTriangle,
  X,
  Check,
  Search,
  ExternalLink
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    themeColor,
    setThemeColor,
    darkMode,
    setDarkMode,
    oledMode,
    setOledMode,
    dynamicColor,
    setDynamicColor,
    devMode,
    setDevMode,
    settings,
    addSetting,
    updateSetting,
    deleteSetting,
    plugins
  } = useAxeron();

  const [activeTab, setActiveTab] = useState<'appearance' | 'editor' | 'developer'>('appearance');
  const [settingCategory, setSettingCategory] = useState<'Global' | 'Secure' | 'System' | 'Properties'>('Global');
  const [editorQuery, setEditorQuery] = useState<string>('');

  // New setting modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newKey, setNewKey] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');

  // Reset Modal state
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  const themeColors: { id: ThemeColor; label: string; colorHex: string }[] = [
    { id: 'teal', label: 'Axeron Teal', colorHex: '#14b8a6' },
    { id: 'emerald', label: 'Emerald', colorHex: '#10b981' },
    { id: 'cyan', label: 'Cyan Blue', colorHex: '#06b6d4' },
    { id: 'purple', label: 'Electric Purple', colorHex: '#a855f7' },
    { id: 'amber', label: 'Sunset Amber', colorHex: '#f59e0b' },
    { id: 'rose', label: 'Crimson Rose', colorHex: '#f43f5e' },
    { id: 'monet', label: 'Dynamic Monet', colorHex: '#3b82f6' }
  ];

  const filteredSettings = settings.filter(
    (s) =>
      s.category === settingCategory &&
      (s.key.toLowerCase().includes(editorQuery.toLowerCase()) ||
        s.value.toLowerCase().includes(editorQuery.toLowerCase()))
  );

  const handleCreateSetting = () => {
    if (!newKey) return;
    addSetting({
      category: settingCategory,
      key: newKey,
      value: newValue
    });
    setShowAddModal(false);
    setNewKey('');
    setNewValue('');
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Top Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Settings & Customization</h2>
          <p className="text-xs text-zinc-400">Configure appearance and system parameters</p>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center space-x-2 p-1 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'appearance'
              ? 'bg-teal-500 text-zinc-950 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Appearance</span>
        </button>

        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'editor'
              ? 'bg-teal-500 text-zinc-950 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Props Editor</span>
        </button>

        <button
          onClick={() => setActiveTab('developer')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'developer'
              ? 'bg-teal-500 text-zinc-950 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Developer</span>
        </button>
      </div>

      {/* SECTION 1: APPEARANCE */}
      {activeTab === 'appearance' && (
        <div className="space-y-4">
          {/* Color Palette Picker */}
          <div className="glass-card p-5 rounded-3xl space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Primary Accent Color
            </h3>
            <div className="grid grid-cols-4 gap-2.5">
              {themeColors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setThemeColor(c.id)}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1.5 transition ${
                    themeColor === c.id
                      ? 'border-teal-400 bg-zinc-800 shadow-md'
                      : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-white/20"
                    style={{ backgroundColor: c.colorHex }}
                  ></span>
                  <span className="text-[10px] text-zinc-300 font-semibold truncate w-full text-center">
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Toggles */}
          <div className="glass-card p-5 rounded-3xl space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Display & Dark Theme
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center space-x-3">
                  <Moon className="w-4 h-4 text-teal-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">Dark Mode</div>
                    <div className="text-[10px] text-zinc-400">High contrast dark theme UI</div>
                  </div>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    darkMode ? 'bg-teal-500' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      darkMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center space-x-3">
                  <Moon className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">Pure OLED Black</div>
                    <div className="text-[10px] text-zinc-400">True black backgrounds for AMOLED</div>
                  </div>
                </div>
                <button
                  onClick={() => setOledMode(!oledMode)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    oledMode ? 'bg-teal-500' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      oledMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PROPS & SETTINGS EDITOR */}
      {activeTab === 'editor' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {/* Category Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
              {(['Global', 'Secure', 'System', 'Properties'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSettingCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
                    settingCategory === cat
                      ? 'bg-teal-500 text-zinc-950 font-bold'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="p-2 rounded-xl bg-teal-500 text-zinc-950 hover:bg-teal-400 transition"
              title="Add Key"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={editorQuery}
              onChange={(e) => setEditorQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-teal-500"
              placeholder={`Search in ${settingCategory}...`}
            />
          </div>

          {/* Properties List */}
          <div className="space-y-2">
            {filteredSettings.length === 0 ? (
              <div className="glass-card p-8 rounded-3xl text-center text-xs text-zinc-500">
                No keys found in category {settingCategory}.
              </div>
            ) : (
              filteredSettings.map((item) => (
                <div
                  key={item.id}
                  className="glass-card p-3.5 rounded-2xl flex items-center justify-between space-x-3 border border-zinc-800/80 font-mono text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-teal-400 font-bold truncate">{item.key}</div>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => updateSetting(item.id, e.target.value)}
                      className="mt-1 w-full px-2 py-1 bg-zinc-950 rounded-lg border border-zinc-800 text-zinc-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <button
                    onClick={() => deleteSetting(item.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                    title="Delete Key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: DEVELOPER OPTIONS & RESET */}
      {activeTab === 'developer' && (
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-3xl space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Developer Controls
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div>
                  <div className="text-xs font-semibold text-white">Enable Developer Mode</div>
                  <div className="text-[10px] text-zinc-400">Show hidden debug details and logs</div>
                </div>
                <button
                  onClick={() => setDevMode(!devMode)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    devMode ? 'bg-teal-500' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      devMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div>
                  <div className="text-xs font-semibold text-white">BusyBox Compatibility</div>
                  <div className="text-[10px] text-zinc-400">Use busybox for unsupported commands</div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">Active</span>
              </div>
            </div>
          </div>

          {/* Reset Astro Star */}
          <div className="glass-card-error p-5 rounded-3xl space-y-3 border border-rose-500/30">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Reset Astro Star</span>
            </div>
            <p className="text-xs text-rose-300/80 leading-relaxed">
              This action will disable and remove all installed modules ({plugins.length} plugins) and reset configuration.
            </p>

            <button
              onClick={() => setShowResetModal(true)}
              className="w-full py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition"
            >
              Reset Astro Star Path
            </button>
          </div>
        </div>
      )}

      {/* ADD SETTING KEY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm glass-panel rounded-3xl border border-zinc-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Add Key to {settingCategory}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-full text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Setting Key</label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-teal-400 focus:outline-none focus:border-teal-500"
                  placeholder="e.g. persist.sys.gpu.turbo"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Value</label>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-100 focus:outline-none focus:border-teal-500"
                  placeholder="e.g. 1"
                />
              </div>
            </div>

            <div className="pt-2 flex space-x-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSetting}
                className="flex-1 py-2 rounded-xl bg-teal-500 text-zinc-950 font-bold text-xs"
              >
                Add Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm glass-panel rounded-3xl border border-rose-500/40 p-6 space-y-4">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>Reset Astro Star Now?</span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              This action will disable and remove all of your plugins at /data/local/tmp/axeron.
            </p>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-500/20"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
