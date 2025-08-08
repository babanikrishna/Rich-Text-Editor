/**
 * Editor Constants
 * 
 * Central configuration for the email editor application.
 * Following Apple's practice of centralizing magic numbers and configuration.
 */

// MARK: - Timing Constants
export const ANIMATION_DURATION = {
  /** Keyboard show/hide animation duration matching iOS default */
  KEYBOARD: 300,
  /** Toolbar fade in/out animation */
  TOOLBAR_FADE: 200,
  /** Content transitions */
  CONTENT: 300,
} as const;

// MARK: - Spacing Constants
export const SPACING = {
  /** Toolbar distance from selected text on desktop */
  TOOLBAR_OFFSET: 60,
  /** Minimum toolbar padding from viewport edges */
  TOOLBAR_EDGE_PADDING: 10,
  /** Toolbar button dimensions */
  BUTTON_SIZE: 32,
} as const;

// MARK: - Colors
export const COLORS = {
  // Light mode
  LIGHT: {
    BACKGROUND: '#ffffff',
    SURFACE: '#e8e8e8',
    BORDER: '#d0d0d0',
    TEXT: {
      PRIMARY: '#404040',
      SECONDARY: '#808080',
      DISABLED: '#bebebe',
    },
    SELECTION: {
      BACKGROUND: '#d6d6d6',
      TEXT: '#7a7a7a',
    },
  },
  // Dark mode
  DARK: {
    BACKGROUND: '#000000',
    SURFACE: '#404040',
    TOOLBAR: '#2a2a2a',
    BORDER: '#505050',
    TEXT: {
      PRIMARY: '#ffffff',
      SECONDARY: '#b0b0b0',
      DISABLED: '#898989',
    },
    SELECTION: {
      BACKGROUND: 'rgba(84, 84, 84, 0.99)',
      TEXT: '#b8b8b8',
    },
  },
} as const;

// MARK: - Device Detection
export const DEVICE = {
  /** Regular expression for mobile user agents */
  MOBILE_REGEX: /iPhone|iPad|iPod|Android/i,
  /** Minimum touch points for iPad detection */
  IPAD_TOUCH_POINTS: 2,
  /** Platform string for Mac devices */
  MAC_PLATFORM: 'MAC',
} as const;

// MARK: - Editor Configuration
export const EDITOR_CONFIG = {
  /** Minimum height for editor content area */
  MIN_HEIGHT: 400,
  /** Cursor color matching iOS orange */
  CURSOR_COLOR: '#f97316',
  /** Line height for comfortable reading */
  LINE_HEIGHT: 1.5,
  /** Placeholder text */
  PLACEHOLDER: 'Write your email...',
} as const;

// MARK: - Z-Index Layers
export const Z_INDEX = {
  /** Desktop floating toolbar */
  TOOLBAR_DESKTOP: 20,
  /** Mobile fixed toolbar */
  TOOLBAR_MOBILE: 9999,
  /** Dropdown menus */
  DROPDOWN: 30,
  /** Modal panels */
  PANEL: 40,
} as const;