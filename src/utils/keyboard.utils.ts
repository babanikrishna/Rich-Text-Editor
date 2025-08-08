/**
 * Keyboard Utilities
 * 
 * Handles virtual keyboard detection and management.
 * Uses the Visual Viewport API for accurate keyboard height calculation.
 */

/**
 * Calculates the height of the virtual keyboard.
 * 
 * @param {number} baselineHeight - The viewport height without keyboard
 * @returns {number} The keyboard height in pixels
 * 
 * @remarks
 * Uses Visual Viewport API when available for accurate detection.
 * Falls back to window height comparison for older browsers.
 */
export function calculateKeyboardHeight(baselineHeight: number): number {
  const visualViewport = window.visualViewport;
  
  if (visualViewport) {
    // Modern browsers with Visual Viewport API
    const visibleBottom = visualViewport.height + visualViewport.offsetTop;
    return Math.max(0, baselineHeight - visibleBottom);
  }
  
  // Fallback for older browsers
  return Math.max(0, baselineHeight - window.innerHeight);
}

/**
 * Gets the baseline viewport height (without keyboard).
 * 
 * @returns {number} The full viewport height
 * 
 * @remarks
 * This should be called when the keyboard is not visible
 * to establish a baseline for comparison.
 */
export function getBaselineViewportHeight(): number {
  const visualViewport = window.visualViewport;
  
  if (visualViewport) {
    return Math.max(window.innerHeight, visualViewport.height + visualViewport.offsetTop);
  }
  
  return window.innerHeight;
}

/**
 * Debounces a function with requestAnimationFrame.
 * 
 * @param {Function} callback - The function to debounce
 * @returns {Function} The debounced function
 * 
 * @remarks
 * Uses requestAnimationFrame for smooth animations
 * synchronized with the browser's repaint cycle.
 */
export function debounceWithRAF<T extends (...args: any[]) => void>(
  callback: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  
  return (...args: Parameters<T>) => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    
    rafId = requestAnimationFrame(() => {
      callback(...args);
      rafId = null;
    });
  };
}