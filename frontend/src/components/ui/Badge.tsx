/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { MLRiskBand, StandardStatus } from '../../types';

interface MLRiskBadgeProps {
  band: MLRiskBand;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MLRiskBadge: React.FC<MLRiskBadgeProps> = ({
  band,
  size = 'md',
  className = '',
}) => {
  let bg = 'bg-[#FDF1D6]';
  let text = 'text-[#8A5A0B]';
  let border = 'border-[#EBC878]';
  let Icon = HelpCircle;

  if (band === 'Lower Concern') {
    bg = 'bg-[#E2F4EA]';
    text = 'text-[#17714A]';
    border = 'border-[#9AD3B4]';
    Icon = CheckCircle2;
  } else if (band === 'Elevated Concern') {
    bg = 'bg-[#FBE5E0]';
    text = 'text-[#A63322]';
    border = 'border-[#EDA699]';
    Icon = AlertTriangle;
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 tracking-wider gap-1.5 font-semibold',
    md: 'text-xs px-3 py-1 gap-2 font-bold tracking-wide',
    lg: 'text-sm px-4 py-2 gap-2.5 font-bold tracking-wider',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border uppercase font-mono ${bg} ${text} ${border} ${sizeClasses} ${className}`}
    >
      <Icon
        className={
          size === 'sm'
            ? 'w-3 h-3 shrink-0'
            : size === 'lg'
              ? 'w-4 h-4 shrink-0'
              : 'w-3.5 h-3.5 shrink-0'
        }
      />
      <span>{band}</span>
    </span>
  );
};

interface StandardBadgeProps {
  status: StandardStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const StandardBadge: React.FC<StandardBadgeProps> = ({
  status,
  size = 'sm',
  className = '',
}) => {
  let bg = 'bg-[#EEF3F5]';
  let text = 'text-[#4F6C76]';
  let border = 'border-[#D5E3E7]';

  if (status === 'Within range') {
    bg = 'bg-[#E2F4EA]';
    text = 'text-[#17714A]';
    border = 'border-[#9AD3B4]';
  } else if (status === 'Above range') {
    bg = 'bg-[#FBE5E0]';
    text = 'text-[#A63322]';
    border = 'border-[#EDA699]';
  } else if (status === 'Below range') {
    bg = 'bg-[#FDF1D6]';
    text = 'text-[#8A5A0B]';
    border = 'border-[#EBC878]';
  } else if (status === 'Not provided') {
    bg = 'bg-[#EEF3F5]';
    text = 'text-[#93A9B0]';
    border = 'border-[#D5E3E7]';
  }

  const sizeClasses =
    size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center rounded-full border uppercase font-mono font-semibold tracking-wider ${bg} ${text} ${border} ${sizeClasses} ${className}`}
    >
      {status === 'Not provided' ? 'NOT PROVIDED' : status}
    </span>
  );
};
