import { useEffect, useState } from "react";

const KEYBOARD_LAYOUT = [
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Opt', 'Cmd', 'Space']
];

const KEY_WIDTHS: Record<string, string> = {
  'Backspace': 'w-[72px]',
  'Tab': 'w-[58px]',
  'CapsLock': 'w-[72px]',
  'Enter': 'w-[72px]',
  'Shift': 'w-[86px]',
  'Ctrl': 'w-[50px]',
  'Opt': 'w-[50px]',
  'Cmd': 'w-[58px]',
  'Space': 'flex-1'
};

export const KeyboardVisualization = () => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight - 250 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys(prev => new Set(prev).add(e.key.toUpperCase()));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key.toUpperCase());
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown, true); // Use capture phase to receive events first
    window.addEventListener('keyup', handleKeyUp, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const isKeyPressed = (key: string) => {
    const upperKey = key.toUpperCase();
    return pressedKeys.has(upperKey) || 
           (key === 'Space' && pressedKeys.has(' ')) ||
           (key === 'Enter' && pressedKeys.has('ENTER')) ||
           (key === 'Backspace' && pressedKeys.has('BACKSPACE')) ||
           (key === 'Tab' && pressedKeys.has('TAB')) ||
           (key === 'Shift' && (pressedKeys.has('SHIFT') || pressedKeys.has('SHIFTLEFT') || pressedKeys.has('SHIFTRIGHT'))) ||
           (key === 'Ctrl' && (pressedKeys.has('CONTROL') || pressedKeys.has('CONTROLLEFT') || pressedKeys.has('CONTROLRIGHT'))) ||
           (key === 'Opt' && (pressedKeys.has('ALT') || pressedKeys.has('ALTLEFT') || pressedKeys.has('ALTRIGHT'))) ||
           (key === 'Cmd' && (pressedKeys.has('META') || pressedKeys.has('METALEFT') || pressedKeys.has('METARIGHT')));
  };

  return (
    <div 
      className="fixed bg-gray-200/80 rounded-2xl shadow-2xl p-4 border border-gray-300/80 cursor-grab active:cursor-grabbing"
      style={{ 
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        maxWidth: '810px'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="space-y-1">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((key, keyIndex) => {
              const widthClass = KEY_WIDTHS[key] || 'w-9';
              const isPressed = isKeyPressed(key);
              
              return (
                <div
                  key={keyIndex}
                  className={`
                    ${widthClass} h-9 rounded
                    flex items-center justify-center
                    text-xs font-medium
                    transition-all duration-75
                    ${isPressed 
                      ? 'bg-lime-400 text-gray-900 shadow-inner' 
                      : 'bg-gray-50 text-gray-700 shadow-sm'
                    }
                  `}
                >
                  {key === 'Space' ? '' : key}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
