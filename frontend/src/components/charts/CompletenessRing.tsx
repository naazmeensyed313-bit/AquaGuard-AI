/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckSquare, MinusCircle, Info } from 'lucide-react';
import { InputCompleteness } from '../../types';

interface CompletenessMeterProps {
  completeness: InputCompleteness;
  variant?: 'result' | 'form';
}

export const CompletenessMeter: React.FC<CompletenessMeterProps> = ({
  completeness,
  variant = 'result',
}) => {
  const { provided, total, percent, missing, confidenceTier } = completeness;

  const tierBadgeClasses = {
    'High Confidence': 'bg-[#E2F4EA] text-[#17714A] border-[#9AD3B4]',
    'Moderate Confidence': 'bg-[#D7F2FE] text-[#0F6477] border-[#8BD1E6]',
    'Low Confidence': 'bg-[#FDF1D6] text-[#8A5A0B] border-[#EBC878]',
  }[confidenceTier];

  return (
    <div className="space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-[#0F6477]" />
          <h3 className="font-display font-semibold text-sm sm:text-base text-[#0F2A33]">
            Input Completeness
          </h3>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider font-mono border ${tierBadgeClasses}`}
        >
          {confidenceTier}
        </span>
      </div>

      {/* Numerical Counter */}
      <div className="flex items-baseline justify-between">
        <span className="font-display font-bold text-lg sm:text-xl text-[#0F2A33]">
          {provided} of {total}{' '}
          {variant === 'form' ? 'parameters entered' : 'Parameters'}
        </span>
        <span className="font-mono text-sm font-semibold text-[#0F6477]">
          {percent}% Complete
        </span>
      </div>

      {/* Progress Track */}
      <div className="h-2.5 w-full bg-[#E7F0F2] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#0F6477] to-[#22B3C1] rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Missing / Imputed parameters pill badges */}
      {missing.length > 0 && (
        <div className="pt-1 space-y-2">
          <span className="text-[11px] font-mono uppercase font-semibold text-[#6F797C] tracking-wider block">
            {variant === 'form'
              ? 'Missing values for ML model:'
              : 'UNRECORDED / IMPUTED PARAMETERS:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {missing.map((param) => (
              <span
                key={param}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-[#E4F7FF] text-[#004B5A] border border-[#BFC8CC]"
              >
                <MinusCircle className="w-3.5 h-3.5 text-[#0F6477]" />
                <span>{param}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Explanatory callout */}
      <div className="text-xs text-[#4F6C76] leading-relaxed pt-1">
        {variant === 'form' ? (
          <div className="flex items-start gap-2 p-3 rounded-[8px] bg-[#E4F7FF]/70 text-[#004B5A] text-xs">
            <Info className="w-4 h-4 shrink-0 text-[#0F6477] mt-0.5" />
            <p>
              Missing parameters are automatically imputed using regional
              hydrological baselines, but will reduce screening confidence.
            </p>
          </div>
        ) : (
          <p className="italic text-[#6F797C]">
            Missing values were imputed via regional Bayesian priors; overall
            predictive certainty is reduced. Model sensitivity degrades as
            unobserved inputs rise.
          </p>
        )}
      </div>
    </div>
  );
};
