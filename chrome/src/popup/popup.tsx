import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BarChart3, Settings as SettingsIcon, Download, RotateCcw, Keyboard, Eye, EyeOff } from 'lucide-react';
import { loadStats, loadSettings, saveSettings } from '../shared/storage';
import { Stats, Settings } from '../shared/types';
import './popup.css';

const Popup: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadStats().then(setStats);
    loadSettings().then(setSettings);
  }, []);

  const handleExportCSV = () => {
    chrome.runtime.sendMessage({ type: 'EXPORT_CSV' });
  };

  const handleResetStats = () => {
    if (confirm('Are you sure you want to reset all statistics?')) {
      const freshStats: Stats = {
        chordCount: 0,
        pixelsSaved: 0,
        totalClicks: 0,
        totalMouseDistance: 0,
        replyToSendTime: 0,
        intentLineDistance: 0,
        lastUpdated: Date.now()
      };
      chrome.storage.local.set({ chord_stats: freshStats }, () => {
        setStats(freshStats);
      });
    }
  };

  const handleSettingChange = (key: keyof Settings, value: any) => {
    if (!settings) return;
    
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const openGmail = () => {
    chrome.tabs.create({ url: 'https://mail.google.com' });
  };

  if (!stats || !settings) {
    return (
      <div style={{ width: '360px', padding: '20px', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ width: '360px', background: '#1f2937', color: 'white', fontFamily: 'system-ui' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(75, 85, 99, 0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <BarChart3 size={24} color="rgb(147, 51, 234)" />
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Email Chord</h1>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(229, 231, 235, 0.7)' }}>
          Press Z+X together to create intent lines
        </p>
      </div>

      {!showSettings ? (
        <>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '12px', color: 'rgba(229, 231, 235, 0.7)', marginBottom: '8px' }}>Chord Count</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'rgb(59, 130, 246)' }}>{stats.chordCount}</div>
              </div>
              <div style={{ background: 'rgba(147, 51, 234, 0.1)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '12px', color: 'rgba(229, 231, 235, 0.7)', marginBottom: '8px' }}>Pixels Saved</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'rgb(147, 51, 234)' }}>{stats.pixelsSaved.toFixed(0)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(55, 65, 81, 0.5)', borderRadius: '8px' }}>
                <span style={{ fontSize: '14px', color: 'rgba(229, 231, 235, 0.7)' }}>Total Clicks</span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{stats.totalClicks}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(55, 65, 81, 0.5)', borderRadius: '8px' }}>
                <span style={{ fontSize: '14px', color: 'rgba(229, 231, 235, 0.7)' }}>Mouse Distance</span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{stats.totalMouseDistance.toFixed(0)}px</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(55, 65, 81, 0.5)', borderRadius: '8px' }}>
                <span style={{ fontSize: '14px', color: 'rgba(229, 231, 235, 0.7)' }}>Reply→Send Time</span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{stats.replyToSendTime}ms</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleExportCSV}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: 'rgb(59, 130, 246)',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <Download size={16} />
                Export
              </button>
              <button
                onClick={handleResetStats}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: 'rgb(239, 68, 68)',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>

          <div style={{ padding: '20px', borderTop: '1px solid rgba(75, 85, 99, 0.5)', display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowSettings(true)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                background: 'rgba(75, 85, 99, 0.5)',
                border: '1px solid rgba(75, 85, 99, 0.3)',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <SettingsIcon size={16} />
              Settings
            </button>
            <button
              onClick={openGmail}
              style={{
                flex: 1,
                padding: '12px',
                background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 51, 234))',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Open Gmail
            </button>
          </div>
        </>
      ) : (
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Show Keyboard Visualization</span>
                <button
                  onClick={() => handleSettingChange('showKeyboardVisualization', !settings.showKeyboardVisualization)}
                  style={{
                    padding: '8px',
                    background: settings.showKeyboardVisualization ? 'rgba(34, 197, 94, 0.2)' : 'rgba(75, 85, 99, 0.5)',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: settings.showKeyboardVisualization ? 'rgb(34, 197, 94)' : 'rgba(229, 231, 235, 0.7)'
                  }}
                >
                  {settings.showKeyboardVisualization ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </label>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Show Stats Panel</span>
                <button
                  onClick={() => handleSettingChange('showStatsPanel', !settings.showStatsPanel)}
                  style={{
                    padding: '8px',
                    background: settings.showStatsPanel ? 'rgba(34, 197, 94, 0.2)' : 'rgba(75, 85, 99, 0.5)',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: settings.showStatsPanel ? 'rgb(34, 197, 94)' : 'rgba(229, 231, 235, 0.7)'
                  }}
                >
                  {settings.showStatsPanel ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </label>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Sensitivity: {settings.sensitivity}ms
              </label>
              <input
                type="range"
                min="10"
                max="200"
                value={settings.sensitivity}
                onChange={(e) => handleSettingChange('sensitivity', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Ease-in Duration: {settings.easeInDuration}ms
              </label>
              <input
                type="range"
                min="50"
                max="500"
                value={settings.easeInDuration}
                onChange={(e) => handleSettingChange('easeInDuration', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <button
            onClick={() => setShowSettings(false)}
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '12px',
              background: 'rgba(75, 85, 99, 0.5)',
              border: '1px solid rgba(75, 85, 99, 0.3)',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Back to Stats
          </button>
        </div>
      )}
    </div>
  );
};

const root = document.getElementById('popup-root');
if (root) {
  createRoot(root).render(<Popup />);
}
