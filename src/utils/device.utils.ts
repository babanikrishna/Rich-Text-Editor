/**
 * Device Utilities
 * 
 * Platform and device detection utilities.
 * Handles the complexities of modern device detection including iPadOS.
 */

import { DEVICE } from '@/constants/editor.constants';

/**
 * Determines if the current device is a mobile device.
 * 
 * @returns {boolean} True if the device is mobile (iOS or Android)
 * 
 * @example
 * if (isMobileDevice()) {
 *   // Show mobile-specific UI
 * }
 */
export function isMobileDevice(): boolean {
  // Check user agent for mobile devices
  if (DEVICE.MOBILE_REGEX.test(navigator.userAgent)) {
    return true;
  }
  
  // iPad detection (iPadOS 13+ reports as MacIntel)
  const hasMultiTouch = navigator.maxTouchPoints && navigator.maxTouchPoints > DEVICE.IPAD_TOUCH_POINTS;
  const isMacPlatform = /MacIntel/.test(navigator.platform);
  
  return hasMultiTouch && isMacPlatform;
}

/**
 * Determines if the current platform is macOS.
 * 
 * @returns {boolean} True if running on macOS
 */
export function isMacOS(): boolean {
  return navigator.platform.toUpperCase().indexOf(DEVICE.MAC_PLATFORM) >= 0;
}

/**
 * Determines if the app is running in dark mode.
 * 
 * @returns {boolean} True if dark mode is preferred
 */
export function isDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Gets the appropriate keyboard shortcut modifier key.
 * 
 * @returns {string} '⌘' for Mac, 'Ctrl' for others
 */
export function getModifierKey(): string {
  return isMacOS() ? '⌘' : 'Ctrl';
}

/**
 * Formats a keyboard shortcut for display.
 * 
 * @param {string} shortcut - The shortcut string (e.g., 'Cmd+B')
 * @returns {string} Formatted shortcut with proper symbols
 * 
 * @example
 * formatShortcut('Cmd+B') // Returns '⌘B' on Mac, 'Ctrl+B' on Windows
 */
export function formatShortcut(shortcut: string): string {
  if (isMacOS()) {
    return shortcut.replace('Cmd', '⌘');
  }
  return shortcut.replace('Cmd', 'Ctrl');
}