# Email Chord Chrome Extension

A Chrome extension that adds an advanced keyboard chord interaction system to Gmail and other email clients.

## Features

- **Intent Line System**: Press Z+X together to draw intent lines to email actions
- **Keyboard Visualization**: See which keys you're pressing in real-time
- **Stats Tracking**: Track chord count, pixels saved, and efficiency metrics
- **CSV Export**: Export your stats for analysis
- **Draggable UI**: All overlays can be repositioned
- **Shadow DOM Isolation**: No conflicts with email client styles

## Installation

### Development Mode

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build
   ```

3. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `chrome/dist/` folder

4. For development with auto-rebuild:
   ```bash
   npm run dev
   ```

### Production Build

```bash
npm run build
```

The production-ready extension will be in `chrome/dist/`.

## How to Use

1. Open Gmail (https://mail.google.com)
2. Press and hold **Z** and **X** keys simultaneously
3. An intent line will appear pointing to the Reply button
4. Press **SPACE** to cycle through different actions:
   - Reply
   - Reply All
   - Forward
   - Trash
   - Send
   - Search
   - Cancel
5. Release both keys to execute the action

## Keyboard Visualization

- Shows which keys are currently pressed
- Draggable to reposition
- Position is saved across sessions

## Stats Panel

- Tracks chord usage and efficiency
- Shows pixels saved by using chords
- Displays Bloomberg-style mini chart
- Export stats to CSV
- Reset stats button
- Draggable and minimizable

## Extension Popup

Click the extension icon to:
- View current stats
- Adjust sensitivity settings
- Toggle keyboard visualization
- Toggle stats panel
- Export/reset data
- Quick link to Gmail

## Supported Email Clients

- Gmail (mail.google.com)
- Outlook (outlook.com)
- Yahoo Mail (mail.yahoo.com)

## Settings

- **Sensitivity**: How quickly the chord triggers (10-200ms)
- **Ease-in Duration**: Animation duration (50-500ms)
- **Show Keyboard Visualization**: Toggle keyboard overlay
- **Show Stats Panel**: Toggle stats panel

## Architecture

- **Content Script**: Injected into email pages, renders React components in Shadow DOM
- **Background Service Worker**: Manages installation, storage, and downloads
- **Popup**: Settings and stats interface
- **Storage**: Uses chrome.storage.local for stats, chrome.storage.sync for settings

## Files Structure

```
chrome/
├── manifest.json                 # Extension configuration
├── src/
│   ├── content/
│   │   ├── content.tsx          # Main injection entry point
│   │   ├── IntentLine.tsx       # Chord interaction system
│   │   ├── KeyboardVisualization.tsx
│   │   ├── StatsPanel.tsx       # Stats tracking UI
│   │   └── gmail-selectors.ts   # Button detection logic
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.tsx            # Extension popup UI
│   │   └── popup.css
│   ├── background/
│   │   └── background.ts        # Service worker
│   └── shared/
│       ├── storage.ts           # Storage utilities
│       └── types.ts             # TypeScript types
├── build/
│   └── vite.config.ts           # Build configuration
└── dist/                        # Built extension (after npm run build)
```

## Development

### Tech Stack

- React 18
- TypeScript
- Vite (bundler)
- Recharts (stats chart)
- Lucide React (icons)
- Chrome Extensions Manifest V3

### Key Technical Features

1. **Shadow DOM Isolation**: Prevents CSS conflicts with host page
2. **Gmail Button Detection**: Uses data-tooltip and ARIA labels with fallbacks
3. **MutationObserver**: Detects dynamically loaded Gmail buttons
4. **Chrome Storage API**: Persists stats and settings across sessions
5. **CSV Export**: Uses chrome.downloads API for file downloads

### Debug Console Logs

The extension logs to the browser console:
- `Email Chord Extension: Injected successfully` - Extension loaded
- `Email Chord Extension: Not on supported email client` - Wrong domain
- `Email Chord Extension: Domain not enabled in settings` - Disabled

## Privacy

- No data is sent to external servers
- All stats and settings stored locally in your browser
- No tracking or analytics
- Open source code for transparency

## License

MIT

## Credits

Based on the Email Chord Interaction demo by Lovable.
