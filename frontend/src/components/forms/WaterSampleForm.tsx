/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  RotateCcw,
  Check,
  ShieldCheck,
  FlaskConical,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { WaterParameters } from '../../types';
import { PARAMETERS_CONFIG } from '../../config/parameters';
import {
  validateParameterField,
  validateWaterParameters,
} from '../../lib/validation';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { CompletenessMeter } from '../charts/CompletenessRing';
import { apiClient } from '../../api/client';
import { useToast } from '../ui/Toast';

export const WaterSampleForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activePreset, setActivePreset] = useState<
    'ward12' | 'complete' | 'elevated' | 'custom'
  >('ward12');

  const [label, setLabel] = useState('Community tank – Ward 12');
  const [location, setLocation] = useState('Ward 12, Sector 4');
  const [sampledAt, setSampledAt] = useState('2026-10-08 11:42');

  const [params, setParams] = useState<Record<string, string>>({
    ph: '8.9',
    turbidity: '5.4',
    solids: '742',
    conductivity: '1180',
    hardness: '186',
    chloramines: '3.9',
    organic_carbon: '14.2',
    sulfate: '',
    trihalomethanes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<number>(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const steps = [
    'Validating physicochemical parameters...',
    'Imputing missing features with regional priors...',
    'Evaluating calibrated gradient boosting model...',
    'Generating SHAP contributions & regulatory mapping...',
  ];

  // Presets handlers
  const handleLoadPreset = (presetType: 'complete' | 'ward12' | 'elevated') => {
    setActivePreset(presetType);
    if (presetType === 'ward12') {
      setLabel('Community tank – Ward 12');
      setLocation('Ward 12, Sector 4');
      setSampledAt('2026-10-08 11:42');
      setParams({
        ph: '8.9',
        turbidity: '5.4',
        solids: '742',
        conductivity: '1180',
        hardness: '186',
        chloramines: '3.9',
        organic_carbon: '14.2',
        sulfate: '',
        trihalomethanes: '',
      });
      showToast('Loaded benchmark preset: Community tank – Ward 12', 'info');
    } else if (presetType === 'complete') {
      setLabel('Khadakwasla Basin Outlet – Well 03');
      setLocation('Catchment K-South');
      setSampledAt(new Date().toISOString().slice(0, 16).replace('T', ' '));
      setParams({
        ph: '7.2',
        turbidity: '1.8',
        solids: '280',
        conductivity: '420',
        hardness: '195',
        chloramines: '2.1',
        organic_carbon: '4.5',
        sulfate: '240',
        trihalomethanes: '35',
      });
      showToast('Loaded benchmark preset: Complete sample', 'info');
    } else if (presetType === 'elevated') {
      setLabel('Industrial Inflow Canal – Sector 9');
      setLocation('Outfall Drainage Z-09');
      setSampledAt(new Date().toISOString().slice(0, 16).replace('T', ' '));
      setParams({
        ph: '5.4',
        turbidity: '9.2',
        solids: '1240',
        conductivity: '1950',
        hardness: '380',
        chloramines: '5.8',
        organic_carbon: '24.5',
        sulfate: '620',
        trihalomethanes: '110',
      });
      showToast('Loaded benchmark preset: Elevated concern sample', 'info');
    }
  };

  const handleReset = () => {
    setActivePreset('custom');
    setLabel('');
    setLocation('');
    setSampledAt(new Date().toISOString().slice(0, 16).replace('T', ' '));
    const empty: Record<string, string> = {};
    PARAMETERS_CONFIG.forEach((p) => {
      empty[p.key] = '';
    });
    setParams(empty);
    showToast('Form fields cleared', 'info');
  };

  // Compute live input completeness
  const missingParameters: string[] = [];
  let enteredCount = 0;

  PARAMETERS_CONFIG.forEach((p) => {
    const val = params[p.key];
    if (val !== undefined && val.trim() !== '' && !isNaN(Number(val))) {
      enteredCount++;
    } else {
      missingParameters.push(p.label);
    }
  });

  const percent = Math.round((enteredCount / 9) * 100);
  const confidenceTier =
    enteredCount >= 8
      ? 'High Confidence'
      : enteredCount >= 5
        ? 'Moderate Confidence'
        : 'Low Confidence';

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Build typed inputs
    const inputs: WaterParameters = {};
    for (const p of PARAMETERS_CONFIG) {
      const v = params[p.key];
      inputs[p.key] = v !== undefined && v.trim() !== '' ? Number(v) : null;
    }

    const validation = validateWaterParameters(inputs);
    if (!validation.isValid) {
      setSubmitError(
        validation.errors._general ||
          Object.values(validation.errors)[0] ||
          'Please verify the parameters.'
      );
      return;
    }

    setIsSubmitting(true);
    setSubmissionStep(0);

    try {
      // Step 1
      await new Promise((r) => setTimeout(r, 200));
      setSubmissionStep(1);
      // Step 2
      await new Promise((r) => setTimeout(r, 200));
      setSubmissionStep(2);
      // Step 3
      await new Promise((r) => setTimeout(r, 200));
      setSubmissionStep(3);

      const res = await apiClient.analyzeSample(
        inputs,
        label || 'Unlabeled Sample',
        location || 'Field Catchment',
        sampledAt || new Date().toISOString()
      );

      showToast('Sample analysis completed successfully', 'success');
      navigate(`/result/${res.id}`);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to analyze water sample';
      setSubmitError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const coreParams = PARAMETERS_CONFIG.filter(
    (p) => p.category === 'Core Telemetry'
  );
  const chemicalParams = PARAMETERS_CONFIG.filter(
    (p) => p.category === 'Chemical & Residuals'
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Loading Modal / Stepper during analysis */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-[#0A2F3A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E4F7FF] flex items-center justify-center text-[#0F6477]">
                <Zap className="w-4 h-4 animate-pulse" />
              </div>
              <h3 className="font-display font-bold text-base text-[#0F2A33]">
                Processing Sample Telemetry
              </h3>
            </div>

            <div className="space-y-3 pt-2">
              {steps.map((st, i) => (
                <div key={st} className="flex items-center gap-3 text-xs">
                  {i < submissionStep ? (
                    <CheckCircle2 className="w-4 h-4 text-[#17714A] shrink-0" />
                  ) : i === submissionStep ? (
                    <div className="w-4 h-4 rounded-full border-2 border-[#0F6477] border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-[#EEF3F5] shrink-0" />
                  )}
                  <span
                    className={
                      i === submissionStep
                        ? 'font-semibold text-[#0F2A33]'
                        : i < submissionStep
                          ? 'text-[#17714A]'
                          : 'text-[#93A9B0]'
                    }
                  >
                    {st}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Preset Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase font-semibold text-[#6F797C] tracking-wider">
            LOAD BENCHMARK PRESETS
          </span>
          <button
            type="button"
            onClick={() => handleLoadPreset('ward12')}
            className="inline-flex items-center gap-1 text-xs text-[#0F6477] font-semibold hover:underline cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-populate</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleLoadPreset('complete')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              activePreset === 'complete'
                ? 'bg-[#004B5A] text-white border-[#004B5A]'
                : 'bg-white text-[#4F6C76] border-[#D5E3E7] hover:bg-[#F4F9FA]'
            }`}
          >
            Complete sample
          </button>

          <button
            type="button"
            onClick={() => handleLoadPreset('ward12')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              activePreset === 'ward12'
                ? 'bg-[#004B5A] text-white border-[#004B5A]'
                : 'bg-white text-[#4F6C76] border-[#D5E3E7] hover:bg-[#F4F9FA]'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Sample with missing values</span>
          </button>

          <button
            type="button"
            onClick={() => handleLoadPreset('elevated')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              activePreset === 'elevated'
                ? 'bg-[#004B5A] text-white border-[#004B5A]'
                : 'bg-white text-[#4F6C76] border-[#D5E3E7] hover:bg-[#F4F9FA]'
            }`}
          >
            Elevated concern sample
          </button>
        </div>
      </div>

      {/* Input Completeness Meter Card */}
      <Card className="p-4 sm:p-5">
        <CompletenessMeter
          completeness={{
            provided: enteredCount,
            total: 9,
            percent,
            missing: missingParameters,
            confidenceTier,
          }}
          variant="form"
        />
      </Card>

      {/* Section 1: Sample Origin */}
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E7F0F2]">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-[#0F6477]" />
            <h3 className="font-display font-semibold text-sm sm:text-base text-[#0F2A33]">
              Sample Origin
            </h3>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#E4F7FF] text-[#004B5A] border border-[#BFC8CC]">
            Required
          </span>
        </div>

        <div className="space-y-3">
          {/* Sample Label */}
          <div>
            <label className="block text-xs font-semibold text-[#0F2A33] mb-1">
              Sample Label
            </label>
            <div className="relative">
              <input
                type="text"
                value={label}
                onChange={(e) => {
                  setLabel(e.target.value);
                  setActivePreset('custom');
                }}
                placeholder="e.g. Community tank – Ward 12"
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-white border border-[#D5E3E7] text-xs sm:text-sm text-[#0F2A33] placeholder-[#93A9B0] focus:outline-none focus:border-[#0F6477] focus:ring-2 focus:ring-[#22B3C1]/20 transition-colors"
                required
              />
              <FlaskConical className="w-4 h-4 text-[#93A9B0] absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Geographic Catchment */}
          <div>
            <label className="block text-xs font-semibold text-[#0F2A33] mb-1">
              Geographic Catchment
            </label>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setActivePreset('custom');
                }}
                placeholder="e.g. Ward 12, Sector 4"
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-white border border-[#D5E3E7] text-xs sm:text-sm text-[#0F2A33] placeholder-[#93A9B0] focus:outline-none focus:border-[#0F6477] focus:ring-2 focus:ring-[#22B3C1]/20 transition-colors"
              />
              <MapPin className="w-4 h-4 text-[#93A9B0] absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Date & Time Sampled */}
          <div>
            <label className="block text-xs font-semibold text-[#0F2A33] mb-1">
              Date & Time Sampled
            </label>
            <div className="relative">
              <input
                type="text"
                value={sampledAt}
                onChange={(e) => {
                  setSampledAt(e.target.value);
                  setActivePreset('custom');
                }}
                placeholder="YYYY-MM-DD HH:MM"
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-white border border-[#D5E3E7] text-xs sm:text-sm text-[#0F2A33] placeholder-[#93A9B0] focus:outline-none focus:border-[#0F6477] focus:ring-2 focus:ring-[#22B3C1]/20 transition-colors font-mono"
              />
              <Clock className="w-4 h-4 text-[#93A9B0] absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>
      </Card>

      {/* Section 2: Core Telemetry (5 Parameters) */}
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E7F0F2]">
          <div>
            <h3 className="font-display font-semibold text-sm sm:text-base text-[#0F2A33]">
              Core Telemetry
            </h3>
            <p className="text-xs text-[#4F6C76]">
              Standard indicators baseline for empirical water screening tiers.
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-[#D7F2FE] text-[#0F6477] border border-[#8BD1E6] shrink-0">
            5 Parameters
          </span>
        </div>

        <div className="space-y-4">
          {coreParams.map((p) => {
            const raw = params[p.key];
            const num = raw !== '' ? Number(raw) : null;
            const validation = validateParameterField(p.key, num);

            return (
              <div key={p.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[#0F2A33]">
                    <span>{p.label}</span>
                    <Tooltip content={p.tooltip} />
                  </div>
                  <span className="text-[11px] font-mono text-[#6F797C]">
                    {p.baseline}
                  </span>
                </div>

                <div className="flex rounded-[10px] shadow-2xs">
                  <input
                    type="number"
                    step={p.step}
                    value={params[p.key]}
                    onChange={(e) => {
                      setParams({ ...params, [p.key]: e.target.value });
                      setActivePreset('custom');
                    }}
                    placeholder={p.placeholder}
                    className="flex-1 px-3.5 py-2.5 rounded-l-[10px] bg-white border border-[#D5E3E7] text-xs sm:text-sm font-mono font-medium text-[#0F2A33] placeholder-[#93A9B0] focus:outline-none focus:border-[#0F6477] focus:ring-2 focus:ring-[#22B3C1]/20 transition-colors"
                  />
                  <div className="px-3.5 py-2.5 rounded-r-[10px] bg-[#E4F7FF] border border-l-0 border-[#D5E3E7] text-[#004B5A] text-xs font-mono font-semibold flex items-center justify-center min-w-[58px]">
                    {p.unit}
                  </div>
                </div>

                {/* Helper / validation feedback */}
                <div className="flex items-center justify-between text-[11px] px-1">
                  <span
                    className={
                      validation.statusType === 'alert'
                        ? 'text-[#A63322] font-semibold'
                        : validation.statusType === 'valid'
                          ? 'text-[#17714A]'
                          : 'text-[#6F797C]'
                    }
                  >
                    {validation.statusText || 'Normal expected variance'}
                  </span>
                  <span className="text-[#93A9B0] font-mono">
                    {p.scaleLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Section 3: Chemical & Residuals (4 Parameters) */}
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E7F0F2]">
          <div>
            <h3 className="font-display font-semibold text-sm sm:text-base text-[#0F2A33]">
              Chemical & Residuals
            </h3>
            <p className="text-xs text-[#4F6C76]">
              Provide these for maximum predictive confidence across organic
              vectors.
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-[#D7F2FE] text-[#0F6477] border border-[#8BD1E6] shrink-0">
            Optional Enhancements
          </span>
        </div>

        <div className="space-y-4">
          {chemicalParams.map((p) => {
            const raw = params[p.key];
            const num = raw !== '' ? Number(raw) : null;
            const validation = validateParameterField(p.key, num);

            return (
              <div key={p.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[#0F2A33]">
                    <span>{p.label}</span>
                    <Tooltip content={p.tooltip} />
                    {p.isOptional && (
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#E4F7FF] text-[#0F6477] font-normal">
                        Optional
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-[#6F797C]">
                    {p.baseline}
                  </span>
                </div>

                <div className="flex rounded-[10px] shadow-2xs">
                  <input
                    type="number"
                    step={p.step}
                    value={params[p.key]}
                    onChange={(e) => {
                      setParams({ ...params, [p.key]: e.target.value });
                      setActivePreset('custom');
                    }}
                    placeholder={p.placeholder}
                    className="flex-1 px-3.5 py-2.5 rounded-l-[10px] bg-white border border-[#D5E3E7] text-xs sm:text-sm font-mono font-medium text-[#0F2A33] placeholder-[#93A9B0] focus:outline-none focus:border-[#0F6477] focus:ring-2 focus:ring-[#22B3C1]/20 transition-colors"
                  />
                  <div className="px-3.5 py-2.5 rounded-r-[10px] bg-[#E4F7FF] border border-l-0 border-[#D5E3E7] text-[#004B5A] text-xs font-mono font-semibold flex items-center justify-center min-w-[58px]">
                    {p.unit}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] px-1">
                  <span
                    className={
                      validation.statusType === 'alert'
                        ? 'text-[#A63322] font-semibold'
                        : validation.statusType === 'valid'
                          ? 'text-[#17714A]'
                          : 'text-[#6F797C]'
                    }
                  >
                    {validation.statusText}
                  </span>
                  <span className="text-[#93A9B0] font-mono">
                    {p.scaleLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Integrated Quality Sanity Check notice */}
      <div className="flex items-start gap-3 p-3.5 rounded-[12px] bg-[#E4F7FF] border border-[#BFC8CC]/60 text-xs text-[#004B5A] leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-[#0F6477] shrink-0 mt-0.5" />
        <p>
          <strong>Integrated Quality Sanity Check:</strong> Values checked
          dynamically against chemical feasibility bounds (e.g. pH strictly
          constrained [0–14], non-negative conductivity &amp; solids).
        </p>
      </div>

      {/* General Error Banner */}
      {submitError && (
        <div className="flex items-center gap-2 p-3.5 rounded-[10px] bg-[#FBE5E0] border border-[#EDA699] text-xs text-[#A63322] font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <Button
          type="submit"
          size="lg"
          className="w-full h-12 text-sm sm:text-base font-semibold shadow-md bg-[#004B5A] hover:bg-[#0B4A57]"
          isLoading={isSubmitting}
        >
          <Zap className="w-4 h-4 mr-2" />
          <span>Analyze sample</span>
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="md"
          className="w-full"
          onClick={handleReset}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          <span>Reset form</span>
        </Button>
      </div>

      {/* Educational Oversight Box */}
      <div className="flex items-start gap-3 p-3.5 rounded-[12px] bg-[#EEF3F5] border border-[#D5E3E7] text-[11px] sm:text-xs text-[#4F6C76] leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-[#0F6477] shrink-0 mt-0.5" />
        <p>
          <strong>Educational Oversight:</strong> AquaGuard AI is an educational
          decision-support tool. It does not replace certified laboratory
          testing or official regulatory mandates.
        </p>
      </div>
    </form>
  );
};
