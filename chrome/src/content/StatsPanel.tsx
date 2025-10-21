import React, { useState, useEffect } from 'react';
import { BarChart3, X, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { loadStats, saveStats, loadSettings } from '../shared/storage';
import { Stats, Settings } from '../shared/types';

const StatsPanel: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 20 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadStats().then(setStats);
    loadSettings().then(setSettings);

    const interval = setInterval(() => {
      loadStats().then(setStats);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  }, [isDragging, dragOffset]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const exportToCSV = () => {
    if (!stats) return;

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
    });
  };

  const resetStats = async () => {
    const freshStats: Stats = {
      chordCount: 0,
      pixelsSaved: 0,
      totalClicks: 0,
      totalMouseDistance: 0,
      replyToSendTime: 0,
      intentLineDistance: 0,
      lastUpdated: Date.now()
    };
    await saveStats(freshStats);
    setStats(freshStats);
  };

  if (!stats || !settings) return null;

  const chartData = [
    { name: 'Start', value: 0 },
    { name: '', value: stats.chordCount * 0.3 },
    { name: '', value: stats.chordCount * 0.6 },
    { name: 'Now', value: stats.chordCount }
  ];

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMinimized ? '200px' : '380px',
        background: 'rgba(31, 41, 55, 0.98)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(75, 85, 99, 0.5)',
        zIndex: 999994,
        cursor: isDragging ? 'grabbing' : 'grab',
        backdropFilter: 'blur(10px)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={20} color="rgb(147, 51, 234)" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Email Chord Stats</h3>
        </div>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          style={{
            background: 'rgba(75, 85, 99, 0.5)',
            border: 'none',
            borderRadius: '6px',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'white'
          }}
        >
          {isMinimized ? <BarChart3 size={16} /> : <Minus size={16} />}
        </button>
      </div>

      {!isMinimized && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(229, 231, 235, 0.7)', marginBottom: '4px' }}>Chord Count</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'rgb(59, 130, 246)' }}>{stats.chordCount}</div>
            </div>
            <div style={{ background: 'rgba(147, 51, 234, 0.1)', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(229, 231, 235, 0.7)', marginBottom: '4px' }}>Pixels Saved</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'rgb(147, 51, 234)' }}>{stats.pixelsSaved.toFixed(0)}</div>
            </div>
          </div>

          <div style={{ height: '80px', marginBottom: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="rgb(147, 51, 234)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: 'rgba(229, 231, 235, 0.7)' }}>Total Clicks</span>
              <span style={{ fontWeight: '600' }}>{stats.totalClicks}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: 'rgba(229, 231, 235, 0.7)' }}>Mouse Distance</span>
              <span style={{ fontWeight: '600' }}>{stats.totalMouseDistance.toFixed(0)}px</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: 'rgba(229, 231, 235, 0.7)' }}>Reply→Send Time</span>
              <span style={{ fontWeight: '600' }}>{stats.replyToSendTime}ms</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={exportToCSV}
              style={{
                flex: 1,
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                padding: '8px',
                color: 'rgb(59, 130, 246)',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Export CSV
            </button>
            <button
              onClick={resetStats}
              style={{
                flex: 1,
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '8px',
                color: 'rgb(239, 68, 68)',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsPanel;
