/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2F3A]/60 backdrop-blur-[2px]">
      <div
        className={`w-full ${maxWidthClass} bg-white rounded-[14px] border border-[#D5E3E7] shadow-[0_16px_32px_-6px_rgba(10,47,58,0.12),0_8px_16px_-4px_rgba(10,47,58,0.06)] overflow-hidden`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-dialog-title"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7F0F2] bg-[#F4F9FA]">
          <h3
            id="modal-dialog-title"
            className="text-base font-semibold text-[#0F2A33] font-display"
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-[#4F6C76] hover:text-[#0F2A33] rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
