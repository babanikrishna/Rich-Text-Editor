/**
 * Home Page
 * 
 * Main entry point for the email editor application.
 * Handles responsive layout and HTML preview functionality.
 */

'use client';

import { useState, useEffect } from 'react';
import { EmailComposer } from '@/components/EmailComposer';
import { isMobileDevice } from '@/utils/device.utils';

export default function Home() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isHtmlViewOpen, setIsHtmlViewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  return (
    <div className={`${isMobile ? 'fixed inset-0' : 'min-h-screen py-8 px-4'} bg-white dark:bg-black`}>
      {/* Main Content */}
      <div className={`${isMobile ? 'h-full overflow-y-auto' : 'transition-all duration-300'} ${
        isHtmlViewOpen && !isMobile ? 'mr-96' : ''
      }`}>
        <div className={isMobile ? 'min-h-full' : 'max-w-4xl mx-auto'}>
          <EmailComposer
            onSubjectChange={setSubject}
            onBodyChange={setBody}
          />
        </div>
      </div>

      {/* HTML Preview Panel - Desktop Only */}
      {!isMobile && (
        <>
          <div className={`fixed top-0 right-0 h-full bg-white dark:bg-[#1a1a1a] shadow-2xl transition-all duration-300 ${
            isHtmlViewOpen ? 'w-96 translate-x-0' : 'w-96 translate-x-full'
          }`}>
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">HTML Output</h2>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                  <code>{body || '<p>Start typing to see HTML output...</p>'}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsHtmlViewOpen(!isHtmlViewOpen)}
            className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#404040] dark:bg-[#303030] text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center ${
              isHtmlViewOpen ? 'rotate-180' : ''
            }`}
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 7L14.5 12L9.5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}
    </div>
  );
}