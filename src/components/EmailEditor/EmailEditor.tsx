/**
 * Email Editor Component
 * 
 * Rich text editor powered by TipTap.
 * Provides different layouts for mobile and desktop.
 */

'use client';

import { EditorContent } from '@tiptap/react';
import { useEmailEditor } from '@/hooks/useEmailEditor';
import type { EmailEditorProps } from '@/types/editor';
import Toolbar from './Toolbar';

export default function EmailEditor(props: EmailEditorProps) {
  const { editor, state, toolbarPosition, isMobile, keyboardHeight } = useEmailEditor(props);

  // Loading skeleton
  if (!editor) {
    return (
      <div className="relative border border-[#e8e8e8] rounded-2xl bg-[#e8e8e8] shadow-sm">
        <div className="animate-pulse">
          <div className="h-[400px] bg-[#f5f5f5] rounded-2xl p-6">
            <div className="space-y-3">
              <div className="h-4 bg-[#d0d0d0] rounded w-3/4"></div>
              <div className="h-4 bg-[#d0d0d0] rounded w-1/2"></div>
              <div className="h-4 bg-[#d0d0d0] rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout
  if (isMobile) {
    return (
      <>
        <EditorContent 
          editor={editor}
          className="focus:outline-none"
        />
        
        {/* Spacer to prevent content being hidden behind toolbar */}
        <div
          aria-hidden
          style={{
            height: state.isToolbarVisible
              ? 'calc(56px + env(safe-area-inset-bottom))'
              : 'env(safe-area-inset-bottom)',
            transition: 'height 200ms ease-in-out',
          }}
        />
        
        {state.isToolbarVisible && (
          <Toolbar 
            editor={editor} 
            isVisible={true}
            position={toolbarPosition}
            isMobile={isMobile}
            keyboardHeight={keyboardHeight}
          />
        )}
      </>
    );
  }

  // Desktop layout
  return (
    <div className="relative overflow-visible">
      <Toolbar 
        editor={editor} 
        isVisible={state.isToolbarVisible}
        position={toolbarPosition}
        isMobile={isMobile}
        keyboardHeight={0}
      />
      
      <EditorContent 
        editor={editor}
        className="min-h-[400px] focus:outline-none"
      />
    </div>
  );
}