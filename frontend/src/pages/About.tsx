/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Database,
  BarChart2,
  AlertTriangle,
  Globe2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from 'recharts';
import { apiClient } from '../api/client';
import { ModelCardData } from '../types';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';

export const AboutPage: React.FC = () => {
  const [modelCard, setModelCard] = useState<ModelCardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const data = await apiClient.getModelCard();
        setModelCard(data);
      } catch (err) {
        console.error('Failed to load model card:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCard();
  }, []);

  if (isLoading || !modelCard) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const {
    metrics,
    modelsBenchmark,
    confusionMatrix,
    rocCurve,
    calibrationCurve,
  } = modelCard;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Table of Contents Sidebar */}
        <aside className="lg:col-span-3 sticky top-20 hidden lg:block space-y-2 text-xs">
          <span className="font-mono uppercase font-bold text-[#6F797C] tracking-wider block mb-2 px-2">
            MODEL CARD CONTENTS
          </span>
          <nav className="space-y-1">
            <a
              href="#intended-use"
              className="block px-3 py-2 rounded-[8px] text-[#4F6C76] hover:text-[#0F2A33] hover:bg-white transition-colors"
            >
              Intended Use &amp; Governance
            </a>
            <a
              href="#dataset-card"
              className="block px-3 py-2 rounded-[8px] text-[#4F6C76] hover:text-[#0F2A33] hover:bg-white transition-colors"
            >
              Dataset Provenance
            </a>
            <a
              href="#benchmarks"
              className="block px-3 py-2 rounded-[8px] text-[#4F6C76] hover:text-[#0F2A33] hover:bg-white transition-colors"
            >
              Model Architecture Benchmarks
            </a>
            <a
              href="#evaluation-curves"
              className="block px-3 py-2 rounded-[8px] text-[#4F6C76] hover:text-[#0F2A33] hover:bg-white transition-colors"
            >
              Performance Curves &amp; Calibration
            </a>
            <a
              href="#confusion-matrix"
              className="block px-3 py-2 rounded-[8px] text-[#4F6C76] hover:text-[#0F2A33] hover:bg-white transition-colors"
            >
              Confusion Matrix
            </a>
            <a
              href="#limitations"
              className="block px-3 py-2 rounded-[8px] text-[#4F6C76] hover:text-[#0F2A33] hover:bg-white transition-colors"
            >
              Limitations &amp; Ethical Guardrails
            </a>
            <a
              href="#sdg6"
              className="block px-3 py-2 rounded-[8px] text-[#4F6C76] hover:text-[#0F2A33] hover:bg-white transition-colors"
            >
              UN SDG 6 Framework
            </a>
          </nav>
        </aside>

        {/* Main Model Card Content Area */}
        <div className="lg:col-span-9 space-y-10">
          {/* Header */}
          <div className="space-y-2 border-b border-[#D5E3E7] pb-6">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded-full bg-[#0F6477] text-white font-semibold">
                SYSTEM MODEL CARD {modelCard.version}
              </span>
              <span className="text-[#6F797C]">ISO 17025 Reference Format</span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0F2A33] tracking-tight">
              AquaGuard AI Model Card &amp; Algorithmic Audit
            </h1>

            <p className="text-sm text-[#4F6C76] max-w-2xl leading-relaxed">
              Transparent technical documentation detailing empirical model
              architectures, training corpus boundaries, statistical
              calibration, and decision-support limitations.
            </p>

            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#FFF4DE] text-[#8A5A0B] border border-[#EBC878]">
                Illustrative values — replaced with final test-set results
              </span>
            </div>
          </div>

          {/* Section 1: Intended Use */}
          <section id="intended-use" className="space-y-4">
            <h2 className="font-display font-bold text-xl text-[#0F2A33] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0F6477]" />
              <span>Intended Use &amp; Operational Boundaries</span>
            </h2>

            <Card className="p-5 sm:p-6 space-y-3 leading-relaxed text-xs sm:text-sm text-[#4F6C76]">
              <p>
                <strong>Primary Application:</strong> AquaGuard AI is engineered
                exclusively as a preliminary screening triage instrument for
                field technicians, environmental health officers, and community
                water committees. It converts multi-parameter photometer and
                sensor outputs into prioritized inspection tiers.
              </p>
              <p>
                <strong>Prohibited Applications:</strong> Never deploy this
                system to certify water as fit or unfit for human ingestion,
                substitute for statutory laboratory drinking water compliance
                certificates, or bypass certified chemical/biological testing
                protocols mandated by public health bodies.
              </p>
            </Card>
          </section>

          {/* Section 2: Dataset Provenance */}
          <section id="dataset-card" className="space-y-4">
            <h2 className="font-display font-bold text-xl text-[#0F2A33] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#0F6477]" />
              <span>Dataset Foundation &amp; Feature Preprocessing</span>
            </h2>

            <Card className="p-5 sm:p-6 space-y-3 text-xs sm:text-sm text-[#4F6C76]">
              <p>
                <strong>Training Archive:</strong> Kaggle Water Quality Archive
                comprising 3,276 independent water sample observations measured
                across 9 physicochemical dimensions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-[8px] bg-[#EEF3F5] text-center font-mono">
                  <span className="text-xl font-bold text-[#0F2A33] block">
                    3,276
                  </span>
                  <span className="text-[11px] text-[#6F797C]">
                    Total Sample Records
                  </span>
                </div>
                <div className="p-3 rounded-[8px] bg-[#EEF3F5] text-center font-mono">
                  <span className="text-xl font-bold text-[#0F2A33] block">
                    9
                  </span>
                  <span className="text-[11px] text-[#6F797C]">
                    Measured Features
                  </span>
                </div>
                <div className="p-3 rounded-[8px] bg-[#EEF3F5] text-center font-mono">
                  <span className="text-xl font-bold text-[#0F2A33] block">
                    80 / 20
                  </span>
                  <span className="text-[11px] text-[#6F797C]">
                    Train / Test Stratified Split
                  </span>
                </div>
              </div>
            </Card>
          </section>

          {/* Section 3: Model Architecture Benchmarks */}
          <section id="benchmarks" className="space-y-4">
            <h2 className="font-display font-bold text-xl text-[#0F2A33] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#0F6477]" />
              <span>Model Architecture Comparative Benchmark</span>
            </h2>

            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table
                  className="w-full text-left text-xs"
                  aria-label="Model benchmark comparison table"
                >
                  <thead className="bg-[#EEF3F5] text-[#4F6C76] font-semibold border-b border-[#D5E3E7]">
                    <tr>
                      <th className="px-4 py-3">Algorithm Candidate</th>
                      <th className="px-4 py-3 font-mono">Accuracy</th>
                      <th className="px-4 py-3 font-mono">Precision</th>
                      <th className="px-4 py-3 font-mono">Recall</th>
                      <th className="px-4 py-3 font-mono">F1 Score</th>
                      <th className="px-4 py-3 font-mono">ROC AUC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7F0F2] bg-white">
                    {modelsBenchmark.map((m, idx) => (
                      <tr
                        key={m.model}
                        className={
                          idx === 0
                            ? 'bg-[#E4F7FF]/50 font-semibold'
                            : 'hover:bg-[#F4F9FA]'
                        }
                      >
                        <td className="px-4 py-3 text-[#0F2A33]">
                          {m.model}
                          {idx === 0 && (
                            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-[#0F6477] text-white">
                              Deployed
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          {m.accuracy.toFixed(3)}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          {m.precision.toFixed(3)}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          {m.recall.toFixed(3)}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          {m.f1.toFixed(3)}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-[#0F6477]">
                          {m.rocAuc.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          {/* Section 4: Evaluation Curves */}
          <section id="evaluation-curves" className="space-y-4">
            <h2 className="font-display font-bold text-xl text-[#0F2A33] flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#0F6477]" />
              <span>Statistical Validation Curves</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ROC Curve */}
              <Card className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-sm text-[#0F2A33]">
                    ROC Curve (AUC: {metrics.rocAuc.toFixed(3)})
                  </h3>
                  <span className="text-xs font-mono text-[#0F6477]">
                    GBDT v2.4
                  </span>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={rocCurve}
                      margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E7F0F2" />
                      <XAxis
                        dataKey="fpr"
                        tick={{ fontSize: 10 }}
                        label={{
                          value: 'FPR',
                          position: 'insideBottom',
                          offset: -5,
                          fontSize: 10,
                        }}
                      />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        label={{
                          value: 'TPR',
                          angle: -90,
                          position: 'insideLeft',
                          fontSize: 10,
                        }}
                      />
                      <RechartsTooltip
                        formatter={(v: unknown) =>
                          typeof v === 'number' ? v.toFixed(2) : String(v)
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="tpr"
                        stroke="#0F6477"
                        strokeWidth={2.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Calibration Curve */}
              <Card className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-sm text-[#0F2A33]">
                    Probability Calibration (Platt Scaled)
                  </h3>
                  <span className="text-xs font-mono text-[#0F6477]">
                    Brier: {metrics.brierScore.toFixed(3)}
                  </span>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={calibrationCurve}
                      margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E7F0F2" />
                      <XAxis
                        dataKey="meanPredicted"
                        tick={{ fontSize: 10 }}
                        label={{
                          value: 'Mean Predicted',
                          position: 'insideBottom',
                          offset: -5,
                          fontSize: 10,
                        }}
                      />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        label={{
                          value: 'Observed Fraction',
                          angle: -90,
                          position: 'insideLeft',
                          fontSize: 10,
                        }}
                      />
                      <RechartsTooltip
                        formatter={(v: unknown) =>
                          typeof v === 'number' ? v.toFixed(2) : String(v)
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="observedFraction"
                        stroke="#22B3C1"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </section>

          {/* Section 5: Confusion Matrix Grid */}
          <section id="confusion-matrix" className="space-y-4">
            <h2 className="font-display font-bold text-xl text-[#0F2A33]">
              Holdout Test Set Confusion Matrix
            </h2>

            <Card className="p-6">
              <div className="max-w-md mx-auto grid grid-cols-2 gap-3 text-center">
                <div className="p-4 rounded-[10px] bg-[#E2F4EA]/60 border border-[#9AD3B4]">
                  <span className="text-xs font-mono text-[#17714A] font-semibold block">
                    TRUE POSITIVE (TP)
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#17714A]">
                    {confusionMatrix.tp}
                  </span>
                  <span className="text-[10px] text-[#17714A]/80 block mt-1">
                    Correctly classified compliant
                  </span>
                </div>

                <div className="p-4 rounded-[10px] bg-[#FBE5E0]/60 border border-[#EDA699]">
                  <span className="text-xs font-mono text-[#A63322] font-semibold block">
                    FALSE POSITIVE (FP)
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#A63322]">
                    {confusionMatrix.fp}
                  </span>
                  <span className="text-[10px] text-[#A63322]/80 block mt-1">
                    Incorrectly flagged lower
                  </span>
                </div>

                <div className="p-4 rounded-[10px] bg-[#FBE5E0]/60 border border-[#EDA699]">
                  <span className="text-xs font-mono text-[#A63322] font-semibold block">
                    FALSE NEGATIVE (FN)
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#A63322]">
                    {confusionMatrix.fn}
                  </span>
                  <span className="text-[10px] text-[#A63322]/80 block mt-1">
                    Conservative over-triage
                  </span>
                </div>

                <div className="p-4 rounded-[10px] bg-[#E2F4EA]/60 border border-[#9AD3B4]">
                  <span className="text-xs font-mono text-[#17714A] font-semibold block">
                    TRUE NEGATIVE (TN)
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#17714A]">
                    {confusionMatrix.tn}
                  </span>
                  <span className="text-[10px] text-[#17714A]/80 block mt-1">
                    Correctly flagged elevated
                  </span>
                </div>
              </div>
            </Card>
          </section>

          {/* Section 6: Limitations & Out-of-Scope Risks */}
          <section id="limitations" className="space-y-4">
            <h2 className="font-display font-bold text-xl text-[#0F2A33] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#A63322]" />
              <span>Limitations &amp; Environmental Guardrails</span>
            </h2>

            <Card className="p-5 sm:p-6 space-y-3 text-xs sm:text-sm text-[#4F6C76]">
              <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                <li>
                  <strong>Proxy Limitations:</strong> Physicochemical metrics
                  cannot infer biological pathogens (E. coli, cholera, viral
                  entities).
                </li>
                <li>
                  <strong>Regional Generalizability:</strong> Model weights
                  reflect baseline distributions in the Kaggle benchmark
                  archive; local watershed hydrology may require transfer
                  calibration.
                </li>
                <li>
                  <strong>Missing Value Imputation:</strong> When fewer than 5
                  parameters are entered, predictive uncertainty bounds widen
                  substantially.
                </li>
              </ul>
            </Card>
          </section>

          {/* Section 7: UN SDG 6 Framework */}
          <section id="sdg6" className="space-y-4">
            <h2 className="font-display font-bold text-xl text-[#0F2A33] flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-[#0F6477]" />
              <span>UN SDG 6 Target Alignment</span>
            </h2>

            <Card className="p-5 sm:p-6 space-y-3 text-xs sm:text-sm text-[#4F6C76] bg-[#E4F7FF]/50 border-[#BFC8CC]">
              <p>
                AquaGuard AI is developed in direct alignment with{' '}
                <strong>UN Sustainable Development Goal 6</strong>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-[8px] bg-white border border-[#D5E3E7]">
                  <strong className="text-[#0F2A33] block mb-1">
                    Target 6.1 (Safe Drinking Water)
                  </strong>
                  Equitable access through transparent decentralized screening
                  and prioritization.
                </div>
                <div className="p-3 rounded-[8px] bg-white border border-[#D5E3E7]">
                  <strong className="text-[#0F2A33] block mb-1">
                    Target 6.3 (Water Quality &amp; Treatment)
                  </strong>
                  Reduction of untreated discharge through rapid identification
                  of anomalous parameters.
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};
