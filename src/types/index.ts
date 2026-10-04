export type ActivateMode = 'ADB TCP' | 'Root' | 'Wireless Debugging' | 'Shizuku';

export type ActivateStatusType = 'Running' | 'NotRunning' | 'NeedExtraStep' | 'Updating';

export interface ServerInfo {
  mode: ActivateMode;
  pid: number;
  starting: number; // timestamp
  selinuxContext: string;
}

export interface AxeronInfo {
  versionCode: number;
  versionName: string;
  serverInfo: ServerInfo;
}

export interface PluginItem {
  id: string;
  name: string;
  version: string;
  versionCode: number;
  author: string;
  description: string;
  enabled: boolean;
  needsIgnite: boolean;
  axeronSupport: boolean;
  hasWebUI: boolean;
  webUIUrl?: string;
  updateJson?: string;
  sizeMb: number;
  configProps?: Record<string, string>;
  logs?: string[];
}

export interface AppPrivilege {
  packageName: string;
  appName: string;
  icon: string; // SVG icon or emoji
  uid: number;
  isSystemApp: boolean;
  permissions: {
    globalSettings: boolean;
    secureSettings: boolean;
    systemSettings: boolean;
    androidProps: boolean;
    shellRestriction: boolean;
    keyEventBlocker: boolean;
  };
}

export interface AndroidSetting {
  id: string;
  category: 'Global' | 'Secure' | 'System' | 'Properties';
  key: string;
  value: string;
}

export interface QuickCommand {
  id: string;
  title: string;
  command: string;
  description: string;
}

export type ThemeColor = 'teal' | 'emerald' | 'cyan' | 'purple' | 'amber' | 'rose' | 'monet';

export interface TerminalLog {
  id: string;
  timestamp: string;
  text: string;
  type: 'input' | 'output' | 'error' | 'system';
}
