import { useEffect, useState } from "react";

const KEYBOARD_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Control', 'Option', 'Command', 'Space', 'Command', 'Option', 'Control']
];

const KEY_WIDTHS: Record<string, string> = {
  'Backspace': 'w-20',
  'Tab': 'w-16',
  'CapsLock': 'w-20',
  'Enter': 'w-20',
  'Shift': 'w-24',
  'Control': 'w-14',
  'Option': 'w-14',
  'Command': 'w-16',
  'Space': 'flex-1'
};

export const KeyboardVisualization = () => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 450, y: window.innerHeight - 180 });
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

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

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

  const isKeyPressed = (key: string) => {
    const upperKey = key.toUpperCase();
    return pressedKeys.has(upperKey) || 
           (key === 'Space' && pressedKeys.has(' ')) ||
           (key === 'Enter' && pressedKeys.has('ENTER')) ||
           (key === 'Backspace' && pressedKeys.has('BACKSPACE')) ||
           (key === 'Tab' && pressedKeys.has('TAB')) ||
           (key === 'Shift' && (pressedKeys.has('SHIFT') || pressedKeys.has('SHIFTLEFT') || pressedKeys.has('SHIFTRIGHT'))) ||
           (key === 'Control' && (pressedKeys.has('CONTROL') || pressedKeys.has('CONTROLLEFT') || pressedKeys.has('CONTROLRIGHT'))) ||
           (key === 'Option' && (pressedKeys.has('ALT') || pressedKeys.has('ALTLEFT') || pressedKeys.has('ALTRIGHT'))) ||
           (key === 'Command' && (pressedKeys.has('META') || pressedKeys.has('METALEFT') || pressedKeys.has('METARIGHT')));
  };

  return (
    <div 
      className="fixed bg-gray-200 rounded-2xl shadow-2xl p-4 border border-gray-300"
      style={{ 
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '900px',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="space-y-1">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((key, keyIndex) => {
              const widthClass = KEY_WIDTHS[key] || 'w-10';
              const isPressed = isKeyPressed(key);
              
              return (
                <div
                  key={keyIndex}
                  className={`
                    ${widthClass} h-10 rounded
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
