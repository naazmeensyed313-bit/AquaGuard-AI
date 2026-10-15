/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline-teal';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 select-none whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22B3C1] focus-visible:ring-offset-2';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-[8px] gap-1.5 h-8',
    md: 'text-sm px-4 py-2.5 rounded-[10px] gap-2 h-10',
    lg: 'text-base px-5 py-3 rounded-[10px] gap-2.5 h-12 font-semibold',
  }[size];

  const variantClasses = {
    primary:
      'bg-[#004B5A] text-white hover:bg-[#0B4A57] active:bg-[#0A2F3A] shadow-sm',
    secondary:
      'bg-transparent border border-[#D5E3E7] text-[#0F6477] hover:bg-[#DDF4F6] hover:border-[#A8E3E8] active:bg-[#CBE7F3]',
    ghost:
      'bg-transparent text-[#4F6C76] hover:text-[#0F2A33] hover:bg-[#EEF3F5] active:bg-[#D7F2FE]',
    danger:
      'bg-[#BA1A1A] text-white hover:bg-[#93000A] active:bg-[#720006]',
    'outline-teal':
      'bg-[#E4F7FF] border border-[#0F6477]/30 text-[#004B5A] hover:bg-[#D7F2FE]',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};
