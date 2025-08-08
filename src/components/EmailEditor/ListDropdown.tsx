/**
 * List Dropdown Component
 * 
 * Dropdown menu for list formatting options (bullet, numbered, checklist).
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { isMacOS, isDarkMode } from '@/utils/device.utils';
import { COLORS } from '@/constants/editor.constants';

interface ListDropdownProps {
  readonly editor: Editor;
}

interface ListOption {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly action: () => void;
  readonly isActive: boolean;
}

export default function ListDropdown({ editor }: ListDropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // MARK: - Platform Detection
  useEffect(() => {
    setIsMac(isMacOS());
    setIsDark(isDarkMode());
  }, []);

  // MARK: - List Options
  const listOptions: ListOption[] = [
    {
      id: 'bullet',
      label: 'List',
      icon: '•',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      id: 'numbered',
      label: 'Numbered List',
      icon: '1.',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      id: 'checklist',
      label: 'Checklist',
      icon: '☐',
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editor.isActive('taskList'),
    },
  ];

  // MARK: - Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = listOptions.find(option => option.isActive);
  const hasActiveList = Boolean(activeOption);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseDown={(e) => e.preventDefault()}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          relative w-8 h-8 flex items-center justify-center rounded-xl
          active:scale-95 transition-all duration-200 text-sm
          ${hasActiveList ? 'text-white' : 'text-[#808080] dark:text-[#b0b0b0] hover:text-[#404040] dark:hover:text-white'}
          ${showTooltip ? 'bg-[#f0f0f0] dark:bg-[#3a3a3a]' : ''}
        `}
        title="List Options"
      >
        {activeOption?.icon || '•'}
      </button>
      
      {/* Keyboard Shortcut Tooltip */}
      {showTooltip && !isOpen && (
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 
                     bg-[#2a2a2a] text-[#d0d0d0] text-xs px-2 py-1 rounded-lg 
                     whitespace-nowrap z-50 pointer-events-none"
          style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}
        >
          {isMac ? '⌘+Shift+7/8' : 'Ctrl+Shift+7/8'}
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 rounded-2xl py-1 z-30 min-w-[140px] 
                     animate-in fade-in-0 zoom-in-95 duration-150"
          style={{
            background: isDark ? COLORS.DARK.TOOLBAR : COLORS.LIGHT.SURFACE,
            boxShadow: isDark 
              ? '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          }}
        >
          {listOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                option.action();
                setIsOpen(false);
              }}
              onMouseDown={(e) => e.preventDefault()}
              className={`
                w-full px-3 py-2 text-left text-sm transition-all duration-150
                flex items-center gap-2 rounded-lg mx-1
                ${option.isActive 
                  ? 'text-white bg-[#3a3a3a] dark:bg-[#3a3a3a]'
                  : 'text-[#808080] dark:text-[#b0b0b0] hover:text-[#404040] dark:hover:text-white hover:bg-[#f0f0f0] dark:hover:bg-[#3a3a3a]'
                }
              `}
            >
              <span className="font-mono text-sm">{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}