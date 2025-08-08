import type { Editor } from '@tiptap/react';

export interface EmailEditorProps {
  readonly initialContent?: string;
  readonly onChange?: (html: string) => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
}

export interface EditorState {
  readonly isToolbarVisible: boolean;
  readonly content: string;
  readonly isActive: {
    readonly bold: boolean;
    readonly italic: boolean;
    readonly underline: boolean;
    readonly bulletList: boolean;
    readonly orderedList: boolean;
    readonly taskList: boolean;
  };
}

export interface EditorActions {
  readonly toggleBold: () => void;
  readonly toggleItalic: () => void;
  readonly toggleUnderline: () => void;
  readonly toggleBulletList: () => void;
  readonly toggleOrderedList: () => void;
  readonly toggleTaskList: () => void;
  readonly getHTML: () => string;
  readonly setContent: (content: string) => void;
  readonly focus: () => void;
}

export interface ToolbarButtonProps {
  readonly onClick: () => void;
  readonly isActive: boolean;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly disabled?: boolean;
  readonly shortcut?: string;
}

export interface ToolbarProps {
  readonly editor: Editor;
  readonly isVisible: boolean;
  readonly position: { top: number; left: number };
  readonly isMobile?: boolean;
  readonly keyboardHeight?: number;
}

export type FormattingCommand = 'bold' | 'italic' | 'underline';

export interface KeyboardShortcut {
  readonly key: string;
  readonly command: FormattingCommand;
}