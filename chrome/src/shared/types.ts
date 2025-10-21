export interface Stats {
  chordCount: number;
  pixelsSaved: number;
  totalClicks: number;
  totalMouseDistance: number;
  replyToSendTime: number;
  intentLineDistance: number;
  lastUpdated: number;
}

export interface Settings {
  sensitivity: number;
  easeInDuration: number;
  showKeyboardVisualization: boolean;
  showStatsPanel: boolean;
  enabledOnDomains: string[];
}

export const DEFAULT_STATS: Stats = {
  chordCount: 0,
  pixelsSaved: 0,
  totalClicks: 0,
  totalMouseDistance: 0,
  replyToSendTime: 0,
  intentLineDistance: 0,
  lastUpdated: Date.now()
};

export const DEFAULT_SETTINGS: Settings = {
  sensitivity: 170,
  easeInDuration: 200,
  showKeyboardVisualization: true,
  showStatsPanel: true,
  enabledOnDomains: ['mail.google.com', 'outlook.com', 'mail.yahoo.com']
};
