/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShapResult } from '../../types';
import { Tooltip } from '../ui/Tooltip';

interface ShapBarChartProps {
  shap: ShapResult;
}

export const ShapBarChart: React.FC<ShapBarChartProps> = ({ shap }) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const { base_value, contributions, final_score } = shap;

  // Separate into negative (toward elevated concern) and positive (toward lower concern)
  const elevatedItems = contributions.filter((c) => c.contribution < 0);
  const lowerItems = contributions.filter((c) => c.contribution >= 0);

  // Maximum absolute contribution for scale normalization
  const maxAbs = Math.max(
    0.1,
    ...contributions.map((c) => Math.abs(c.contribution))
  );

  return (
    <div className="space-y-4">
      {/* Header and Toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display font-semibold text-sm sm:text-base text-[#0F2A33]">
            What Shaped This Score
          </h3>
          <Tooltip content="SHAP (SHapley Additive exPlanations) values indicate how each feature pushed the model output from the baseline dataset prior toward Elevated or Lower Concern." />
        </div>

        {/* Chart / Table segmented control */}
        <div
          role="group"
          aria-label="Visualization display mode"
          className="flex items-center bg-[#EEF3F5] p-0.5 rounded-[8px] border border-[#D5E3E7] text-xs font-medium"
        >
          <button
            type="button"
            aria-pressed={viewMode === 'chart'}
            onClick={() => setViewMode('chart')}
            className={`px-2.5 py-1 rounded-[6px] transition-colors ${
              viewMode === 'chart'
                ? 'bg-white text-[#0F2A33] shadow-xs font-semibold'
                : 'text-[#4F6C76] hover:text-[#0F2A33]'
            }`}
          >
            Chart
          </button>
          <button
            type="button"
            aria-pressed={viewMode === 'table'}
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 rounded-[6px] transition-colors ${
              viewMode === 'table'
                ? 'bg-white text-[#0F2A33] shadow-xs font-semibold'
                : 'text-[#4F6C76] hover:text-[#0F2A33]'
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Subhead info bar */}
      <div className="flex items-center justify-between text-xs bg-[#F4F9FA] px-3.5 py-2 rounded-[8px] border border-[#D5E3E7] font-mono">
        <span className="text-[#4F6C76]">
          Base Value:{' '}
          <strong className="text-[#0F2A33]">{base_value.toFixed(2)}</strong>{' '}
          (avg. dataset)
        </span>
        <span className="text-[#93A9B0] font-sans">→</span>
        <span className="text-[#4F6C76]">
          Final Score:{' '}
          <strong className="text-[#0F2A33]">{final_score.toFixed(2)}</strong>
        </span>
      </div>

      {viewMode === 'chart' ? (
        <div className="space-y-4 pt-1">
          {/* Negative (Elevated Concern) items */}
          {elevatedItems.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-[#A63322] flex items-center justify-between">
                <span>← Toward Elevated Concern</span>
              </div>
              <div className="space-y-2">
                {elevatedItems.map((item) => {
                  const widthPercent = Math.min(
                    100,
                    (Math.abs(item.contribution) / maxAbs) * 100
                  );
                  return (
                    <div key={item.parameter} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#0F2A33] font-medium truncate max-w-[240px]">
                          {item.parameter}
                        </span>
                        <span className="font-mono font-semibold text-[#A63322]">
                          {item.contribution > 0
                            ? `+${item.contribution.toFixed(2)}`
                            : item.contribution.toFixed(2)}
                        </span>
                      </div>
                      {/* Bar pointing to the right but red */}
                      <div className="h-3 w-full bg-[#FBE5E0]/50 rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-[#EDA699] rounded-full transition-all duration-300"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Positive (Lower Concern) items */}
          {lowerItems.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#E7F0F2]">
              <div className="text-[11px] font-semibold text-[#17714A] flex items-center justify-end">
                <span>Toward Lower Concern →</span>
              </div>
              <div className="space-y-2">
                {lowerItems.map((item) => {
                  const widthPercent = Math.min(
                    100,
                    (Math.abs(item.contribution) / maxAbs) * 100
                  );
                  return (
                    <div key={item.parameter} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#0F2A33] font-medium truncate max-w-[240px]">
                          {item.parameter}
                        </span>
                        <span className="font-mono font-semibold text-[#17714A]">
                          +{item.contribution.toFixed(2)}
                        </span>
                      </div>
                      {/* Bar pointing green */}
                      <div className="h-3 w-full bg-[#E2F4EA]/50 rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-[#9AD3B4] rounded-full transition-all duration-300"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <p className="text-[11px] text-[#6F797C] italic pt-1 leading-relaxed">
            Contributions describe how the model weighted features for this
            specific inference, not biochemical root causes.
          </p>
        </div>
      ) : (
        /* Accessible Table Mode */
        <div className="overflow-x-auto rounded-[8px] border border-[#D5E3E7]">
          <table
            className="w-full text-left text-xs"
            aria-label="SHAP feature contribution values table"
          >
            <thead className="bg-[#EEF3F5] text-[#4F6C76] font-semibold">
              <tr>
                <th className="px-3 py-2">Parameter</th>
                <th className="px-3 py-2">Recorded Value</th>
                <th className="px-3 py-2">Weight Delta</th>
                <th className="px-3 py-2">Screening Vector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7F0F2] bg-white">
              {contributions.map((c) => (
                <tr key={c.parameter} className="hover:bg-[#F4F9FA]">
                  <td className="px-3 py-2 font-medium text-[#0F2A33]">
                    {c.parameter}
                  </td>
                  <td className="px-3 py-2 font-mono text-[#4F6C76]">
                    {c.value !== null ? `${c.value} ${c.unit}` : 'Imputed'}
                  </td>
                  <td
                    className={`px-3 py-2 font-mono font-semibold ${
                      c.contribution < 0 ? 'text-[#A63322]' : 'text-[#17714A]'
                    }`}
                  >
                    {c.contribution > 0
                      ? `+${c.contribution.toFixed(2)}`
                      : c.contribution.toFixed(2)}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        c.contribution < 0
                          ? 'bg-[#FBE5E0] text-[#A63322]'
                          : 'bg-[#E2F4EA] text-[#17714A]'
                      }`}
                    >
                      {c.direction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
