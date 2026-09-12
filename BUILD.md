# Grade 09 Smart Learning Hub — Windows offline app

This folder is a complete Electron + React project. Follow these steps
**once, on your Windows 11 PC**, to produce a double-click `.exe` that
runs fully offline (no internet needed after this one-time setup).

## 1. Install Node.js (one time only)

Download and install the LTS version from https://nodejs.org
(this needs internet, just this once).

## 2. Open this folder in a terminal

Right-click the project folder → "Open in Terminal" (or open
PowerShell / Command Prompt and `cd` into the folder).

## 3. Install dependencies (needs internet, one time only)

```
npm install
```

## 4. Build the offline Windows installer

```
npm run dist:win
```

This will:
- Build the app into static files (`dist/`)
- Package it with Electron
- Produce a Windows installer `.exe` inside the `release/` folder

## 5. Install and use

Run the `.exe` in `release/` (e.g. `Grade 09 Smart Learning Hub Setup 1.0.0.exe`).
It installs like any normal Windows app, adds a desktop shortcut, and
from then on **works completely offline** — all your data (profile,
notes, PDFs, quiz history, flashcards, timetable) is saved locally on
your PC via the browser's local storage inside the app window.

## Notes

- Cloud Sync / biometric login buttons in the app call a backend API
  that doesn't exist in this offline build — they'll safely show
  "offline" instead of erroring, since the app already handles that.
- If you'd rather just try it without building an installer, run
  `npm run electron:dev` for a live preview window (needs the dev
  server running, not a standalone exe).
- To rebuild after making changes, just run `npm run dist:win` again.
