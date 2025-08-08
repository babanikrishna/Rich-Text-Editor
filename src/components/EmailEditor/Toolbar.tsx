/**
 * Toolbar Component
 * 
 * Adaptive formatting toolbar that provides different experiences
 * for mobile and desktop platforms.
 * 
 * Desktop: Floating toolbar that appears above selected text
 * Mobile: Fixed toolbar that stays above the virtual keyboard
 */

'use client';

import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import type { ToolbarProps } from '@/types/editor';
import ToolbarButton from './ToolbarButton';
import ListDropdown from './ListDropdown';
import { COLORS, Z_INDEX } from '@/constants/editor.constants';
import { isDarkMode } from '@/utils/device.utils';

/**
 * Formatting toolbar with platform-specific positioning.
 * 
 * @param {ToolbarProps} props - Toolbar configuration
 * @returns {JSX.Element | null} Rendered toolbar or null
 */
export default function Toolbar({ 
  editor, 
  isVisible, 
  position, 
  isMobile, 
  keyboardHeight = 0 
}: ToolbarProps) {
  const [isDark, setIsDark] = useState(false);

  // MARK: - Theme Detection
  useEffect(() => {
    setIsDark(isDarkMode());
    
    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!isVisible || !editor) {
    return null;
  }

  // MARK: - Active States
  const isActive = {
    bold: editor.isActive('bold'),
    italic: editor.isActive('italic'),
    underline: editor.isActive('underline'),
  };

  // MARK: - Mobile Toolbar
  if (isMobile) {
    const mobileToolbar = (
      <div
        className="fixed left-0 right-0 flex items-center gap-1 justify-center w-full px-1.5 py-2 border-t transition-all duration-200"
        style={{
          zIndex: Z_INDEX.TOOLBAR_MOBILE,
          bottom: keyboardHeight > 0 ? `${keyboardHeight}px` : 'env(safe-area-inset-bottom, 0px)',
          background: isDark ? COLORS.DARK.TOOLBAR : COLORS.LIGHT.SURFACE,
          borderTopColor: isDark ? COLORS.DARK.BORDER : COLORS.LIGHT.BORDER,
          paddingBottom: keyboardHeight > 0 ? '0.5rem' : 'calc(0.5rem + env(safe-area-inset-bottom, 0px))',
        }}
        data-testid="editor-toolbar"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={isActive.bold}
          title="Bold"
          shortcut="Cmd+B"
        >
          <span className="font-bold text-sm">B</span>
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={isActive.italic}
          title="Italic"
          shortcut="Cmd+I"
        >
          <span className="italic text-sm">I</span>
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={isActive.underline}
          title="Underline"
          shortcut="Cmd+U"
        >
          <span className="underline text-sm">U</span>
        </ToolbarButton>
        
        <div className="w-px h-6 bg-[#606060] mx-1" />
        
        <ListDropdown editor={editor} />
      </div>
    );

    // Render via portal for proper z-index handling
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      return createPortal(mobileToolbar, document.body);
    }
    return mobileToolbar;
  }

  // MARK: - Desktop Toolbar
  return (
    <div 
      className="absolute flex items-center gap-1 rounded-2xl px-1.5 py-1 animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        zIndex: Z_INDEX.TOOLBAR_DESKTOP,
        top: `${position.top}px`,
        left: `${position.left}px`,
        background: isDark
          ? 'linear-gradient(180deg, #4a4a4a 0%, transparent 100%) border-box, #343434'
          : '#ebebeb',
        backgroundClip: isDark ? 'padding-box, border-box' : undefined,
        border: '1px solid transparent',
        boxShadow: isDark
          ? '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2)'
          : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
      }}
      data-testid="editor-toolbar"
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={isActive.bold}
        title="Bold"
        shortcut="Cmd+B"
      >
        <span className="font-bold text-sm">B</span>
      </ToolbarButton>
      
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={isActive.italic}
        title="Italic"
        shortcut="Cmd+I"
      >
        <span className="italic text-sm">I</span>
      </ToolbarButton>
      
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={isActive.underline}
        title="Underline"
        shortcut="Cmd+U"
      >
        <span className="underline text-sm">U</span>
      </ToolbarButton>
      
      <div className="w-px h-6 bg-[#606060] mx-1" />
      
      <ListDropdown editor={editor} />
    </div>
  );
}