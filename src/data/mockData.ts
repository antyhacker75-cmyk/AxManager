import { PluginItem, AppPrivilege, AndroidSetting, QuickCommand } from '../types';

export const INITIAL_PLUGINS: PluginItem[] = [
  {
    id: 'ax_reignite',
    name: 'Re-Ignite Core Module',
    version: '2.1.0',
    versionCode: 210,
    author: 'Fahrez182',
    description: 'Core background process igniter and DEX runtime injector for persistent daemon execution without system killed state.',
    enabled: true,
    needsIgnite: false,
    axeronSupport: true,
    hasWebUI: true,
    webUIUrl: 'axeron.js',
    sizeMb: 1.4,
    configProps: {
      'ignite.auto_start': 'true',
      'ignite.watchdog_interval': '5000',
      'ignite.keep_alive_priority': '-20'
    },
    logs: [
      '[INFO] Initializing Re-Ignite DEX loader...',
      '[INFO] Mounted /data/local/tmp/ax_reignite.dex',
      '[SUCCESS] Axeron background daemon re-ignited successfully!'
    ]
  },
  {
    id: 'axero_boost',
    name: 'AxeroBoost CPU & Game Governor',
    version: '1.8.4',
    versionCode: 184,
    author: 'AstroDev Team',
    description: 'Dynamic CPU governor tuning, RAM management, and frame rate stabilization for gaming workloads.',
    enabled: true,
    needsIgnite: false,
    axeronSupport: true,
    hasWebUI: true,
    webUIUrl: 'eruda.min.js',
    sizeMb: 2.8,
    configProps: {
      'governor.profile': 'performance',
      'gpu.clock_boost': 'enabled',
      'thermal.throttle_temp': '48'
    },
    logs: [
      '[INFO] Applying AxeroBoost profile: Performance Mode',
      '[INFO] CPU scaling governor set to schedutil with boosted frequencies',
      '[SUCCESS] Thermal limits adjusted.'
    ]
  },
  {
    id: 'ksu_bridge',
    name: 'KernelSU / Shizuku Bridge',
    version: '3.0.1',
    versionCode: 301,
    author: 'Rikka / Axeron',
    description: 'Provides direct Shizuku API bridge and KernelSU binder interaction for untrusted apps without root prompt popup spam.',
    enabled: true,
    needsIgnite: false,
    axeronSupport: true,
    hasWebUI: true,
    webUIUrl: 'kernelsu.js',
    sizeMb: 3.1,
    configProps: {
      'bridge.allow_all': 'false',
      'bridge.log_requests': 'true'
    },
    logs: [
      '[INFO] Shizuku Binder Service initialized on port 5555',
      '[INFO] KernelSU interface ready.'
    ]
  },
  {
    id: 'fps_thermal_shield',
    name: 'FPS & Thermal Shield Pro',
    version: '1.2.0',
    versionCode: 120,
    author: 'WashiWashi',
    description: 'Prevents thermal throttling during long gaming sessions while preventing battery drain.',
    enabled: false,
    needsIgnite: true,
    axeronSupport: true,
    hasWebUI: false,
    sizeMb: 0.9,
    configProps: {
      'thermal.mode': 'balanced'
    }
  }
];

export const INITIAL_APPS: AppPrivilege[] = [
  {
    packageName: 'com.mobile.legends',
    appName: 'Mobile Legends: Bang Bang',
    icon: '🎮',
    uid: 10245,
    isSystemApp: false,
    permissions: {
      globalSettings: true,
      secureSettings: true,
      systemSettings: true,
      androidProps: true,
      shellRestriction: false,
      keyEventBlocker: true
    }
  },
  {
    packageName: 'com.pubg.krmobile',
    appName: 'PUBG Mobile',
    icon: '🎯',
    uid: 10289,
    isSystemApp: false,
    permissions: {
      globalSettings: true,
      secureSettings: true,
      systemSettings: false,
      androidProps: true,
      shellRestriction: false,
      keyEventBlocker: true
    }
  },
  {
    packageName: 'com.miui.securitycenter',
    appName: 'Security Center',
    icon: '🛡️',
    uid: 1000,
    isSystemApp: true,
    permissions: {
      globalSettings: true,
      secureSettings: true,
      systemSettings: true,
      androidProps: true,
      shellRestriction: true,
      keyEventBlocker: false
    }
  },
  {
    packageName: 'org.mozilla.firefox',
    appName: 'Firefox Browser',
    icon: '🦊',
    uid: 10312,
    isSystemApp: false,
    permissions: {
      globalSettings: false,
      secureSettings: false,
      systemSettings: true,
      androidProps: false,
      shellRestriction: false,
      keyEventBlocker: false
    }
  },
  {
    packageName: 'com.genshinimpact.mihoyo',
    appName: 'Genshin Impact',
    icon: '⚔️',
    uid: 10350,
    isSystemApp: false,
    permissions: {
      globalSettings: true,
      secureSettings: true,
      systemSettings: true,
      androidProps: true,
      shellRestriction: true,
      keyEventBlocker: true
    }
  },
  {
    packageName: 'com.termux',
    appName: 'Termux Terminal',
    icon: '💻',
    uid: 10198,
    isSystemApp: false,
    permissions: {
      globalSettings: true,
      secureSettings: true,
      systemSettings: true,
      androidProps: true,
      shellRestriction: false,
      keyEventBlocker: false
    }
  }
];

export const INITIAL_SETTINGS: AndroidSetting[] = [
  { id: '1', category: 'Global', key: 'window_animation_scale', value: '0.5' },
  { id: '2', category: 'Global', key: 'transition_animation_scale', value: '0.5' },
  { id: '3', category: 'Global', key: 'animator_duration_scale', value: '0.5' },
  { id: '4', category: 'Global', key: 'development_settings_enabled', value: '1' },
  { id: '5', category: 'Global', key: 'adb_enabled', value: '1' },
  { id: '6', category: 'Secure', key: 'sys_storage_threshold_percentage', value: '5' },
  { id: '7', category: 'Secure', key: 'refresh_rate_mode', value: '2' },
  { id: '8', category: 'System', key: 'screen_off_timeout', value: '180000' },
  { id: '9', category: 'System', key: 'font_scale', value: '1.0' },
  { id: '10', category: 'Properties', key: 'persist.sys.axeron.active', value: 'true' },
  { id: '11', category: 'Properties', key: 'ro.hardware.egl', value: 'adreno' },
  { id: '12', category: 'Properties', key: 'debug.sf.latch_unsignaled', value: '1' }
];

export const QUICK_COMMANDS: QuickCommand[] = [
  {
    id: 'cmd_1',
    title: 'Re-Ignite Axeron Daemon',
    command: 'axeron ignite',
    description: 'Restarts the Axeron background process and refreshes all active plugins.'
  },
  {
    id: 'cmd_2',
    title: 'Check Axeron Status & PID',
    command: 'axeron status -v',
    description: 'Displays current daemon PID, uptime, active permissions, and SELinux context.'
  },
  {
    id: 'cmd_3',
    title: 'List Active Plugins',
    command: 'axeron plugin list',
    description: 'Lists all loaded modules and their execution statuses.'
  },
  {
    id: 'cmd_4',
    title: 'Flush App Caches',
    command: 'pm trim-caches 1000G',
    description: 'Frees system storage memory cache across all installed applications.'
  },
  {
    id: 'cmd_5',
    title: 'Grant System Settings Permission',
    command: 'pm grant frb.axeron.manager android.permission.WRITE_SECURE_SETTINGS',
    description: 'Grants secure settings write access via ADB shell.'
  }
];
