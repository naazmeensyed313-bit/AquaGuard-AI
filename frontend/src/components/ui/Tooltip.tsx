/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      {children || (
        <button
          type="button"
          aria-label="More information"
          className="text-[#93A9B0] hover:text-[#0F6477] transition-colors p-0.5 rounded cursor-help"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      )}

      {isOpen && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-64 max-w-xs p-2.5 bg-[#0A2F3A] text-white text-xs rounded-lg shadow-lg pointer-events-none transition-opacity duration-150 leading-relaxed font-sans"
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0A2F3A]" />
        </div>
      )}
    </div>
  );
};
