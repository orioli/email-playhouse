import { useEffect, useState } from "react";

interface LineCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const IntentLine = () => {
  const [line, setLine] = useState<LineCoordinates | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [isLineActive, setIsLineActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const newKeys = new Set(keysPressed);
      newKeys.add(e.key.toLowerCase());
      newKeys.add(e.code.toLowerCase());
      setKeysPressed(newKeys);

      // Check if both Q and W are pressed
      const hasQ = newKeys.has("q") || newKeys.has("keyq");
      const hasW = newKeys.has("w") || newKeys.has("keyw");

      if (hasQ && hasW && !isLineActive) {
        e.preventDefault();
        createIntentLine();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const newKeys = new Set(keysPressed);
      newKeys.delete(e.key.toLowerCase());
      newKeys.delete(e.code.toLowerCase());
      setKeysPressed(newKeys);

      // If line is active and either Q or W is released, hide the line immediately
      if (isLineActive) {
        const releasedQ = e.key.toLowerCase() === "q" || e.code.toLowerCase() === "keyq";
        const releasedW = e.key.toLowerCase() === "w" || e.code.toLowerCase() === "keyw";
        
        if (releasedQ || releasedW) {
          setLine(null);
          setIsLineActive(false);
        }
      }
    };

    const createIntentLine = () => {
      // Find the Reply button - looking for button with Reply text
      const buttons = Array.from(document.querySelectorAll("button"));
      const replyButton = buttons.find((btn) => btn.textContent?.includes("Reply") && !btn.textContent?.includes("Reply All"));
      
      if (!replyButton) return;

      const buttonRect = replyButton.getBoundingClientRect();
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;

      setIsLineActive(true);
      setLine({
        x1: cursorPos.x,
        y1: cursorPos.y,
        x2: buttonCenterX,
        y2: buttonCenterY,
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
  }, [cursorPos, keysPressed, isLineActive]);

  if (!line) return null;

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
