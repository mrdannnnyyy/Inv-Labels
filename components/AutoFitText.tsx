
import React, { useState, useRef, useLayoutEffect } from 'react';

interface AutoFitTextProps {
  content: string;
  maxFontSize?: number;
  minFontSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

const AutoFitText: React.FC<AutoFitTextProps> = ({
  content,
  maxFontSize = 100,
  minFontSize = 10,
  className,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(minFontSize);

  // "BEST FIT" Physics: Grow until we hit the walls
  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    // 1. Reset
    let currentSize = minFontSize;
    text.style.fontSize = `${currentSize}px`;
    text.style.lineHeight = '1.1';
    
    // Check overflow helper
    const checkOverflow = () => (
        text.scrollHeight > container.clientHeight || 
        text.scrollWidth > container.clientWidth
    );

    // 2. Growth Loop
    // Increase size by 2px steps until it overflows
    while (!checkOverflow() && currentSize < maxFontSize) {
        currentSize += 2;
        text.style.fontSize = `${currentSize}px`;
    }

    // 3. Step Back
    // If we overflowed, step back 2px to be safe. 
    // If we hit maxFontSize without overflowing, keep it.
    if (checkOverflow()) {
        currentSize = Math.max(minFontSize, currentSize - 2);
    }
    
    setFontSize(currentSize);

  }, [content, maxFontSize, minFontSize, style?.width, style?.height]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full flex items-center justify-center overflow-hidden ${className || ''}`}
      style={{ 
          ...style,
          minHeight: '20px', 
          minWidth: '20px' 
      }}
    >
      <span 
        ref={textRef} 
        style={{ 
            fontSize: `${fontSize}px`, 
            whiteSpace: 'pre-wrap', 
            wordBreak: 'break-word',
            textAlign: style?.textAlign as any || 'center',
            lineHeight: 1.1,
            display: 'block',
            width: '100%',
            fontFamily: style?.fontFamily,
            fontWeight: style?.fontWeight,
            color: style?.color,
            textDecoration: style?.textDecoration,
        }}
      >
        {content}
      </span>
    </div>
  );
};

export default AutoFitText;
