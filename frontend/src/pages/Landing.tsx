/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  SlidersHorizontal,
  ListChecks,
  Globe2,
  BarChart3,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PARAMETERS_CONFIG } from '../config/parameters';
import { MLRiskBadge } from '../components/ui/Badge';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-24 md:pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#E4F7FF]/70 via-[#F2FBFF] to-[#F2FBFF] border-b border-[#D5E3E7] pt-12 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Top trust marker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D5E3E7] text-xs font-semibold text-[#0F6477] mb-6 shadow-2xs">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Empirical Environmental Screening · UN SDG 6 Aligned</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-5">
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F2A33] tracking-tight leading-[1.15]">
                AI-Powered Water Quality Screening &amp; Decision Support
              </h1>

              <p className="text-base sm:text-lg text-[#4F6C76] leading-relaxed max-w-2xl">
                An educational decision-support screening system for field
                sensor telemetry. Synthesizes calibrated gradient boosted risk
                classification with deterministic regulatory standard
                compliance.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/analyze">
                  <Button
                    size="lg"
                    className="h-12 px-6 text-sm sm:text-base font-semibold shadow-md"
                  >
                    <span>Analyze Water Sample</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <Link to="/dashboard">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="h-12 px-6 text-sm sm:text-base font-semibold"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <span>View Dashboard</span>
                  </Button>
                </Link>
              </div>

              {/* Strict Non-Certification Trust Banner */}
              <div className="pt-3 text-xs text-[#6F797C] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0F6477] shrink-0" />
                <span>
                  Provides empirical risk banding (Lower Concern / Inconclusive
                  / Elevated Concern). Does not issue safety clearances or
                  replace laboratory assays.
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Screening Preview Card */}
            <div className="lg:col-span-5">
              <Card className="p-5 sm:p-6 bg-white border border-[#D5E3E7] shadow-md space-y-4">
                <div className="flex items-center justify-between text-xs pb-3 border-b border-[#E7F0F2]">
                  <span className="font-mono font-bold text-[#0F6477] uppercase text-[11px]">
                    LIVE BENCHMARK SAMPLE
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#E4F7FF] text-[#004B5A] border border-[#BFC8CC]">
                    Station G-04
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-lg text-[#0F2A33]">
                    Community tank – Ward 12
                  </h3>
                  <p className="text-xs text-[#4F6C76]">
                    Collected 08 Oct 2026, 11:42
                  </p>
                </div>

                <div className="p-3 rounded-[10px] bg-[#FDF1D6] border border-[#EBC878] space-y-1">
                  <MLRiskBadge
                    band="Inconclusive — lab testing recommended"
                    size="sm"
                  />
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs text-[#8A5A0B] font-medium">
                      Risk Classifier Score:
                    </span>
                    <span className="font-mono text-xl font-bold text-[#0F2A33]">
                      0.47
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#4F6C76]">
                  <div className="flex justify-between">
                    <span>Completeness:</span>
                    <span className="font-mono font-semibold text-[#0F2A33]">
                      7 of 9 Parameters (78%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standards Adherence (BIS):</span>
                    <span className="font-mono font-semibold text-[#A63322]">
                      3 Above · 2 Within
                    </span>
                  </div>
                </div>

                <Link to="/result/sample-ward-12" className="block pt-2">
                  <Button
                    variant="outline-teal"
                    size="sm"
                    className="w-full text-xs font-semibold"
                  >
                    <span>Open Full Screening Result</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-[11px] font-mono uppercase font-bold text-[#0F6477] tracking-wider">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F2A33]">
            Dual-Layer Empirical Screening
          </h2>
          <p className="text-sm text-[#4F6C76] leading-relaxed">
            Separate predictive machine learning inference from deterministic
            regulatory checks for transparent, non-ambiguous screening
            reasoning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#E4F7FF] flex items-center justify-center text-[#0F6477]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-[#0F2A33]">
              Calibrated ML Classification
            </h3>
            <p className="text-xs sm:text-sm text-[#4F6C76] leading-relaxed">
              Platt-calibrated gradient boosted decision trees assign samples to
              three objective empirical risk tiers: <em>Lower Concern</em>,{' '}
              <em>Inconclusive</em>, and <em>Elevated Concern</em>.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#EEF3F5] flex items-center justify-center text-[#41576B]">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-[#0F2A33]">
              Standards Adherence Check
            </h3>
            <p className="text-xs sm:text-sm text-[#4F6C76] leading-relaxed">
              Independent parameter benchmarks evaluate measurements against
              Bureau of Indian Standards (BIS IS 10500) and World Health
              Organization (WHO) Drinking Water Guidelines.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#E2F4EA] flex items-center justify-center text-[#17714A]">
              <ListChecks className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-[#0F2A33]">
              Screening Decision Support
            </h3>
            <p className="text-xs sm:text-sm text-[#4F6C76] leading-relaxed">
              Generates explicit actionable recommendations for container
              sterilization, accredited split-sample laboratory submission, and
              municipal catchment reporting.
            </p>
          </Card>
        </div>
      </section>

      {/* The 9 Fixed Physicochemical Parameters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-mono uppercase font-bold text-[#0F6477] tracking-wider block mb-1">
              INPUT SPECIFICATION
            </span>
            <h2 className="font-display font-bold text-2xl text-[#0F2A33]">
              The 9 Evaluated Parameters
            </h2>
            <p className="text-xs sm:text-sm text-[#4F6C76] mt-1">
              Strictly fixed chemical and physical indicators aligned with
              environmental monitoring standards.
            </p>
          </div>

          <Link to="/analyze">
            <Button size="sm" variant="secondary">
              Analyze Now
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PARAMETERS_CONFIG.map((p) => (
            <Card key={p.key} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display font-semibold text-sm text-[#0F2A33]">
                  {p.fullName}
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#EEF3F5] text-[#4F6C76]">
                  {p.unit || 'pH'}
                </span>
              </div>
              <p className="text-xs text-[#4F6C76] leading-relaxed line-clamp-2">
                {p.tooltip}
              </p>
              <div className="flex justify-between items-center text-[11px] font-mono text-[#6F797C] pt-1 border-t border-[#E7F0F2]">
                <span>{p.baseline}</span>
                <span>{p.category}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* UN SDG 6 Alignment & Responsible Oversight */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <Card className="p-6 sm:p-8 bg-[#E4F7FF]/50 border border-[#BFC8CC] space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[12px] bg-[#004B5A] text-white flex items-center justify-center shrink-0">
              <Globe2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#0F6477]">
                SUSTAINABLE DEVELOPMENT GOAL 6
              </span>
              <h3 className="font-display font-bold text-xl text-[#0F2A33]">
                Empowering Community Water Surveillance
              </h3>
              <p className="text-xs sm:text-sm text-[#4F6C76] leading-relaxed">
                AquaGuard AI advances Target 6.1 (universal and equitable access
                to safe and affordable drinking water) and Target 6.3 (improving
                water quality by reducing pollution and eliminating dumping)
                through open, accessible algorithmic decision-support.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#D5E3E7] text-xs">
            <div className="space-y-2">
              <h4 className="font-semibold text-[#0F2A33]">
                Responsible Algorithmic Policy
              </h4>
              <p className="text-[#4F6C76] leading-relaxed">
                The platform systematically refuses to issue safety
                certifications or sensory assurances. Statistical outputs are
                calibrated against empirical validation sets to prevent
                unwarranted false confidence.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-[#0F2A33]">
                Laboratory Integration
              </h4>
              <p className="text-[#4F6C76] leading-relaxed">
                Field readings with inconclusive or elevated concern flags
                directly trigger automated recommendations for certified
                split-sample laboratory verification.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};
