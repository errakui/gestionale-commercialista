'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export default function Tooltip({ text, size = 'md', position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900',
  };

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 transition-colors cursor-help focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        style={{ padding: size === 'sm' ? '2px' : size === 'md' ? '3px' : '4px' }}
      >
        <HelpCircle className={sizeClasses[size]} />
      </button>

      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
          style={{ width: 'max-content', maxWidth: '300px' }}
        >
          <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-xl">
            {text}
            <div
              className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

