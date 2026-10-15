/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';
import { apiClient } from '../api/client';
import { WaterSampleAnalysis } from '../types';
import { PARAMETERS_CONFIG } from '../config/parameters';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MLRiskBadge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';

export const ComparePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allAnalyses, setAllAnalyses] = useState<WaterSampleAnalysis[]>([]);
  const [sampleA, setSampleA] = useState<WaterSampleAnalysis | null>(null);
  const [sampleB, setSampleB] = useState<WaterSampleAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.getAnalyses({ pageSize: 50 });
        setAllAnalyses(res.items);

        const idA = searchParams.get('sampleA') || (res.items[0]?.id ?? '');
        const idB =
          searchParams.get('sampleB') ||
          (res.items[1]?.id ?? res.items[0]?.id ?? '');

        const foundA =
          res.items.find((x) => x.id === idA) || res.items[0] || null;
        const foundB =
          res.items.find((x) => x.id === idB) || res.items[1] || null;

        setSampleA(foundA);
        setSampleB(foundB);
      } catch (err) {
        console.error('Failed to load comparison data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAll();
  }, []);

  const handleSelectA = (id: string) => {
    const found = allAnalyses.find((x) => x.id === id) || null;
    setSampleA(found);
    searchParams.set('sampleA', id);
    setSearchParams(searchParams);
  };

  const handleSelectB = (id: string) => {
    const found = allAnalyses.find((x) => x.id === id) || null;
    setSampleB(found);
    searchParams.set('sampleB', id);
    setSearchParams(searchParams);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-16 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F2A33] tracking-tight">
          Sample Telemetry Comparison
        </h1>
        <p className="text-xs sm:text-sm text-[#4F6C76] mt-1">
          Side-by-side screening inspection of physicochemical features, risk
          bands, and SHAP weights.
        </p>
      </div>

      {/* Two Pickers & Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sample A Card */}
        <Card className="p-5 space-y-3 border-t-4 border-t-[#0F6477]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-[#0F6477]">
              SAMPLE A (BASELINE)
            </span>
            <select
              value={sampleA?.id || ''}
              onChange={(e) => handleSelectA(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-[8px] bg-[#F4F9FA] border border-[#D5E3E7] text-[#0F2A33]"
            >
              {allAnalyses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          {sampleA && (
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-[#0F2A33]">
                {sampleA.label}
              </h3>
              <p className="text-xs text-[#4F6C76]">
                {sampleA.location} ·{' '}
                {new Date(sampleA.created_at).toLocaleDateString()}
              </p>
              <div className="flex items-center justify-between pt-2">
                <MLRiskBadge band={sampleA.ml.band} size="sm" />
                <span className="font-mono text-xl font-bold text-[#0F2A33]">
                  Score: {sampleA.ml.score.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Sample B Card */}
        <Card className="p-5 space-y-3 border-t-4 border-t-[#22B3C1]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-[#22B3C1]">
              SAMPLE B (COMPARISON)
            </span>
            <select
              value={sampleB?.id || ''}
              onChange={(e) => handleSelectB(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-[8px] bg-[#F4F9FA] border border-[#D5E3E7] text-[#0F2A33]"
            >
              {allAnalyses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          {sampleB && (
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-[#0F2A33]">
                {sampleB.label}
              </h3>
              <p className="text-xs text-[#4F6C76]">
                {sampleB.location} ·{' '}
                {new Date(sampleB.created_at).toLocaleDateString()}
              </p>
              <div className="flex items-center justify-between pt-2">
                <MLRiskBadge band={sampleB.ml.band} size="sm" />
                <span className="font-mono text-xl font-bold text-[#0F2A33]">
                  Score: {sampleB.ml.score.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Comparability Note */}
      <div className="flex items-start gap-3 p-4 rounded-[12px] bg-[#E4F7FF] border border-[#BFC8CC] text-xs text-[#004B5A] leading-relaxed">
        <Info className="w-4 h-4 shrink-0 text-[#0F6477] mt-0.5" />
        <p>
          <strong>Hydrological Comparability Note:</strong> Comparison assumes
          consistent sampling protocols. Cross-catchment variations in mineral
          geology (e.g. natural limestone aquifers vs. alluvial plains)
          naturally cause variance in electrical conductivity and hardness.
        </p>
      </div>

      {/* Parameter Comparison Matrix */}
      {sampleA && sampleB && (
        <Card className="p-0 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E7F0F2] bg-[#F4F9FA]/50">
            <h3 className="font-display font-semibold text-base text-[#0F2A33]">
              Side-by-Side Parameter Matrix
            </h3>
            <p className="text-xs text-[#4F6C76]">
              Direct numeric comparison across all 9 physicochemical parameters.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table
              className="w-full text-left text-xs"
              aria-label="Side-by-side comparison matrix"
            >
              <thead className="bg-[#EEF3F5] text-[#4F6C76] font-semibold border-b border-[#D5E3E7]">
                <tr>
                  <th className="px-4 py-3">Parameter</th>
                  <th className="px-4 py-3">Reference Baseline</th>
                  <th className="px-4 py-3 font-mono text-[#0F6477]">
                    Sample A
                  </th>
                  <th className="px-4 py-3 font-mono text-[#22B3C1]">
                    Sample B
                  </th>
                  <th className="px-4 py-3 text-right">Delta (B - A)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7F0F2] bg-white">
                {PARAMETERS_CONFIG.map((p) => {
                  const valA = sampleA.inputs[p.key];
                  const valB = sampleB.inputs[p.key];
                  const hasBoth =
                    valA !== null &&
                    valA !== undefined &&
                    valB !== null &&
                    valB !== undefined;
                  const delta = hasBoth
                    ? Number((Number(valB) - Number(valA)).toFixed(2))
                    : null;

                  return (
                    <tr
                      key={p.key}
                      className="hover:bg-[#F4F9FA] transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-[#0F2A33]">
                        {p.fullName}
                      </td>
                      <td className="px-4 py-3 text-[#6F797C] font-mono">
                        {p.baseline}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-[#0F2A33]">
                        {valA !== null && valA !== undefined
                          ? `${valA} ${p.unit}`
                          : 'Imputed'}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-[#0F2A33]">
                        {valB !== null && valB !== undefined
                          ? `${valB} ${p.unit}`
                          : 'Imputed'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold">
                        {delta !== null ? (
                          <span
                            className={
                              delta > 0
                                ? 'text-[#0F6477]'
                                : delta < 0
                                  ? 'text-[#A63322]'
                                  : 'text-[#6F797C]'
                            }
                          >
                            {delta > 0 ? `+${delta}` : delta}
                          </span>
                        ) : (
                          <span className="text-[#93A9B0]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Side-by-Side Screening Actions Links */}
      {sampleA && sampleB && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to={`/result/${sampleA.id}`}>
            <Button variant="secondary" className="w-full">
              <span>View Full Report for {sampleA.label}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Link to={`/result/${sampleB.id}`}>
            <Button variant="secondary" className="w-full">
              <span>View Full Report for {sampleB.label}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
