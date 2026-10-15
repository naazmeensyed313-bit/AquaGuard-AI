/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Scale } from 'lucide-react';
import { MLScreeningResult } from '../../types';
import { Tooltip } from '../ui/Tooltip';

interface GaugeChartProps {
  ml: MLScreeningResult;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ ml }) => {
  const { score, classifierBias, calloutText } = ml;
  // Score is between 0.00 and 1.00
  const clampedScore = Math.max(0, Math.min(1, score));
  const pointerPercentage = clampedScore * 100;

  return (
    <div className="space-y-4">
      {/* Top Readout Row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#4F6C76] font-medium mb-1">
            <span>Model Risk Classifier Score</span>
            <Tooltip content="Empirical risk probability index between 0.00 and 1.00 produced by calibrated gradient boosting trees." />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl sm:text-4xl font-bold text-[#0F2A33] tracking-tight">
              {score.toFixed(2)}
            </span>
            <span className="text-xs sm:text-sm text-[#4F6C76] font-medium">
              / 1.00 index
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] tracking-wider uppercase font-mono font-semibold text-[#6F797C] block">
            CLASSIFIER BIAS
          </span>
          <span className="text-xs sm:text-sm font-semibold text-[#0F2A33]">
            {classifierBias}
          </span>
        </div>
      </div>

      {/* Horizontal Multi-Zone Gauge Track */}
      <div className="pt-2 pb-1">
        {/* Track Bar with 3 zones */}
        <div className="relative h-4 sm:h-5 rounded-full overflow-hidden flex shadow-inner border border-[#D5E3E7]/60">
          {/* Zone 1: 0.00 to 0.40 - Elevated Concern (Coral / Red) */}
          <div
            className="h-full bg-[#FBE5E0] transition-all"
            style={{ width: '40%' }}
            title="Elevated Concern Zone (0.00 – 0.40)"
          />
          {/* Zone 2: 0.40 to 0.60 - Inconclusive / Neutral Band (Tan / Amber) */}
          <div
            className="h-full bg-[#FDF1D6] transition-all border-x border-[#D5E3E7]/40"
            style={{ width: '20%' }}
            title="Neutral / Inconclusive Band (0.40 – 0.60)"
          />
          {/* Zone 3: 0.60 to 1.00 - Lower Concern (Mint / Green) */}
          <div
            className="h-full bg-[#E2F4EA] transition-all"
            style={{ width: '40%' }}
            title="Lower Concern Zone (0.60 – 1.00)"
          />

          {/* Pointer indicator pin on the gauge bar */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-[#0A2F3A] -translate-x-1/2 shadow-sm pointer-events-none"
            style={{ left: `${pointerPercentage}%` }}
          />
        </div>

        {/* Pointer indicator triangle underneath track */}
        <div className="relative h-4 mt-0.5">
          <div
            className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
            style={{ left: `${pointerPercentage}%` }}
          >
            <div className="w-0 h-0 border-x-4 border-x-transparent border-b-6 border-b-[#0A2F3A]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#0A2F3A] mt-0.5" />
          </div>
        </div>

        {/* Scale Numbers & Bounds */}
        <div className="flex justify-between items-center text-[11px] font-mono text-[#6F797C] px-0.5 mt-0.5">
          <span>0.00</span>
          <span className="relative -left-2">0.40</span>
          <span className="relative left-2">0.60</span>
          <span>1.00</span>
        </div>

        {/* Zone descriptive text */}
        <div className="flex justify-between items-center text-xs font-semibold mt-1">
          <span className="text-[#A63322]">Elevated Concern</span>
          <span className="text-[#17714A]">Lower Concern</span>
        </div>

        <p className="text-[11px] text-[#6F797C] text-center italic mt-2.5">
          0.40 and 0.60 represent empirical decision thresholds calibrated on
          validation splits.
        </p>
      </div>

      {/* Callout box */}
      {calloutText && (
        <div className="flex items-start gap-3 p-3.5 rounded-[10px] bg-[#E4F7FF] border border-[#BFC8CC]/50 text-xs text-[#004B5A] leading-relaxed">
          <Scale className="w-4 h-4 shrink-0 text-[#0F6477] mt-0.5" />
          <p>{calloutText}</p>
        </div>
      )}
    </div>
  );
};
