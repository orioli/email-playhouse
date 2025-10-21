import React, { useState, useEffect, useCallback } from 'react';
import { saveKeyboardPosition, loadKeyboardPosition } from '../shared/storage';

const KEYBOARD_LAYOUT = [
  ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl']
];

const KEY_WIDTHS: Record<string, string> = {
  'Backspace': 'w-16',
  'Tab': 'w-14',
  'Caps': 'w-16',
  'Enter': 'w-20',
  'Shift': 'w-24',
  'Space': 'w-96',
  'Ctrl': 'w-12',
  'Alt': 'w-12',
  'Win': 'w-12',
  'Fn': 'w-12'
};

const KeyboardVisualization: React.FC = () => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadKeyboardPosition().then(savedPos => {
      if (savedPos) {
        setPosition(savedPos);
      }
    });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    setPressedKeys(prev => new Set(prev).add(key));
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newPos = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      };
      setPosition(newPos);
    }
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      saveKeyboardPosition(position);
    }
  }, [isDragging, position]);

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

  const isKeyPressed = (key: string): boolean => {
    const upperKey = key.toUpperCase();
    
    if (pressedKeys.has(upperKey)) return true;
    if (key === 'Space' && pressedKeys.has(' ')) return true;
    if (key === 'Enter' && pressedKeys.has('ENTER')) return true;
    if (key === 'Backspace' && pressedKeys.has('BACKSPACE')) return true;
    if (key === 'Tab' && pressedKeys.has('TAB')) return true;
    if (key === 'Shift' && (pressedKeys.has('SHIFT') || pressedKeys.has('SHIFTLEFT') || pressedKeys.has('SHIFTRIGHT'))) return true;
    if (key === 'Ctrl' && (pressedKeys.has('CONTROL') || pressedKeys.has('CONTROLLEFT') || pressedKeys.has('CONTROLRIGHT'))) return true;
    if (key === 'Alt' && (pressedKeys.has('ALT') || pressedKeys.has('ALTLEFT') || pressedKeys.has('ALTRIGHT'))) return true;
    
    return false;
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 999995,
        background: 'rgba(31, 41, 55, 0.95)',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(75, 85, 99, 0.5)',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
            {row.map((key, keyIndex) => {
              const pressed = isKeyPressed(key);
              const width = KEY_WIDTHS[key] || 'w-8';
              const widthPx = width === 'w-8' ? '32px' :
                            width === 'w-12' ? '48px' :
                            width === 'w-14' ? '56px' :
                            width === 'w-16' ? '64px' :
                            width === 'w-20' ? '80px' :
                            width === 'w-24' ? '96px' :
                            width === 'w-96' ? '384px' : '32px';

              return (
                <div
                  key={`${rowIndex}-${keyIndex}`}
                  style={{
                    width: widthPx,
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    transition: 'all 0.15s',
                    background: pressed 
                      ? 'linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 51, 234))'
                      : 'rgba(55, 65, 81, 0.8)',
                    color: pressed ? 'white' : 'rgba(229, 231, 235, 0.9)',
                    border: pressed 
                      ? '2px solid rgba(147, 51, 234, 0.5)'
                      : '1px solid rgba(75, 85, 99, 0.3)',
                    boxShadow: pressed 
                      ? '0 0 20px rgba(147, 51, 234, 0.6)'
                      : 'none',
                    transform: pressed ? 'translateY(-2px)' : 'none'
                  }}
                >
                  {key}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyboardVisualization;
