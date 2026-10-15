/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'inset' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-[14px] transition-all duration-150 relative';

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
  }[padding];

  const variantClasses = {
    default:
      'bg-white border border-[#D5E3E7] shadow-[0_1px_3px_0_rgba(11,74,87,0.04),0_1px_2px_-1px_rgba(11,74,87,0.03)]',
    inset:
      'bg-[#EEF3F5] border border-[#D5E3E7]',
    interactive:
      'bg-white border border-[#D5E3E7] hover:border-[#22B3C1] shadow-[0_1px_3px_0_rgba(11,74,87,0.04)] hover:shadow-[0_4px_12px_-2px_rgba(11,74,87,0.08)] cursor-pointer',
  }[variant];

  return (
    <div className={`${baseClasses} ${variantClasses} ${paddingClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};
