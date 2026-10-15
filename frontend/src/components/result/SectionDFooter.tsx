/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';

export const SectionDFooter: React.FC = () => {
  return (
    <section>
      <Card className="p-5 sm:p-6 bg-[#E4F7FF]/50 border border-[#BFC8CC] space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0F6477]/10 flex items-center justify-center shrink-0 text-[#0F6477]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-display font-semibold text-sm sm:text-base text-[#0F2A33]">
              Responsible Oversight & Purpose
            </h3>
            <p className="text-xs sm:text-sm text-[#004B5A] leading-relaxed">
              AquaGuard AI acts exclusively as an algorithmic screening and prioritization
              instrument in alignment with UN SDG 6. Statistical outputs reflect correlative
              patterns from benchmarking data and must never be interpreted as health clearances or
              sanitization verdicts.
            </p>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#D5E3E7] text-xs">
          <div>
            <span className="text-[#6F797C] block text-[11px] font-mono">Model Architecture:</span>
            <span className="font-semibold text-[#0F2A33]">
              Gradient Boosting Classifier (Calibrated)
            </span>
          </div>

          <div>
            <span className="text-[#6F797C] block text-[11px] font-mono">Dataset Foundation:</span>
            <span className="font-semibold text-[#0F2A33]">
              Kaggle Water Quality Archive
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Link
              to="/about"
              className="text-[#0F6477] font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>View Technical Model Card (v2.4)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex items-center gap-1.5 text-[#004B5A] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0F6477]" />
            <span>ISO 17025 Reference Aligned</span>
          </div>
        </div>
      </Card>
    </section>
  );
};
