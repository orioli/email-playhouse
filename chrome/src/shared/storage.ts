import { Stats, Settings, DEFAULT_STATS, DEFAULT_SETTINGS } from './types';

export const storageKeys = {
  STATS: 'chord_stats',
  SETTINGS: 'chord_settings',
  KEYBOARD_POSITION: 'keyboard_position'
};

export async function saveStats(stats: Stats): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [storageKeys.STATS]: { ...stats, lastUpdated: Date.now() } }, () => {
      resolve();
    });
  });
}

export async function loadStats(): Promise<Stats> {
  return new Promise((resolve) => {
    chrome.storage.local.get([storageKeys.STATS], (result) => {
      resolve(result[storageKeys.STATS] || DEFAULT_STATS);
    });
  });
}

export async function saveSettings(settings: Settings): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [storageKeys.SETTINGS]: settings }, () => {
      resolve();
    });
  });
}

export async function loadSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([storageKeys.SETTINGS], (result) => {
      resolve(result[storageKeys.SETTINGS] || DEFAULT_SETTINGS);
    });
  });
}

export async function saveKeyboardPosition(position: { x: number; y: number }): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [storageKeys.KEYBOARD_POSITION]: position }, () => {
      resolve();
    });
  });
}

export async function loadKeyboardPosition(): Promise<{ x: number; y: number } | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get([storageKeys.KEYBOARD_POSITION], (result) => {
      resolve(result[storageKeys.KEYBOARD_POSITION] || null);
    });
  });
}

export async function clearAllData(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.clear(() => {
      chrome.storage.sync.clear(() => {
        resolve();
      });
    });
  });
}

export function onStorageChange(callback: (changes: chrome.storage.StorageChange) => void): void {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' || areaName === 'sync') {
      callback(changes);
    }
  });
}
