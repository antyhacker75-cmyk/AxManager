import React, { useState } from 'react';
import { useAxeron } from '../context/AxeronContext';
import {
  Wifi,
  Terminal,
  Shield,
  Laptop,
  Copy,
  Check,
  Play,
  ArrowLeft,
  Loader2,
  HelpCircle,
  QrCode
} from 'lucide-react';

export const ActivateScreen: React.FC = () => {
  const {
    activateViaWireless,
    activateViaTcp,
    activateViaRoot,
    tcpPort,
    setTcpPort,
    setActiveTab,
    executeCommand
  } = useAxeron();

  const [activeMethod, setActiveMethod] = useState<'wireless' | 'tcp' | 'root' | 'computer'>('wireless');

  // Wireless Debugging inputs
  const [pairingCode, setPairingCode] = useState<string>('849201');
  const [wirelessPort, setWirelessPort] = useState<string>('37891');
  const [isPairing, setIsPairing] = useState<boolean>(false);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  const adbCommand = 'adb shell sh /sdcard/Android/data/frb.axeron.manager/files/starter.sh';

  const handleWirelessPair = async () => {
    setIsPairing(true);
    const ok = await activateViaWireless(pairingCode, wirelessPort);
    setIsPairing(false);
    if (ok) setActiveTab('home');
  };

  const handleTcpConnect = async () => {
    setIsPairing(true);
    await activateViaTcp();
    setIsPairing(false);
    setActiveTab('home');
  };

  const handleRootStart = async () => {
    setIsPairing(true);
    await activateViaRoot();
    setIsPairing(false);
    setActiveTab('home');
  };

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(adbCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleRunAdbCmd = () => {
    executeCommand('sh /sdcard/Android/data/frb.axeron.manager/files/starter.sh');
    setActiveTab('quickshell');
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Top Title Bar */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setActiveTab('home')}
          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white">Activate Astro Star</h2>
          <p className="text-xs text-zinc-400">Choose your activation method</p>
        </div>
      </div>

      {/* Activation Method Selector Grid */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setActiveMethod('wireless')}
          className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
            activeMethod === 'wireless'
              ? 'bg-teal-500/15 border-teal-500/50 text-teal-300 shadow-lg shadow-teal-500/10'
              : 'glass-card border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Wifi className="w-5 h-5" />
          <div>
            <div className="text-xs font-bold text-white">Wireless Debugging</div>
            <div className="text-[10px] text-zinc-400">Android 11+ No PC needed</div>
          </div>
        </button>

        <button
          onClick={() => setActiveMethod('tcp')}
          className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
            activeMethod === 'tcp'
              ? 'bg-teal-500/15 border-teal-500/50 text-teal-300 shadow-lg shadow-teal-500/10'
              : 'glass-card border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Terminal className="w-5 h-5" />
          <div>
            <div className="text-xs font-bold text-white">TCP Debugging</div>
            <div className="text-[10px] text-zinc-400">Port 5555 network debug</div>
          </div>
        </button>

        <button
          onClick={() => setActiveMethod('root')}
          className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
            activeMethod === 'root'
              ? 'bg-teal-500/15 border-teal-500/50 text-teal-300 shadow-lg shadow-teal-500/10'
              : 'glass-card border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Shield className="w-5 h-5" />
          <div>
            <div className="text-xs font-bold text-white">Root / KernelSU</div>
            <div className="text-[10px] text-zinc-400">Direct Root Access</div>
          </div>
        </button>

        <button
          onClick={() => setActiveMethod('computer')}
          className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
            activeMethod === 'computer'
              ? 'bg-teal-500/15 border-teal-500/50 text-teal-300 shadow-lg shadow-teal-500/10'
              : 'glass-card border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Laptop className="w-5 h-5" />
          <div>
            <div className="text-xs font-bold text-white">Connect Computer</div>
            <div className="text-[10px] text-zinc-400">ADB shell starter</div>
          </div>
        </button>
      </div>

      {/* METHOD 1: WIRELESS DEBUGGING */}
      {activeMethod === 'wireless' && (
        <div className="glass-card p-5 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2 text-teal-400 font-bold text-sm">
            <Wifi className="w-4 h-4" />
            <span>Start via Wireless Debugging</span>
          </div>

          <div className="text-xs text-zinc-300 leading-relaxed space-y-2 bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800">
            <div className="font-semibold text-white">Step-by-Step Instructions:</div>
            <ol className="list-decimal list-inside space-y-1 text-zinc-400">
              <li>Open Android System Settings &gt; Developer Options</li>
              <li>Enable "Wireless Debugging" toggle</li>
              <li>Tap "Pair device with pairing code"</li>
              <li>Enter the 6-digit code and port below</li>
            </ol>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                6-Digit Pairing Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={pairingCode}
                onChange={(e) => setPairingCode(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl font-mono text-sm tracking-widest text-teal-400 focus:outline-none focus:border-teal-500"
                placeholder="e.g. 849201"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Pairing Port
              </label>
              <input
                type="text"
                value={wirelessPort}
                onChange={(e) => setWirelessPort(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl font-mono text-sm text-zinc-100 focus:outline-none focus:border-teal-500"
                placeholder="e.g. 37891"
              />
            </div>

            <button
              disabled={isPairing}
              onClick={handleWirelessPair}
              className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20 transition active:scale-[0.98]"
            >
              {isPairing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Pairing Wireless Debugger...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-5 h-5" />
                  <span>Start Pairing & Activate</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* METHOD 2: TCP DEBUGGING */}
      {activeMethod === 'tcp' && (
        <div className="glass-card p-5 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2 text-teal-400 font-bold text-sm">
            <Terminal className="w-4 h-4" />
            <span>Activate by TCP Debugging</span>
          </div>

          <p className="text-xs text-zinc-400">
            Allows Astro Star to start using local ADB TCP socket without connecting to a computer.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                TCP Port (1024 - 65535)
              </label>
              <input
                type="number"
                value={tcpPort}
                onChange={(e) => setTcpPort(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl font-mono text-sm text-teal-400 focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              disabled={isPairing}
              onClick={handleTcpConnect}
              className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-sm flex items-center justify-center space-x-2 transition active:scale-[0.98]"
            >
              {isPairing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Connect to TCP Socket</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* METHOD 3: ROOT / KERNELSU */}
      {activeMethod === 'root' && (
        <div className="glass-card p-5 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2 text-teal-400 font-bold text-sm">
            <Shield className="w-4 h-4" />
            <span>Start for Rooted Devices</span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Direct root activation using KernelSU, Magisk, or APatch su binary. Astro Star will start automatically on boot.
          </p>

          <button
            disabled={isPairing}
            onClick={handleRootStart}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-zinc-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20 transition active:scale-[0.98]"
          >
            {isPairing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Grant Root & Activate</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* METHOD 4: COMPUTER ADB */}
      {activeMethod === 'computer' && (
        <div className="glass-card p-5 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2 text-teal-400 font-bold text-sm">
            <Laptop className="w-4 h-4" />
            <span>Start by Connecting to Computer</span>
          </div>

          <p className="text-xs text-zinc-400">
            For non-rooted devices, execute the command below via ADB shell on your computer:
          </p>

          <div className="p-3.5 rounded-2xl bg-black/90 border border-zinc-800 font-mono text-xs text-teal-300 break-all select-all flex items-center justify-between">
            <span>{adbCommand}</span>
            <button
              onClick={handleCopyCmd}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition ml-2 shrink-0"
              title="Copy Command"
            >
              {copiedCmd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleRunAdbCmd}
              className="flex-1 py-3 rounded-2xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 font-bold text-xs flex items-center justify-center space-x-2 transition"
            >
              <Terminal className="w-4 h-4" />
              <span>Simulate ADB Execution</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
