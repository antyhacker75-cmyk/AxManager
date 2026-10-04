# Astro Star - Axeron Manager (React Rewrite)

A modern React web application rewrite of **Astro Star (Axeron Manager)** — an advanced system manager, privilege intercept manager, quick shell terminal, and plugin daemon for Android.

## Features

- **Daemon Status & Controls**: Live status card (Running / Stopped / Need Fix / Updating), real-time system uptime counter, PID tracking, and Power Dialog controls (Re-ignite DEX, Restart Service, Shutdown).
- **Activation Wizard**:
  - Wireless Debugging (Android 11+) with pairing code input
  - Local ADB TCP Debugging (Port 5555)
  - Root / KernelSU / Magisk direct activation
  - ADB Computer Shell command generator
- **Privilege Intercept Manager**:
  - Per-app privilege management (Global Settings, Secure Settings, System Settings, Android Properties, Shell Restriction, Key Event Blocker)
  - Search and filter by app type (System / User / Granted)
- **Plugin Service & WebUI Host**:
  - Installed plugin manager with Enable/Disable, Ignite, WebUI Sandbox, and Property Editor
  - Embedded WebUI interface preview supporting `axeron.js`, `eruda.js`, and `kernelsu.js`
- **QuickShell Terminal**:
  - Interactive bash shell command executor with real-time log output
  - Quick macro commands (Re-ignite, PID check, Plugin list, Flush caches)
  - Copy log, clear terminal, and filter output
- **Settings & Theme Engine**:
  - Material 3 theme palette swatches (Axeron Teal, Emerald, Cyan, Purple, Amber, Rose, Monet)
  - OLED True Black & Dark Theme toggles
  - Global, Secure, System Settings and `resetprop` Properties Editor

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React Icons
