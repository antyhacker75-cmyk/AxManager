import React from 'react';
import { useAxeron } from '../context/AxeronContext';
import { Home, ShieldAlert, Puzzle, Terminal, Settings } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, activateStatus } = useAxeron();

  const isRunning = activateStatus === 'Running';

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, needAxeron: false },
    { id: 'privilege', label: 'Privilege', icon: ShieldAlert, needAxeron: true },
    { id: 'plugin', label: 'Plugin', icon: Puzzle, needAxeron: true },
    { id: 'quickshell', label: 'QuickShell', icon: Terminal, needAxeron: true },
    { id: 'settings', label: 'Settings', icon: Settings, needAxeron: false }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-2">
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDisabled = item.needAxeron && !isRunning;

          return (
            <button
              key={item.id}
              disabled={isDisabled}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 relative ${
                isActive
                  ? 'text-teal-400 font-semibold'
                  : isDisabled
                  ? 'text-zinc-600 cursor-not-allowed opacity-50'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isActive && (
                <span className="absolute inset-0 bg-teal-500/10 border border-teal-500/30 rounded-2xl -z-10 animate-fade-in"></span>
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-teal-400' : ''} transition-transform`} />
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
