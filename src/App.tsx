import React from 'react';
import { AxeronProvider, useAxeron } from './context/AxeronContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { PowerModal } from './components/PowerModal';
import { WebUIModal } from './components/WebUIModal';

import { HomeScreen } from './screens/HomeScreen';
import { ActivateScreen } from './screens/ActivateScreen';
import { PrivilegeScreen } from './screens/PrivilegeScreen';
import { PluginScreen } from './screens/PluginScreen';
import { QuickShellScreen } from './screens/QuickShellScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const MainLayout: React.FC = () => {
  const { activeTab, themeColor, oledMode } = useAxeron();

  return (
    <div className={`min-h-screen ${oledMode ? 'bg-black' : 'bg-zinc-950'} text-zinc-100 theme-${themeColor}`}>
      <Header />

      <main className="max-w-xl mx-auto px-4 pt-4">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'activate' && <ActivateScreen />}
        {activeTab === 'privilege' && <PrivilegeScreen />}
        {activeTab === 'plugin' && <PluginScreen />}
        {activeTab === 'quickshell' && <QuickShellScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
      </main>

      <BottomNav />
      <PowerModal />
      <WebUIModal />
    </div>
  );
};

export function App() {
  return (
    <AxeronProvider>
      <MainLayout />
    </AxeronProvider>
  );
}

export default App;
