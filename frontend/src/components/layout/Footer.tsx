/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Database, Globe2 } from 'lucide-react';
import { USE_MOCK } from '../../api/client';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[#D5E3E7] bg-[#EEF3F5]/80 text-[#4F6C76] text-xs">
      {/* Persistent Disclaimer Banner Bar */}
      <div className="bg-[#E4F7FF] border-b border-[#D5E3E7] py-2.5 px-4 text-center">
        <p className="max-w-4xl mx-auto text-[11px] sm:text-xs text-[#004B5A] leading-relaxed">
          AquaGuard AI is an educational decision-support tool. It does not
          replace certified laboratory testing or official water-quality
          authorities.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 md:pb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-center md:text-left">
          <div className="flex items-center gap-1.5 text-[#0F2A33] font-semibold">
            <Globe2 className="w-3.5 h-3.5 text-[#0F6477]" />
            <span>UN SDG 6 Target Aligned</span>
          </div>
          <span className="hidden sm:inline text-[#BFC8CC]">·</span>
          <span>Anonymous session</span>
          <span className="hidden sm:inline text-[#BFC8CC]">·</span>
          <span>Model Architecture: Calibrated GBDT v2.4</span>
        </div>

        <div className="flex items-center gap-3">
          {USE_MOCK && (
            <span
              title="VITE_USE_MOCK=true. Switch to VITE_USE_MOCK=false to connect FastAPI backend."
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-[#FFF4DE] text-[#8A5A0B] border border-[#EBC878]"
            >
              <Database className="w-3 h-3" />
              <span>Mock data — real model not connected</span>
            </span>
          )}
        </div>
      </div>
    </footer>
  );
};
