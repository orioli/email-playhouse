import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LineCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const IntentLine = ({ sensitivity = 70, easeIn = 200, onChordActivated, onActionConfirmed, onLineCreated, onSuggestionDiscarded }: { sensitivity?: number; easeIn?: number; onChordActivated?: () => void; onActionConfirmed?: () => void; onLineCreated?: (distance: number) => void; onSuggestionDiscarded?: () => void }) => {
  const { toast } = useToast();
  const [line, setLine] = useState<LineCoordinates | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [isLineActive, setIsLineActive] = useState(false);
  const [initialCursorPos, setInitialCursorPos] = useState({ x: 0, y: 0 });
  const [isIgnoringKeys, setIsIgnoringKeys] = useState(false);
  const [buttonRect, setButtonRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [lastKeyReleaseTime, setLastKeyReleaseTime] = useState<number | null>(null);
  const [firstKeyReleased, setFirstKeyReleased] = useState<string | null>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [targetButtonType, setTargetButtonType] = useState<'reply' | 'replyAll' | 'forward' | 'trash' | 'search' | 'cancel'>('reply');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      setCursorPos(newPos);

      // If line is active and mouse moved more than 5 pixels, hide the line
      if (isLineActive) {
        const distance = Math.sqrt(
          Math.pow(newPos.x - initialCursorPos.x, 2) + 
          Math.pow(newPos.y - initialCursorPos.y, 2)
        );
        
        if (distance > 5) {
          setLine(null);
          setIsLineActive(false);
          setIsIgnoringKeys(true); // Ignore Q+W until released
          setFirstKeyReleased(null); // Reset key tracking
          setLastKeyReleaseTime(null);
          onSuggestionDiscarded?.(); // Track discarded suggestion
          // Hide virtual cancel button
          const cancelBtn = document.getElementById('virtual-cancel-button');
          if (cancelBtn) cancelBtn.style.display = 'none';
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const newKeys = new Set(keysPressed);
      newKeys.add(e.key.toLowerCase());
      newKeys.add(e.code.toLowerCase());
      setKeysPressed(newKeys);

      // Check if both Z and X are pressed
      const hasZ = newKeys.has("z") || newKeys.has("keyz");
      const hasX = newKeys.has("x") || newKeys.has("keyx");

      if (hasZ && hasX && !isLineActive && !isIgnoringKeys) {
        e.preventDefault();
        createIntentLine();
        onChordActivated?.();
      }

      // Handle Space to cycle through targets when line is active
      if (isLineActive && (e.code.toLowerCase() === "space" || e.key === " ")) {
        e.preventDefault();
        e.stopPropagation();
        cycleTargetButton();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const newKeys = new Set(keysPressed);
      newKeys.delete(e.key.toLowerCase());
      newKeys.delete(e.code.toLowerCase());
      setKeysPressed(newKeys);

      const releasedZ = e.key.toLowerCase() === "z" || e.code.toLowerCase() === "keyz";
      const releasedX = e.key.toLowerCase() === "x" || e.code.toLowerCase() === "keyx";

      // If line is active and either Z or X is released
      if (isLineActive && (releasedZ || releasedX)) {
        const now = Date.now();
        const releasedKey = releasedZ ? "z" : "x";

    // Check if this is the first key release or second
    if (!firstKeyReleased) {
      // First key released
      setFirstKeyReleased(releasedKey);
      setLastKeyReleaseTime(now);
    } else if (firstKeyReleased !== releasedKey) {
      // Second key released - check timing regardless of order
      const timeDiff = now - (lastKeyReleaseTime || 0);
      
      if (timeDiff <= sensitivity) {
        // Released together (within threshold) - trigger the send sequence with animation
        setIsAnimatingOut(true);
        
        // Animate the line disappearing from cursor side
        const animationDuration = easeIn;
        const startTime = Date.now();
        const originalLine = line;
        
        const animateLineOut = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / animationDuration, 1);
          
          if (progress < 1 && originalLine) {
            // Interpolate from cursor (x1, y1) towards button (x2, y2)
            const newX1 = originalLine.x1 + (originalLine.x2 - originalLine.x1) * progress;
            const newY1 = originalLine.y1 + (originalLine.y2 - originalLine.y1) * progress;
            
            setLine({
              x1: newX1,
              y1: newY1,
              x2: originalLine.x2,
              y2: originalLine.y2,
            });
            
            requestAnimationFrame(animateLineOut);
          } else {
            // Animation complete - hide everything and show toast
            setLine(null);
            setIsAnimatingOut(false);
            
            setTimeout(() => {
              setButtonRect(null);
              setIsLineActive(false);
              
              // Hide virtual cancel button
              const cancelBtn = document.getElementById('virtual-cancel-button');
              if (cancelBtn) cancelBtn.style.display = 'none';
              
              // If cancel was selected, just dismiss without action
              if (targetButtonType === 'cancel') {
                return;
              }
              
              // Trigger action confirmed callback
              onActionConfirmed?.();
            }, 250);
          }
        };
        
        requestAnimationFrame(animateLineOut);
      } else {
        // Released apart (more than threshold) - cancel with animation from button to cursor
        setIsAnimatingOut(true);
        onSuggestionDiscarded?.(); // Track discarded suggestion
        
        const animationDuration = easeIn;
        const startTime = Date.now();
        const originalLine = line;
        
        const animateLineOut = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / animationDuration, 1);
          
          if (progress < 1 && originalLine) {
            // Interpolate from button (x2, y2) towards cursor (x1, y1)
            const newX2 = originalLine.x2 + (originalLine.x1 - originalLine.x2) * progress;
            const newY2 = originalLine.y2 + (originalLine.y1 - originalLine.y2) * progress;
            
            setLine({
              x1: originalLine.x1,
              y1: originalLine.y1,
              x2: newX2,
              y2: newY2,
            });
            
            requestAnimationFrame(animateLineOut);
          } else {
            // Animation complete - hide everything
            setLine(null);
            setButtonRect(null);
            setIsLineActive(false);
            setIsAnimatingOut(false);
            // Hide virtual cancel button
            const cancelBtn = document.getElementById('virtual-cancel-button');
            if (cancelBtn) cancelBtn.style.display = 'none';
          }
        };
        
        requestAnimationFrame(animateLineOut);
      }
      
      // Reset tracking
      setFirstKeyReleased(null);
      setLastKeyReleaseTime(null);
    }
  }

      // Reset ignore flag when Z or X is released
      if (releasedZ || releasedX) {
        setIsIgnoringKeys(false);
      }
    };

    const findTargetButton = (type: 'reply' | 'replyAll' | 'forward' | 'trash' | 'search' | 'cancel') => {
      const buttons = Array.from(document.querySelectorAll("button")).filter(btn => {
        // Exclude buttons inside elements with data-exclude-from-chord attribute
        return !btn.closest('[data-exclude-from-chord="true"]');
      });
      
      switch (type) {
        case 'reply':
          return buttons.find((btn) => 
            (btn.textContent?.includes("Reply") && !btn.textContent?.includes("Reply All")) ||
            btn.textContent?.includes("Send")
          );
        case 'replyAll':
          return buttons.find((btn) => btn.textContent?.includes("Reply All"));
        case 'forward':
          return buttons.find((btn) => btn.textContent?.includes("Forward"));
        case 'trash':
          // Find button containing Trash2 icon (look for SVG with specific paths)
          return buttons.find((btn) => {
            const svg = btn.querySelector('svg');
            if (!svg) return false;
            // Check if it has polyline elements (Trash2 icon characteristic)
            const hasPolyline = svg.querySelector('polyline') !== null;
            const hasPath = svg.querySelector('path') !== null;
            // Trash2 icon has both polyline and path
            return hasPolyline && hasPath && btn.getAttribute('variant') !== 'outline';
          });
        case 'search':
          // Find the search input element with more specific selector
          const searchInput = document.querySelector('input[placeholder="Search in mail"]') || 
                             document.querySelector('input[placeholder*="Search"]') || 
                             document.querySelector('input[placeholder*="search"]');
          return searchInput as HTMLElement | undefined;
        case 'cancel':
          // Return or create a virtual cancel button in the center of the screen
          let cancelButton = document.getElementById('virtual-cancel-button');
          if (!cancelButton) {
            cancelButton = document.createElement('div');
            cancelButton.id = 'virtual-cancel-button';
            cancelButton.style.position = 'fixed';
            cancelButton.style.left = '50%';
            cancelButton.style.top = '50%';
            cancelButton.style.transform = 'translate(-50%, -50%)';
            cancelButton.style.padding = '16px 24px';
            cancelButton.style.backgroundColor = '#f5f5f7';
            cancelButton.style.color = 'black';
            cancelButton.style.borderRadius = '8px';
            cancelButton.style.fontWeight = '600';
            cancelButton.style.fontSize = '14px';
            cancelButton.style.textAlign = 'center';
            cancelButton.style.zIndex = '40';
            cancelButton.style.pointerEvents = 'none';
            cancelButton.innerHTML = '<div style="font-size: 18px; font-weight: 700; color: #1f2937; padding-bottom: 12px; text-align: center;">Cheat Sheet</div><div style="border-top: 1px solid #d1d5db;"></div><div style="color: #ef4444; padding: 12px 0;">TO CANCEL: LIFT X, THEN Z</div><div style="border-top: 1px solid #d1d5db;"></div><div style="color: #10b981; padding: 12px 0;">TO ACCEPT: LIFT Z X <span style="text-decoration: underline;">AT SAME TIME</span></div><div style="border-top: 1px solid #d1d5db;"></div><div style="color: #3b82f6; padding: 12px 0;">NEXT OPTION: Z X + SPACE BAR</div>';
            document.body.appendChild(cancelButton);
          }
          cancelButton.style.display = 'block';
          return cancelButton as HTMLElement;
        default:
          return null;
      }
    };

    const cycleTargetButton = () => {
      // Check if we're in compose mode (Send button exists)
      const hasSendButton = Array.from(document.querySelectorAll("button")).some(btn => btn.textContent?.includes("Send"));
      
      // In compose mode: cycle Send → Search → Cancel
      // In email view: cycle Reply → Reply All → Forward → Trash → Search → Cancel
      const cycleOrder: Array<'reply' | 'replyAll' | 'forward' | 'trash' | 'search' | 'cancel'> = hasSendButton 
        ? ['reply', 'search', 'cancel']  // 'reply' will find Send button in compose mode
        : ['reply', 'replyAll', 'forward', 'trash', 'search', 'cancel'];
      
      const currentIndex = cycleOrder.indexOf(targetButtonType);
      const nextIndex = (currentIndex + 1) % cycleOrder.length;
      const nextType = cycleOrder[nextIndex];
      
      setTargetButtonType(nextType);
      updateIntentLine(nextType);
    };

    const updateIntentLine = (type: 'reply' | 'replyAll' | 'forward' | 'trash' | 'search' | 'cancel') => {
      // Hide cancel button if not targeting it
      const cancelBtn = document.getElementById('virtual-cancel-button');
      if (type !== 'cancel' && cancelBtn) {
        cancelBtn.style.display = 'none';
      }
      
      const targetButton = findTargetButton(type);
      if (!targetButton) return;

      const rect = targetButton.getBoundingClientRect();
      const padding = 4;
      
      const rectX = rect.left - padding;
      const rectY = rect.top - padding;
      const rectWidth = rect.width + padding * 2;
      const rectHeight = rect.height + padding * 2;
      
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const dx = buttonCenterX - cursorPos.x;
      const dy = buttonCenterY - cursorPos.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      const avgDimension = (rectWidth + rectHeight) / 4;
      const shortenedLength = length - avgDimension;
      const ratio = shortenedLength / length;
      
      const shortenedX = cursorPos.x + dx * ratio;
      const shortenedY = cursorPos.y + dy * ratio;

      setButtonRect({ x: rectX, y: rectY, width: rectWidth, height: rectHeight });
      setLine({
        x1: cursorPos.x,
        y1: cursorPos.y,
        x2: shortenedX,
        y2: shortenedY,
      });
    };

    const createIntentLine = () => {
      const targetButton = findTargetButton(targetButtonType);
      if (!targetButton) return;

      const rect = targetButton.getBoundingClientRect();
      const padding = 4;
      
      // Rounded rectangle bounds (4px larger on each side)
      const rectX = rect.left - padding;
      const rectY = rect.top - padding;
      const rectWidth = rect.width + padding * 2;
      const rectHeight = rect.height + padding * 2;
      
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      // Calculate distance (x + y, not Pythagorean)
      const distanceX = Math.abs(buttonCenterX - cursorPos.x);
      const distanceY = Math.abs(buttonCenterY - cursorPos.y);
      const totalDistance = distanceX + distanceY;
      
      // Report untraveled distance
      onLineCreated?.(totalDistance);

      // Calculate direction and shorten line to stop at rectangle edge
      const dx = buttonCenterX - cursorPos.x;
      const dy = buttonCenterY - cursorPos.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // Approximate distance to rectangle edge (using average of width/height)
      const avgDimension = (rectWidth + rectHeight) / 4;
      const shortenedLength = length - avgDimension;
      const ratio = shortenedLength / length;
      
      const shortenedX = cursorPos.x + dx * ratio;
      const shortenedY = cursorPos.y + dy * ratio;

      setInitialCursorPos(cursorPos);
      setIsLineActive(true);
      setButtonRect({ x: rectX, y: rectY, width: rectWidth, height: rectHeight });
      setLine({
        x1: cursorPos.x,
        y1: cursorPos.y,
        x2: shortenedX,
        y2: shortenedY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown, true); // Use capture phase for priority
    window.addEventListener("keyup", handleKeyUp, true); // Use capture phase for priority

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
    };
  }, [cursorPos, keysPressed, isLineActive, initialCursorPos, isIgnoringKeys, targetButtonType, line]);

  // Check which keys are currently pressed
  const isZPressed = keysPressed.has("z") || keysPressed.has("keyz");
  const isXPressed = keysPressed.has("x") || keysPressed.has("keyx");
  const isSpacePressed = keysPressed.has(" ") || keysPressed.has("space");

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Key press overlays near mouse cursor */}
      {isZPressed && (
        <div 
          className="absolute flex items-center justify-center bg-gray-400/80 rounded text-sm font-bold px-2"
          style={{
            left: cursorPos.x + 20,
            top: cursorPos.y - 15,
            height: 30,
            transform: 'translate(-50%, -50%)'
          }}
        >
          Z
        </div>
      )}
      {isXPressed && (
        <div 
          className="absolute flex items-center justify-center bg-gray-400/80 rounded text-sm font-bold px-2"
          style={{
            left: cursorPos.x + 20,
            top: cursorPos.y + 15,
            height: 30,
            transform: 'translate(-50%, -50%)'
          }}
        >
          X
        </div>
      )}
      {isSpacePressed && isLineActive && (
        <div 
          className="absolute flex items-center justify-center bg-gray-400/80 rounded text-sm font-bold px-2"
          style={{
            left: cursorPos.x + 60,
            top: cursorPos.y,
            height: 30,
            transform: 'translate(-50%, -50%)'
          }}
        >
          SPACE
        </div>
      )}
      
      {/* Intent line visualization */}
      {line && buttonRect && (
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="intentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3">
              <animate
                attributeName="offset"
                values="0;1;0"
                dur="1s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="20%" stopColor="#059669" stopOpacity="0.8">
              <animate
                attributeName="offset"
                values="0.2;1;0.2"
                dur="1s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="40%" stopColor="#10b981" stopOpacity="1">
              <animate
                attributeName="offset"
                values="0.4;1;0.4"
                dur="1s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="60%" stopColor="#059669" stopOpacity="0.8">
              <animate
                attributeName="offset"
                values="0.6;1;0.6"
                dur="1s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="80%" stopColor="#10b981" stopOpacity="0.3">
              <animate
                attributeName="offset"
                values="0.8;1;0.8"
                dur="1s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          <pattern
            id="stripes"
            patternUnits="userSpaceOnUse"
            width="20"
            height="3"
          >
            <rect width="10" height="3" fill="#10b981" />
            <rect x="10" width="10" height="3" fill="#059669" />
            <animateTransform
              attributeName="patternTransform"
              type="translate"
              from="0 0"
              to="20 0"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </pattern>
        </defs>

        {(() => {
          // Calculate screen center
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          
          // Calculate control points for S-curve
          // First control point: bias towards screen center from start point
          const cp1x = line.x1 + (centerX - line.x1) * 0.5;
          const cp1y = line.y1 + (centerY - line.y1) * 0.5;
          
          // Second control point: bias towards screen center from end point
          const cp2x = line.x2 + (centerX - line.x2) * 0.3;
          const cp2y = line.y2 + (centerY - line.y2) * 0.3;
          
          // Calculate tangent angle at the end of the curve (from cp2 to endpoint)
          const tangentAngle = Math.atan2(line.y2 - cp2y, line.x2 - cp2x) * (180 / Math.PI);
          
          // Create SVG path data for cubic bezier curve
          const pathData = `M ${line.x1} ${line.y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${line.x2} ${line.y2}`;
          
          return (
            <>
              <path
                d={pathData}
                stroke="url(#stripes)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                className="animate-in fade-in duration-200"
              />

              <path
                d={pathData}
                stroke="#10b981"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                opacity="0.3"
                filter="blur(4px)"
              />

              {/* Animated arrow at the end */}
              <g transform={`translate(${line.x2}, ${line.y2})`}>
                <g transform={`rotate(${tangentAngle}) ${targetButtonType === 'cancel' ? 'scale(-1, 1)' : ''}`}>
                  <polygon
                    points="0,0 -10,-5 -10,5"
                    fill="#10b981"
                    className="animate-pulse"
                  />
                </g>
              </g>
            </>
          );
        })()}

        {/* Rounded rectangle at the end */}
        <rect
          x={buttonRect.x}
          y={buttonRect.y}
          width={buttonRect.width}
          height={buttonRect.height}
          rx="6"
          ry="6"
          stroke="url(#stripes)"
          strokeWidth="3"
          fill="none"
          className="animate-in fade-in duration-200"
        />
        
        <rect
          x={buttonRect.x}
          y={buttonRect.y}
          width={buttonRect.width}
          height={buttonRect.height}
          rx="6"
          ry="6"
          stroke="#10b981"
          strokeWidth="5"
          fill="none"
          opacity="0.3"
          filter="blur(4px)"
        />

      </svg>
      )}
    </div>
  );
};
