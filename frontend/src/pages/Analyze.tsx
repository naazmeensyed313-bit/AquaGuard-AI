/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WaterSampleForm } from '../components/forms/WaterSampleForm';
import { Settings } from 'lucide-react';

export const AnalyzePage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Kicker bar */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-[#0F6477] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#0F6477]" />
          <span>SAMPLE INGESTION</span>
        </div>

        <div className="flex items-center gap-1 text-[#6F797C]">
          <Settings className="w-3.5 h-3.5" />
          <span>ML Core v2.4</span>
        </div>
      </div>

      {/* Page Title */}
      <div className="space-y-1.5">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F2A33] tracking-tight">
          Analyze water sample
        </h1>
        <p className="text-xs sm:text-sm text-[#4F6C76]">
          Enter measurements from your field sensor, photometer, or strip test
          readout.
        </p>
      </div>

      {/* Main Analysis Form */}
      <WaterSampleForm />
    </div>
  );
};
