/**
 * useEmailEditor Hook
 * 
 * Main editor hook that manages the TipTap editor instance and its state.
 * Handles platform-specific behavior for optimal mobile and desktop experience.
 */

'use client';

import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { useState, useMemo, useEffect, useRef } from 'react';
import type { EmailEditorProps, EditorState, EditorActions } from '@/types/editor';
import { EDITOR_CONFIG, SPACING, ANIMATION_DURATION } from '@/constants/editor.constants';
import { isMobileDevice } from '@/utils/device.utils';
import { calculateKeyboardHeight, getBaselineViewportHeight, debounceWithRAF } from '@/utils/keyboard.utils';

/**
 * Custom hook for email editor functionality.
 * 
 * @param {EmailEditorProps} props - Editor configuration
 * @returns {Object} Editor instance, state, actions, and platform info
 */
export function useEmailEditor(props: EmailEditorProps) {
  const { initialContent = '', onChange, disabled = false } = props;
  
  // MARK: - State Management
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(false);
  const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const baselineHeightRef = useRef<number>(0);

  // MARK: - Device Detection
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // MARK: - Virtual Keyboard Management
  useEffect(() => {
    if (!isMobile) return;

    const updateKeyboardHeight = () => {
      const baseline = baselineHeightRef.current || window.innerHeight;
      const height = calculateKeyboardHeight(baseline);
      setKeyboardHeight(height);
    };

    const debouncedUpdate = debounceWithRAF(updateKeyboardHeight);

    const initializeBaseline = () => {
      baselineHeightRef.current = getBaselineViewportHeight();
      updateKeyboardHeight();
    };

    // Initialize
    initializeBaseline();

    // Event listeners
    const visualViewport = window.visualViewport;
    if (visualViewport) {
      visualViewport.addEventListener('resize', debouncedUpdate);
      visualViewport.addEventListener('scroll', debouncedUpdate);
    }
    
    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', initializeBaseline);

    return () => {
      if (visualViewport) {
        visualViewport.removeEventListener('resize', debouncedUpdate);
        visualViewport.removeEventListener('scroll', debouncedUpdate);
      }
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', initializeBaseline);
    };
  }, [isMobile]);

  // MARK: - Editor Configuration
  const editor = useEditor({
    extensions: [
      // Core formatting
      StarterKit.configure({
        heading: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Underline,
      
      // List functionality
      BulletList.configure({
        HTMLAttributes: { class: 'bullet-list' },
      }),
      OrderedList.configure({
        HTMLAttributes: { class: 'ordered-list' },
      }),
      ListItem.configure({
        HTMLAttributes: { class: 'list-item' },
      }),
      TaskList.configure({
        HTMLAttributes: { class: 'task-list' },
      }),
      TaskItem.configure({
        HTMLAttributes: { class: 'task-item' },
        nested: true,
      }),
      
      // Placeholder
      Placeholder.configure({
        placeholder: props.placeholder || EDITOR_CONFIG.PLACEHOLDER,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    
    content: initialContent,
    editable: !disabled,
    immediatelyRender: false,
    
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[400px] px-4 py-4 text-gray-900 dark:text-gray-100',
        'data-testid': 'email-editor-content',
        style: `caret-color: ${EDITOR_CONFIG.CURSOR_COLOR}; line-height: ${EDITOR_CONFIG.LINE_HEIGHT};`,
      },
    },
    
    // MARK: - Event Handlers
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    
    onTransaction: () => {
      // Force re-render on any transaction to update toolbar state
    },
    
    onSelectionUpdate: ({ editor }) => {
      if (isMobile) return; // Mobile uses focus-based toolbar
      
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;
      
      if (hasSelection) {
        updateToolbarPosition(editor, from, to);
      }
      
      setIsToolbarVisible(hasSelection);
    },
    
    onFocus: () => {
      // Mobile: Show toolbar when editor gains focus
      if (isMobile) {
        setIsToolbarVisible(true);
      }
    },
    
    onBlur: ({ event }) => {
      const relatedTarget = event?.relatedTarget as HTMLElement;
      
      // Don't hide toolbar when clicking toolbar buttons
      if (relatedTarget?.closest('[data-testid="editor-toolbar"]')) {
        return;
      }
      
      // Hide toolbar after a delay
      setTimeout(() => setIsToolbarVisible(false), ANIMATION_DURATION.TOOLBAR_FADE);
    },
  });

  // MARK: - Toolbar Positioning
  function updateToolbarPosition(editor: any, from: number, to: number) {
    const { view } = editor;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);
    const editorRect = view.dom.getBoundingClientRect();
    
    // Center toolbar above selection
    const centerX = (start.left + end.left) / 2;
    const relativeX = centerX - editorRect.left;
    const relativeY = start.top - editorRect.top - SPACING.TOOLBAR_OFFSET;
    
    // Keep toolbar within viewport bounds
    const finalLeft = Math.max(
      SPACING.TOOLBAR_EDGE_PADDING,
      Math.min(relativeX - 75, editorRect.width - 160)
    );
    
    setToolbarPosition({
      top: relativeY,
      left: finalLeft,
    });
  }

  // MARK: - Click Outside Handler
  useEffect(() => {
    const handleClickOutside = () => {
      if (!editor?.isFocused) {
        setIsToolbarVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [editor]);

  // MARK: - Active States
  const isActive = useMemo(() => ({
    bold: editor?.isActive('bold') ?? false,
    italic: editor?.isActive('italic') ?? false,
    underline: editor?.isActive('underline') ?? false,
    bulletList: editor?.isActive('bulletList') ?? false,
    orderedList: editor?.isActive('orderedList') ?? false,
    taskList: editor?.isActive('taskList') ?? false,
  }), [editor, editor?.state.selection, editor?.state.doc]);

  // MARK: - Editor Actions
  const actions: EditorActions = useMemo(() => ({
    toggleBold: () => editor?.chain().focus().toggleBold().run(),
    toggleItalic: () => editor?.chain().focus().toggleItalic().run(),
    toggleUnderline: () => editor?.chain().focus().toggleUnderline().run(),
    toggleBulletList: () => editor?.chain().focus().toggleBulletList().run(),
    toggleOrderedList: () => editor?.chain().focus().toggleOrderedList().run(),
    toggleTaskList: () => editor?.chain().focus().toggleTaskList().run(),
    getHTML: () => editor?.getHTML() ?? '',
    setContent: (content: string) => editor?.commands.setContent(content),
    focus: () => editor?.commands.focus(),
  }), [editor]);

  // MARK: - State Assembly
  const state: EditorState = {
    isToolbarVisible,
    content: editor?.getHTML() ?? '',
    isActive,
  };

  return {
    editor,
    state,
    actions,
    toolbarPosition,
    isMobile,
    keyboardHeight,
  };
}