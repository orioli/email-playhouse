import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LineCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const IntentLine = ({ sensitivity = 80, easeIn = 50 }: { sensitivity?: number; easeIn?: number }) => {
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
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const newKeys = new Set(keysPressed);
      newKeys.add(e.key.toLowerCase());
      newKeys.add(e.code.toLowerCase());
      setKeysPressed(newKeys);

      // Check if both Q and W are pressed
      const hasQ = newKeys.has("q") || newKeys.has("keyq");
      const hasW = newKeys.has("w") || newKeys.has("keyw");

      if (hasQ && hasW && !isLineActive && !isIgnoringKeys) {
        e.preventDefault();
        createIntentLine();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const newKeys = new Set(keysPressed);
      newKeys.delete(e.key.toLowerCase());
      newKeys.delete(e.code.toLowerCase());
      setKeysPressed(newKeys);

      const releasedQ = e.key.toLowerCase() === "q" || e.code.toLowerCase() === "keyq";
      const releasedW = e.key.toLowerCase() === "w" || e.code.toLowerCase() === "keyw";

      // If line is active and either Q or W is released
      if (isLineActive && (releasedQ || releasedW)) {
        const now = Date.now();
        const releasedKey = releasedQ ? "q" : "w";

        // Check if this is the first key release or second
        if (!firstKeyReleased) {
          // First key released
          setFirstKeyReleased(releasedKey);
          setLastKeyReleaseTime(now);
        } else if (firstKeyReleased !== releasedKey) {
          // Second key released (the other key)
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
                  
                  // Show email sent notification
                  toast({
                    title: "Email sent",
                    description: "Your message has been sent successfully.",
                    duration: 10000,
                    variant: "success" as any,
                  });
                }, 250);
              }
            };
            
            requestAnimationFrame(animateLineOut);
          } else {
            // Released apart (more than threshold) - cancel with animation from button to cursor
            setIsAnimatingOut(true);
            
            // Animate the line disappearing from button side
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
              }
            };
            
            requestAnimationFrame(animateLineOut);
          }
          
          // Reset tracking
          setFirstKeyReleased(null);
          setLastKeyReleaseTime(null);
        }
      }

      // Reset ignore flag when Q or W is released
      if (releasedQ || releasedW) {
        setIsIgnoringKeys(false);
      }
    };

    const createIntentLine = () => {
      // Find the Reply button - looking for button with Reply text
      const buttons = Array.from(document.querySelectorAll("button"));
      const replyButton = buttons.find((btn) => btn.textContent?.includes("Reply") && !btn.textContent?.includes("Reply All"));
      
      if (!replyButton) return;

      const rect = replyButton.getBoundingClientRect();
      const padding = 4;
      
      // Rounded rectangle bounds (4px larger on each side)
      const rectX = rect.left - padding;
      const rectY = rect.top - padding;
      const rectWidth = rect.width + padding * 2;
      const rectHeight = rect.height + padding * 2;
      
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

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

      // Remove line after animation completes
      setTimeout(() => {
        setLine(null);
        setIsLineActive(false);
      }, 2000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [cursorPos, keysPressed, isLineActive, initialCursorPos, isIgnoringKeys]);

  if (!line || !buttonRect) return null;

  const angle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1) * (180 / Math.PI);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
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
            patternTransform={`rotate(${angle})`}
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

        <line
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="url(#stripes)"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-in fade-in duration-200"
        />

        <line
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="#10b981"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.3"
          filter="blur(4px)"
        />

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

        {/* Animated arrow at the end */}
        <g transform={`translate(${line.x2}, ${line.y2}) rotate(${angle})`}>
          <polygon
            points="0,0 -10,-5 -10,5"
            fill="#10b981"
            className="animate-pulse"
          />
        </g>
      </svg>
    </div>
  );
};
