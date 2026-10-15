/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StandardItem } from '../../types';

interface ParameterRangeBarProps {
  item: StandardItem;
}

export const ParameterRangeBar: React.FC<ParameterRangeBarProps> = ({ item }) => {
  const { value, status, reference_min, reference_max } = item;

  if (value === null || status === 'Not provided') {
    return null;
  }

  // If there's no formal reference min or max, don't show the range bar
  if (reference_min === undefined && reference_max === undefined) {
    return null;
  }

  // Calculate an intuitive visualization scale
  const minBound = reference_min !== undefined ? Math.max(0, reference_min * 0.5) : 0;
  const maxBound =
    reference_max !== undefined
      ? reference_max * 1.5
      : (reference_min || 1) * 2.5;

  const totalRange = maxBound - minBound;
  if (totalRange <= 0) return null;

  // Percentage of normal zone start and end
  const zoneStart = reference_min !== undefined ? ((reference_min - minBound) / totalRange) * 100 : 0;
  const zoneEnd =
    reference_max !== undefined ? ((reference_max - minBound) / totalRange) * 100 : 100;
  const zoneWidth = Math.max(5, zoneEnd - zoneStart);

  // Position of current value marker
  const markerPos = Math.max(
    2,
    Math.min(98, ((value - minBound) / totalRange) * 100)
  );

  const markerColor =
    status === 'Within range'
      ? 'bg-[#17714A]'
      : status === 'Above range'
      ? 'bg-[#A63322]'
      : 'bg-[#8A5A0B]';

  return (
    <div className="mt-2.5 pt-1">
      <div className="relative h-2 w-full bg-[#E7F0F2] rounded-full overflow-hidden">
        {/* Normal / compliant reference zone */}
        <div
          className="absolute top-0 bottom-0 bg-[#A8E3E8] rounded-full"
          style={{
            left: `${zoneStart}%`,
            width: `${zoneWidth}%`,
          }}
        />
        {/* Exceedance background gradient tint */}
        {status === 'Above range' && (
          <div
            className="absolute top-0 bottom-0 bg-[#EDA699]/40"
            style={{
              left: `${zoneEnd}%`,
              right: 0,
            }}
          />
        )}
      </div>

      {/* Floating marker dot */}
      <div className="relative h-2.5 -mt-2">
        <div
          className={`absolute top-0 w-2.5 h-2.5 rounded-full ${markerColor} ring-2 ring-white shadow-xs -translate-x-1/2 transition-all duration-300`}
          style={{ left: `${markerPos}%` }}
          title={`Measured: ${value}`}
        />
      </div>
    </div>
  );
};
