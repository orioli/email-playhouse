import React from 'react';
import { createRoot } from 'react-dom/client';
import IntentLine from './IntentLine';
import KeyboardVisualization from './KeyboardVisualization';
import StatsPanel from './StatsPanel';
import { loadSettings } from '../shared/storage';
import './content.css';

function injectExtension() {
  const isEmailClient = 
    window.location.hostname.includes('mail.google.com') ||
    window.location.hostname.includes('outlook.com') ||
    window.location.hostname.includes('mail.yahoo.com');

  if (!isEmailClient) {
    console.log('Email Chord Extension: Not on supported email client');
    return;
  }

  loadSettings().then(settings => {
    if (!settings.enabledOnDomains.some(domain => window.location.hostname.includes(domain))) {
      console.log('Email Chord Extension: Domain not enabled in settings');
      return;
    }

    const container = document.createElement('div');
    container.id = 'email-chord-extension-root';
    container.setAttribute('data-chord-extension', 'true');
    
    const shadowRoot = container.attachShadow({ mode: 'open' });
    
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      * {
        box-sizing: border-box;
      }
    `;
    shadowRoot.appendChild(styleElement);

    const appContainer = document.createElement('div');
    shadowRoot.appendChild(appContainer);

    document.body.appendChild(container);

    const root = createRoot(appContainer);
    root.render(
      <React.StrictMode>
        {settings.showKeyboardVisualization && <KeyboardVisualization />}
        <IntentLine />
        {settings.showStatsPanel && <StatsPanel />}
      </React.StrictMode>
    );

    console.log('Email Chord Extension: Injected successfully');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectExtension);
} else {
  injectExtension();
}
