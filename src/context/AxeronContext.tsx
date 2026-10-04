import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AxeronInfo,
  ActivateStatusType,
  PluginItem,
  AppPrivilege,
  AndroidSetting,
  TerminalLog,
  ThemeColor,
  ActivateMode
} from '../types';
import { INITIAL_PLUGINS, INITIAL_APPS, INITIAL_SETTINGS, QUICK_COMMANDS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface AxeronContextType {
  // App info & state
  axeronInfo: AxeronInfo;
  activateStatus: ActivateStatusType;
  setActivateStatus: (status: ActivateStatusType) => void;
  activateMode: ActivateMode;
  setActivateMode: (mode: ActivateMode) => void;
  tcpPort: number;
  setTcpPort: (port: number) => void;

  // Actions
  reigniteService: () => Promise<boolean>;
  restartDaemon: () => void;
  shutdownAxeron: () => void;
  activateViaWireless: (pairingCode: string, port: string) => Promise<boolean>;
  activateViaTcp: () => Promise<boolean>;
  activateViaRoot: () => Promise<boolean>;

  // Plugins
  plugins: PluginItem[];
  togglePlugin: (id: string) => void;
  ignitePlugin: (id: string) => void;
  uninstallPlugin: (id: string) => void;
  installPlugin: (plugin: Partial<PluginItem>) => void;
  updatePluginConfig: (id: string, newConfig: Record<string, string>) => void;
  webUIPlugin: PluginItem | null;
  setWebUIPlugin: (plugin: PluginItem | null) => void;

  // Apps & Privileges
  apps: AppPrivilege[];
  toggleAppPermission: (packageName: string, permKey: keyof AppPrivilege['permissions']) => void;

  // Android Settings Editor
  settings: AndroidSetting[];
  addSetting: (setting: Omit<AndroidSetting, 'id'>) => void;
  updateSetting: (id: string, value: string) => void;
  deleteSetting: (id: string) => void;

  // Terminal & QuickShell
  terminalLogs: TerminalLog[];
  executeCommand: (cmd: string) => void;
  clearTerminalLogs: () => void;

  // UI Navigation & Modals
  activeTab: string;
  setActiveTab: (tab: string) => void;
  powerModalOpen: boolean;
  setPowerModalOpen: (open: boolean) => void;

  // Theme & Appearance
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  oledMode: boolean;
  setOledMode: (oled: boolean) => void;
  dynamicColor: boolean;
  setDynamicColor: (dynamic: boolean) => void;
  devMode: boolean;
  setDevMode: (dev: boolean) => void;
}

const AxeronContext = createContext<AxeronContextType | undefined>(undefined);

const INITIAL_AXERON_INFO: AxeronInfo = {
  versionCode: 14800,
  versionName: '1.4.8',
  serverInfo: {
    mode: 'ADB TCP',
    pid: 18492,
    starting: Date.now() - 252000, // 4 mins uptime
    selinuxContext: 'u:r:su:s0'
  }
};

export const AxeronProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [axeronInfo, setAxeronInfo] = useState<AxeronInfo>(INITIAL_AXERON_INFO);
  const [activateStatus, setActivateStatus] = useState<ActivateStatusType>('Running');
  const [activateMode, setActivateMode] = useState<ActivateMode>('ADB TCP');
  const [tcpPort, setTcpPort] = useState<number>(5555);

  const [plugins, setPlugins] = useState<PluginItem[]>(INITIAL_PLUGINS);
  const [apps, setApps] = useState<AppPrivilege[]>(INITIAL_APPS);
  const [settings, setSettings] = useState<AndroidSetting[]>(INITIAL_SETTINGS);

  const [webUIPlugin, setWebUIPlugin] = useState<PluginItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [powerModalOpen, setPowerModalOpen] = useState<boolean>(false);

  // Theme settings
  const [themeColor, setThemeColor] = useState<ThemeColor>('teal');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [oledMode, setOledMode] = useState<boolean>(false);
  const [dynamicColor, setDynamicColor] = useState<boolean>(false);
  const [devMode, setDevMode] = useState<boolean>(true);

  // Terminal logs
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      text: 'Astro Star (Axeron Service Daemon v1.4.8) initialized.',
      type: 'system'
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      text: 'ADB TCP connection active on port 5555. PID: 18492',
      type: 'system'
    },
    {
      id: '3',
      timestamp: new Date().toLocaleTimeString(),
      text: 'Type "axeron" or click a Quick Command macro below.',
      type: 'output'
    }
  ]);

  // Ignite / Reignite service
  const reigniteService = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setAxeronInfo((prev) => ({
          ...prev,
          serverInfo: {
            ...prev.serverInfo,
            pid: Math.floor(10000 + Math.random() * 20000),
            starting: Date.now()
          }
        }));

        setPlugins((prev) =>
          prev.map((p) => ({
            ...p,
            needsIgnite: false,
            logs: p.logs
              ? [...p.logs, `[RE-IGNITE] Service restarted at ${new Date().toLocaleTimeString()}`]
              : [`[RE-IGNITE] Service restarted at ${new Date().toLocaleTimeString()}`]
          }))
        );

        addTerminalLog('[SUCCESS] Axeron service re-ignited! PID updated.', 'system');
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
        resolve(true);
      }, 800);
    });
  };

  const restartDaemon = () => {
    setActivateStatus('Updating');
    addTerminalLog('[SYSTEM] Restarting Axeron daemon process...', 'system');
    setTimeout(() => {
      setAxeronInfo((prev) => ({
        ...prev,
        serverInfo: {
          ...prev.serverInfo,
          pid: Math.floor(10000 + Math.random() * 20000),
          starting: Date.now()
        }
      }));
      setActivateStatus('Running');
      addTerminalLog('[SYSTEM] Axeron daemon process restarted successfully!', 'system');
    }, 1200);
  };

  const shutdownAxeron = () => {
    setActivateStatus('NotRunning');
    addTerminalLog('[SYSTEM] Axeron service stopped manually by user.', 'error');
  };

  const activateViaWireless = async (pairingCode: string, port: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!pairingCode || pairingCode.length < 6) {
          addTerminalLog('[ERROR] Invalid pairing code! Must be 6 digits.', 'error');
          resolve(false);
          return;
        }
        setActivateMode('Wireless Debugging');
        setActivateStatus('Running');
        setAxeronInfo((prev) => ({
          ...prev,
          serverInfo: {
            mode: 'Wireless Debugging',
            pid: Math.floor(10000 + Math.random() * 20000),
            starting: Date.now(),
            selinuxContext: 'u:r:untrusted_app:s0'
          }
        }));
        addTerminalLog(`[SUCCESS] Connected to Wireless Debugging on port ${port || '37891'}!`, 'system');
        confetti({ particleCount: 70, spread: 80 });
        resolve(true);
      }, 1000);
    });
  };

  const activateViaTcp = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setActivateMode('ADB TCP');
        setActivateStatus('Running');
        setAxeronInfo((prev) => ({
          ...prev,
          serverInfo: {
            mode: 'ADB TCP',
            pid: Math.floor(10000 + Math.random() * 20000),
            starting: Date.now(),
            selinuxContext: 'u:r:su:s0'
          }
        }));
        addTerminalLog(`[SUCCESS] ADB TCP active on port ${tcpPort}!`, 'system');
        resolve(true);
      }, 800);
    });
  };

  const activateViaRoot = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setActivateMode('Root');
        setActivateStatus('Running');
        setAxeronInfo((prev) => ({
          ...prev,
          serverInfo: {
            mode: 'Root',
            pid: Math.floor(10000 + Math.random() * 20000),
            starting: Date.now(),
            selinuxContext: 'u:r:su:s0'
          }
        }));
        addTerminalLog('[SUCCESS] Root access granted via KernelSU/Magisk!', 'system');
        confetti({ particleCount: 80, spread: 90 });
        resolve(true);
      }, 800);
    });
  };

  // Plugins
  const togglePlugin = (id: string) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const ignitePlugin = (id: string) => {
    setPlugins((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              needsIgnite: false,
              enabled: true,
              logs: [
                ...(p.logs || []),
                `[IGNITE] Module ${p.name} ignited successfully at ${new Date().toLocaleTimeString()}`
              ]
            }
          : p
      )
    );
    addTerminalLog(`[IGNITE] Plugin ${id} ignited.`, 'system');
  };

  const uninstallPlugin = (id: string) => {
    setPlugins((prev) => prev.filter((p) => p.id !== id));
    addTerminalLog(`[UNINSTALL] Plugin ${id} removed.`, 'system');
  };

  const installPlugin = (newP: Partial<PluginItem>) => {
    const created: PluginItem = {
      id: newP.id || `custom_plugin_${Date.now()}`,
      name: newP.name || 'Custom Axeron Plugin',
      version: newP.version || '1.0.0',
      versionCode: newP.versionCode || 100,
      author: newP.author || 'User',
      description: newP.description || 'Custom installed Axeron manager module.',
      enabled: true,
      needsIgnite: false,
      axeronSupport: true,
      hasWebUI: newP.hasWebUI || false,
      webUIUrl: newP.webUIUrl,
      sizeMb: newP.sizeMb || 1.2,
      configProps: newP.configProps || { 'custom.enabled': 'true' },
      logs: ['[INSTALL] Module installed successfully via Axeron Manager.']
    };
    setPlugins((prev) => [...prev, created]);
    addTerminalLog(`[INSTALL] Plugin ${created.name} installed.`, 'system');
  };

  const updatePluginConfig = (id: string, newConfig: Record<string, string>) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, configProps: newConfig } : p))
    );
  };

  // Apps & privileges
  const toggleAppPermission = (
    packageName: string,
    permKey: keyof AppPrivilege['permissions']
  ) => {
    setApps((prev) =>
      prev.map((app) => {
        if (app.packageName === packageName) {
          return {
            ...app,
            permissions: {
              ...app.permissions,
              [permKey]: !app.permissions[permKey]
            }
          };
        }
        return app;
      })
    );
  };

  // Android Settings Editor
  const addSetting = (setting: Omit<AndroidSetting, 'id'>) => {
    const created: AndroidSetting = {
      ...setting,
      id: String(Date.now())
    };
    setSettings((prev) => [...prev, created]);
  };

  const updateSetting = (id: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value } : s))
    );
  };

  const deleteSetting = (id: string) => {
    setSettings((prev) => prev.filter((s) => s.id !== id));
  };

  // Helper to add terminal log
  const addTerminalLog = (text: string, type: TerminalLog['type'] = 'output') => {
    setTerminalLogs((prev) => [
      ...prev,
      {
        id: String(Date.now() + Math.random()),
        timestamp: new Date().toLocaleTimeString(),
        text,
        type
      }
    ]);
  };

  // Execute terminal command
  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    addTerminalLog(`$ ${trimmed}`, 'input');

    if (trimmed === 'clear') {
      setTerminalLogs([]);
      return;
    }

    if (trimmed === 'axeron' || trimmed === 'axeron help') {
      addTerminalLog(
        `Astro Star CLI (Axeron v1.4.8)\nUsage:\n  axeron ignite       Re-ignite all active modules\n  axeron status       Show status & PID\n  axeron plugin list  List installed plugins\n  axeron restart      Restart Axeron daemon process\n  axeron kill         Stop Axeron background daemon`,
        'output'
      );
      return;
    }

    if (trimmed === 'axeron ignite' || trimmed === 'reignite') {
      reigniteService();
      return;
    }

    if (trimmed === 'axeron status' || trimmed === 'axeron status -v') {
      addTerminalLog(
        `Astro Star Status:\n  Status: ${activateStatus}\n  Mode: ${axeronInfo.serverInfo.mode}\n  PID: ${axeronInfo.serverInfo.pid}\n  SELinux: ${axeronInfo.serverInfo.selinuxContext}\n  Uptime: ${Math.floor((Date.now() - axeronInfo.serverInfo.starting) / 1000)}s`,
        'output'
      );
      return;
    }

    if (trimmed === 'axeron plugin list') {
      const listStr = plugins
        .map((p) => ` - [${p.enabled ? 'ENABLED' : 'DISABLED'}] ${p.id} (v${p.version}) - ${p.name}`)
        .join('\n');
      addTerminalLog(`Installed Plugins (${plugins.length}):\n${listStr}`, 'output');
      return;
    }

    if (trimmed.startsWith('getprop')) {
      const propName = trimmed.split(' ')[1];
      if (propName) {
        const found = settings.find((s) => s.key === propName);
        addTerminalLog(found ? found.value : `[prop ${propName} not found]`, 'output');
      } else {
        const props = settings
          .filter((s) => s.category === 'Properties')
          .map((s) => `[${s.key}]: [${s.value}]`)
          .join('\n');
        addTerminalLog(props, 'output');
      }
      return;
    }

    if (trimmed.startsWith('pm list packages')) {
      const list = apps.map((a) => `package:${a.packageName}`).join('\n');
      addTerminalLog(list, 'output');
      return;
    }

    // Default bash output simulation
    setTimeout(() => {
      addTerminalLog(`[exec] Command executed successfully with exit code 0`, 'output');
    }, 200);
  };

  const clearTerminalLogs = () => {
    setTerminalLogs([]);
  };

  return (
    <AxeronContext.Provider
      value={{
        axeronInfo,
        activateStatus,
        setActivateStatus,
        activateMode,
        setActivateMode,
        tcpPort,
        setTcpPort,
        reigniteService,
        restartDaemon,
        shutdownAxeron,
        activateViaWireless,
        activateViaTcp,
        activateViaRoot,
        plugins,
        togglePlugin,
        ignitePlugin,
        uninstallPlugin,
        installPlugin,
        updatePluginConfig,
        webUIPlugin,
        setWebUIPlugin,
        apps,
        toggleAppPermission,
        settings,
        addSetting,
        updateSetting,
        deleteSetting,
        terminalLogs,
        executeCommand,
        clearTerminalLogs,
        activeTab,
        setActiveTab,
        powerModalOpen,
        setPowerModalOpen,
        themeColor,
        setThemeColor,
        darkMode,
        setDarkMode,
        oledMode,
        setOledMode,
        dynamicColor,
        setDynamicColor,
        devMode,
        setDevMode
      }}
    >
      {children}
    </AxeronContext.Provider>
  );
};

export const useAxeron = () => {
  const context = useContext(AxeronContext);
  if (!context) {
    throw new Error('useAxeron must be used within an AxeronProvider');
  }
  return context;
};
