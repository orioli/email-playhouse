import React, { useState, useEffect, useCallback } from 'react';
import { findGmailButton, createCancelButton, removeCancelButton, ButtonType } from './gmail-selectors';
import { loadSettings, saveStats, loadStats } from '../shared/storage';
import { Settings, Stats } from '../shared/types';

interface LineCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const IntentLine: React.FC = () => {
  const [line, setLine] = useState<LineCoordinates | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [activeLine, setActiveLine] = useState(false);
  const [targetButtonType, setTargetButtonType] = useState<ButtonType>('reply');
  const [settings, setSettings] = useState<Settings | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    loadSettings().then(setSettings);
    loadStats().then(setStats);
  }, []);

  const updateStats = useCallback(async (updates: Partial<Stats>) => {
    if (!stats) return;
    
    const newStats = { ...stats, ...updates };
    setStats(newStats);
    await saveStats(newStats);
  }, [stats]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    
    if (activeLine && line) {
      const distance = Math.sqrt(
        Math.pow(e.clientX - line.x1, 2) + Math.pow(e.clientY - line.y1, 2)
      );
      
      if (distance > 100) {
        setActiveLine(false);
        setLine(null);
        removeCancelButton();
      }
    }
  }, [activeLine, line]);

  const findTargetButton = useCallback((type: ButtonType): HTMLElement | null => {
    if (type === 'cancel') {
      return createCancelButton();
    }
    return findGmailButton(type);
  }, []);

  const cycleTargetButton = useCallback(() => {
    const types: ButtonType[] = ['reply', 'replyAll', 'forward', 'trash', 'send', 'search', 'cancel'];
    const currentIndex = types.indexOf(targetButtonType);
    const nextIndex = (currentIndex + 1) % types.length;
    setTargetButtonType(types[nextIndex]);
  }, [targetButtonType]);

  const updateIntentLine = useCallback(() => {
    const targetButton = findTargetButton(targetButtonType);
    if (!targetButton || !line) return;

    const targetRect = targetButton.getBoundingClientRect();
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    setLine(prev => prev ? { ...prev, x2: targetX, y2: targetY } : null);
  }, [targetButtonType, line, findTargetButton]);

  const createIntentLine = useCallback(() => {
    const targetButton = findTargetButton(targetButtonType);
    if (!targetButton) return;

    const targetRect = targetButton.getBoundingClientRect();
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    const angle = Math.atan2(targetY - cursorPos.y, targetX - cursorPos.x);
    const lineLength = 50;
    const x2 = cursorPos.x + Math.cos(angle) * lineLength;
    const y2 = cursorPos.y + Math.sin(angle) * lineLength;

    setLine({
      x1: cursorPos.x,
      y1: cursorPos.y,
      x2,
      y2
    });
    setActiveLine(true);
  }, [cursorPos, targetButtonType, findTargetButton]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    setKeysPressed(prev => new Set(prev).add(key));

    if (key === 'z' || key === 'x') {
      const newKeys = new Set(keysPressed).add(key);
      
      if (newKeys.has('z') && newKeys.has('x') && !activeLine) {
        createIntentLine();
      }
    }

    if (key === ' ' && activeLine) {
      e.preventDefault();
      cycleTargetButton();
    }
  }, [keysPressed, activeLine, createIntentLine, cycleTargetButton]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    
    if ((key === 'z' || key === 'x') && activeLine && line) {
      const wasSimultaneous = keysPressed.has('z') && keysPressed.has('x');
      
      setKeysPressed(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });

      if (wasSimultaneous && settings) {
        const targetButton = findTargetButton(targetButtonType);
        if (targetButton) {
          const targetRect = targetButton.getBoundingClientRect();
          const lineDistance = Math.sqrt(
            Math.pow(targetRect.left + targetRect.width / 2 - line.x1, 2) +
            Math.pow(targetRect.top + targetRect.height / 2 - line.y1, 2)
          );

          updateStats({
            chordCount: (stats?.chordCount || 0) + 1,
            pixelsSaved: (stats?.pixelsSaved || 0) + lineDistance,
            totalClicks: (stats?.totalClicks || 0) + 1,
            intentLineDistance: (stats?.intentLineDistance || 0) + lineDistance
          });

          if (targetButtonType !== 'cancel') {
            targetButton.click();
          }
        }

        setTimeout(() => {
          setActiveLine(false);
          setLine(null);
          removeCancelButton();
        }, 200);
      }
    } else {
      setKeysPressed(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  }, [activeLine, line, keysPressed, settings, stats, targetButtonType, findTargetButton, updateStats]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleMouseMove, handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (activeLine) {
      const interval = setInterval(updateIntentLine, 16);
      return () => clearInterval(interval);
    }
  }, [activeLine, updateIntentLine]);

  if (!activeLine || !line || !settings) return null;

  const targetButton = findTargetButton(targetButtonType);
  const targetRect = targetButton?.getBoundingClientRect();

  return (
    <>
      <div
        style={{
          position: 'fixed',
          left: `${cursorPos.x - 20}px`,
          top: `${cursorPos.y - 60}px`,
          zIndex: 999998,
          pointerEvents: 'none'
        }}
      >
        {keysPressed.has('z') && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '4px'
          }}>
            Z
          </div>
        )}
        {keysPressed.has('x') && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            X
          </div>
        )}
        {keysPressed.has(' ') && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            marginTop: '4px'
          }}>
            SPACE
          </div>
        )}
      </div>

      <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 999997
        }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={`M ${line.x1} ${line.y1} Q ${(line.x1 + line.x2) / 2} ${(line.y1 + line.y2) / 2 - 50}, ${line.x2} ${line.y2}`}
          stroke="url(#lineGradient)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
        />

        <circle
          cx={line.x2}
          cy={line.y2}
          r="6"
          fill="rgb(147, 51, 234)"
          filter="url(#glow)"
        />
      </svg>

      {targetRect && (
        <div
          style={{
            position: 'fixed',
            left: `${targetRect.left - 4}px`,
            top: `${targetRect.top - 4}px`,
            width: `${targetRect.width + 8}px`,
            height: `${targetRect.height + 8}px`,
            border: '2px solid rgb(147, 51, 234)',
            borderRadius: '8px',
            pointerEvents: 'none',
            zIndex: 999996,
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.5)'
          }}
        />
      )}
    </>
  );
};

export default IntentLine;
