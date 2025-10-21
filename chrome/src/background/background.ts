import { DEFAULT_SETTINGS, DEFAULT_STATS } from '../shared/types';
import { saveSettings, saveStats, loadSettings, loadStats } from '../shared/storage';

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('Email Chord Extension installed');
    
    await saveSettings(DEFAULT_SETTINGS);
    await saveStats(DEFAULT_STATS);
    
    chrome.tabs.create({
      url: 'https://mail.google.com'
    });
  } else if (details.reason === 'update') {
    console.log('Email Chord Extension updated');
    
    const settings = await loadSettings();
    const stats = await loadStats();
    
    await saveSettings({ ...DEFAULT_SETTINGS, ...settings });
    await saveStats({ ...DEFAULT_STATS, ...stats });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_STATS') {
    loadStats().then(stats => {
      sendResponse({ stats });
    });
    return true;
  }
  
  if (message.type === 'GET_SETTINGS') {
    loadSettings().then(settings => {
      sendResponse({ settings });
    });
    return true;
  }
  
  if (message.type === 'SAVE_SETTINGS') {
    saveSettings(message.settings).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (message.type === 'EXPORT_CSV') {
    loadStats().then(stats => {
      const csvContent = [
        ['Metric', 'Value'],
        ['Chord Count', stats.chordCount],
        ['Pixels Saved', stats.pixelsSaved.toFixed(0)],
        ['Total Clicks', stats.totalClicks],
        ['Mouse Distance', stats.totalMouseDistance.toFixed(0)],
        ['Reply to Send Time', `${stats.replyToSendTime}ms`],
        ['Intent Line Distance', stats.intentLineDistance.toFixed(0)]
      ]
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      chrome.downloads.download({
        url: url,
        filename: `email-chord-stats-${Date.now()}.csv`,
        saveAs: true
      }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }
});

console.log('Email Chord Extension: Background service worker loaded');
