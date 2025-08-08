/**
 * Toolbar Button Component
 * 
 * Button with hover state and keyboard shortcut tooltip.
 */

import { memo, useState } from 'react';
import type { ToolbarButtonProps } from '@/types/editor';
import { formatShortcut } from '@/utils/device.utils';

const ToolbarButton = memo(function ToolbarButton({
  onClick,
  isActive,
  title,
  children,
  disabled = false,
  shortcut,
}: ToolbarButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title={title}
        disabled={disabled}
        className={`
          relative w-8 h-8 flex items-center justify-center rounded-xl
          active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          ${isActive 
            ? 'text-white' 
            : 'text-[#808080] dark:text-[#b0b0b0] hover:text-[#404040] dark:hover:text-white'
          }
          ${showTooltip ? 'bg-[#f0f0f0] dark:bg-[#3a3a3a]' : ''}
        `}
      >
        {children}
      </button>
      
      {/* Keyboard shortcut tooltip */}
      {showTooltip && shortcut && (
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 
                     bg-[#2a2a2a] text-[#d0d0d0] text-xs px-2 py-1 rounded-lg 
                     whitespace-nowrap z-50 pointer-events-none"
          style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}
        >
          {formatShortcut(shortcut)}
        </div>
      )}
    </div>
  );
});

export default ToolbarButton;