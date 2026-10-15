/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { WaterSampleAnalysis, RegulatoryStandard } from '../../types';
import { Card } from '../ui/Card';
import { StandardBadge } from '../ui/Badge';
import { ParameterRangeBar } from '../charts/ParameterRangeBar';
import { evaluateStandards } from '../../lib/standards';

interface SectionBStandardsProps {
  analysis: WaterSampleAnalysis;
}

export const SectionBStandards: React.FC<SectionBStandardsProps> = ({ analysis }) => {
  const [selectedStandard, setSelectedStandard] =
    useState<RegulatoryStandard>('BIS IS 10500');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Dynamically recompute standards when user toggles standard
  const standardsData = evaluateStandards(analysis.inputs, selectedStandard);
  const { items, summary_counts } = standardsData;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#41576B]/10 flex items-center justify-center text-[#41576B]">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <h2 className="font-display font-bold text-lg sm:text-xl text-[#0F2A33]">
            Standards-Based Check
          </h2>
        </div>

        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-mono font-medium bg-[#EEF3F5] text-[#41576B] border border-[#D5E3E7] w-fit">
          Deterministic · Non-ML
        </span>
      </div>

      {/* Regulatory Standard Selector & Context */}
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono uppercase font-semibold text-[#6F797C] tracking-wider block mb-1">
              REGULATORY STANDARD:
            </span>
            <div className="inline-flex bg-[#D7F2FE]/50 p-1 rounded-[10px] border border-[#BFC8CC]/50">
              <button
                onClick={() => setSelectedStandard('BIS IS 10500')}
                className={`px-4 py-2 rounded-[8px] text-xs font-semibold tracking-wide transition-all ${
                  selectedStandard === 'BIS IS 10500'
                    ? 'bg-white text-[#004B5A] shadow-xs'
                    : 'text-[#4F6C76] hover:text-[#0F2A33]'
                }`}
              >
                BIS IS 10500
              </button>
              <button
                onClick={() => setSelectedStandard('WHO Guidelines')}
                className={`px-4 py-2 rounded-[8px] text-xs font-semibold tracking-wide transition-all ${
                  selectedStandard === 'WHO Guidelines'
                    ? 'bg-white text-[#004B5A] shadow-xs'
                    : 'text-[#4F6C76] hover:text-[#0F2A33]'
                }`}
              >
                WHO Guidelines
              </button>
            </div>
          </div>

          {/* Cards / Table toggle */}
          <div className="flex items-center self-end sm:self-center bg-[#EEF3F5] p-0.5 rounded-[8px] border border-[#D5E3E7] text-xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-[6px] transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-[#0F2A33] font-semibold shadow-xs'
                  : 'text-[#4F6C76] hover:text-[#0F2A33]'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-[6px] transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-[#0F2A33] font-semibold shadow-xs'
                  : 'text-[#4F6C76] hover:text-[#0F2A33]'
              }`}
            >
              Table
            </button>
          </div>
        </div>

        <p className="text-xs text-[#4F6C76] leading-relaxed">
          Reference values are displayed for context; acceptable limits differ by standard,
          watershed geography, and intended utility.
        </p>

        {/* Summary Count Strip */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#E7F0F2] text-center">
          <div className="p-2 sm:p-2.5 rounded-[8px] bg-[#FBE5E0]/60 border border-[#EDA699]/40">
            <span className="font-mono text-base sm:text-lg font-bold text-[#A63322] block">
              {summary_counts.above}
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-[#A63322]">
              Above
            </span>
          </div>

          <div className="p-2 sm:p-2.5 rounded-[8px] bg-[#E2F4EA]/60 border border-[#9AD3B4]/40">
            <span className="font-mono text-base sm:text-lg font-bold text-[#17714A] block">
              {summary_counts.within}
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-[#17714A]">
              Within
            </span>
          </div>

          <div className="p-2 sm:p-2.5 rounded-[8px] bg-[#FDF1D6]/60 border border-[#EBC878]/40">
            <span className="font-mono text-base sm:text-lg font-bold text-[#8A5A0B] block">
              {summary_counts.below}
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-[#8A5A0B]">
              Below
            </span>
          </div>

          <div className="p-2 sm:p-2.5 rounded-[8px] bg-[#EEF3F5] border border-[#D5E3E7]">
            <span className="font-mono text-base sm:text-lg font-bold text-[#6F797C] block">
              {summary_counts.unassessed}
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-[#6F797C]">
              Unassessed
            </span>
          </div>
        </div>
      </Card>

      {/* View Mode: Cards */}
      {viewMode === 'cards' ? (
        <div className="space-y-3">
          {items.map((item) => {
            const isNotProvided = item.value === null || item.status === 'Not provided';
            return (
              <Card
                key={item.paramKey}
                className={`p-4 transition-all ${
                  isNotProvided ? 'bg-[#FAFCFD] opacity-80' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display font-semibold text-sm text-[#0F2A33]">
                      {item.parameter}
                    </h3>
                  </div>
                  <StandardBadge status={item.status} />
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  {item.value !== null ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-2xl font-bold text-[#0F2A33]">
                        {item.value.toLocaleString()}
                      </span>
                      {item.unit && (
                        <span className="text-xs font-mono text-[#6F797C]">{item.unit}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs font-mono text-[#93A9B0] italic">
                      No measurement entered
                    </span>
                  )}

                  <span className="text-xs text-[#6F797C] font-medium text-right">
                    {item.reference_text}
                  </span>
                </div>

                {/* Range Bar */}
                <ParameterRangeBar item={item} />
              </Card>
            );
          })}
        </div>
      ) : (
        /* View Mode: Table */
        <div className="bg-white rounded-[14px] border border-[#D5E3E7] overflow-x-auto shadow-2xs">
          <table className="w-full text-left text-xs" aria-label="Standards reference comparison table">
            <thead className="bg-[#EEF3F5] text-[#4F6C76] font-semibold border-b border-[#D5E3E7]">
              <tr>
                <th className="px-4 py-3">Parameter</th>
                <th className="px-4 py-3">Measured Value</th>
                <th className="px-4 py-3">Reference Benchmark</th>
                <th className="px-4 py-3">Adherence Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7F0F2]">
              {items.map((item) => (
                <tr key={item.paramKey} className="hover:bg-[#F4F9FA]">
                  <td className="px-4 py-3 font-medium text-[#0F2A33]">{item.parameter}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-[#0F2A33]">
                    {item.value !== null ? `${item.value} ${item.unit}` : 'Not provided'}
                  </td>
                  <td className="px-4 py-3 text-[#4F6C76]">{item.reference_text}</td>
                  <td className="px-4 py-3">
                    <StandardBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
