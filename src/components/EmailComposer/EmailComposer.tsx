/**
 * Email Composer Component
 * 
 * Container for subject input and email editor.
 * Features a glassmorphic design for modern appearance.
 */

'use client';

import { useState } from 'react';
import { EmailEditor } from '@/components/EmailEditor';
import { EDITOR_CONFIG } from '@/constants/editor.constants';

interface EmailComposerProps {
  onSubjectChange?: (subject: string) => void;
  onBodyChange?: (html: string) => void;
}

export default function EmailComposer({ onSubjectChange, onBodyChange }: EmailComposerProps) {
  const [subject, setSubject] = useState<string>('');

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSubject = e.target.value;
    setSubject(newSubject);
    onSubjectChange?.(newSubject);
  };

  return (
    <div className="rounded-2xl shadow-sm overflow-visible backdrop-blur-xl bg-white/30 dark:bg-[#404040]/30 border border-white/20 dark:border-white/10 h-full">
      {/* Subject Input */}
      <div className="border-b border-white/20 dark:border-white/10 px-4 py-4">
        <input
          type="text"
          value={subject}
          onChange={handleSubjectChange}
          placeholder="Subject"
          className="w-full text-xl font-bold text-gray-900 dark:text-gray-100 
                     placeholder-gray-500 dark:placeholder-gray-400 
                     border-none outline-none bg-transparent"
          style={{ caretColor: EDITOR_CONFIG.CURSOR_COLOR }}
        />
      </div>

      {/* Email Editor */}
      <EmailEditor
        initialContent=""
        onChange={onBodyChange}
        placeholder="Write your email..."
      />
    </div>
  );
}