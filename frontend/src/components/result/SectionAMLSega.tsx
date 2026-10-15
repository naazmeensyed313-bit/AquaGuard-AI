/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Cpu, FileText, AlertTriangle } from 'lucide-react';
import { WaterSampleAnalysis } from '../../types';
import { Card } from '../ui/Card';
import { MLRiskBadge } from '../ui/Badge';
import { GaugeChart } from '../charts/GaugeChart';
import { CompletenessMeter } from '../charts/CompletenessRing';
import { ShapBarChart } from '../charts/ShapBarChart';

interface SectionAMLSegaProps {
  analysis: WaterSampleAnalysis;
}

export const SectionAMLSega: React.FC<SectionAMLSegaProps> = ({ analysis }) => {
  const { ml, completeness, shap, explanation } = analysis;
  const isLowCompleteness = completeness.provided < 5;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#0F6477]/10 flex items-center justify-center text-[#0F6477]">
            <Cpu className="w-4 h-4" />
          </div>
          <h2 className="font-display font-bold text-lg sm:text-xl text-[#0F2A33]">
            ML Screening Result
          </h2>
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#0F6477] text-white">
          {ml.modelVersion}
        </span>
      </div>

      {/* Low Completeness Alert Banner if < 5 parameters */}
      {isLowCompleteness && (
        <div className="flex items-start gap-3 p-3.5 rounded-[12px] bg-[#FFF4DE] border border-[#EBC878] text-xs text-[#8A5A0B] leading-relaxed">
          <AlertTriangle className="w-4 h-4 shrink-0 text-[#8A5A0B] mt-0.5" />
          <div>
            <strong>Low Input Completeness Warning:</strong> Only{' '}
            {completeness.provided} of 9 parameters were provided. Missing
            parameters rely heavily on statistical Bayesian priors, which
            increases variance and reduces decision reliability.
          </div>
        </div>
      )}

      {/* Hero Card: ML Status and Gauge */}
      <Card className="p-5 sm:p-6 space-y-4">
        {/* ML Screening Band Badge */}
        <div>
          <MLRiskBadge
            band={ml.band}
            size="lg"
            className="w-full justify-center py-2 text-center"
          />
        </div>

        {/* 3-Zone Gauge and Thresholds */}
        <GaugeChart ml={ml} />
      </Card>

      {/* Card 2: Input Completeness */}
      <Card className="p-5 sm:p-6">
        <CompletenessMeter completeness={completeness} variant="result" />
      </Card>

      {/* Card 3: What Shaped This Score (SHAP) */}
      <Card className="p-5 sm:p-6">
        <ShapBarChart shap={shap} />
      </Card>

      {/* Card 4: Screening Synthesis */}
      <Card className="p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0F6477]" />
            <h3 className="font-display font-semibold text-sm sm:text-base text-[#0F2A33]">
              Screening Synthesis
            </h3>
          </div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#EEF3F5] text-[#4F6C76] border border-[#D5E3E7]">
            Generated from structured results
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#0F2A33] leading-relaxed">
          {explanation.text}
        </p>
      </Card>
    </section>
  );
};
