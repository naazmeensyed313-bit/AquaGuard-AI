/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NOTE ON REFERENCE RANGES:
 * Standard thresholds and reference ranges defined here (e.g., standardBIS and standardWHO)
 * are illustrative frontend baselines used for client-side guidance and mock evaluations.
 * In production connected mode, authoritative regulatory evaluations are returned by the
 * API backend and must be validated against official Bureau of Indian Standards (BIS IS 10500)
 * and World Health Organization (WHO) publications.
 */

import { WaterParameters } from '../types';

export interface ParameterConfig {
  key: keyof WaterParameters;
  label: string;
  fullName: string;
  unit: string;
  category: 'Core Telemetry' | 'Chemical & Residuals';
  minVal: number;
  maxVal?: number;
  baseline: string;
  scaleLabel: string;
  step: number;
  placeholder: string;
  isOptional?: boolean;
  tooltip: string;
  standardBIS: {
    min?: number;
    max?: number;
    label: string;
    hasFormalStandard: boolean;
  };
  standardWHO: {
    min?: number;
    max?: number;
    label: string;
    hasFormalStandard: boolean;
  };
}

export const PARAMETERS_CONFIG: ParameterConfig[] = [
  {
    key: 'ph',
    label: 'pH Acidity Scale',
    fullName: 'pH (Potential of Hydrogen)',
    unit: 'pH',
    category: 'Core Telemetry',
    minVal: 0.0,
    maxVal: 14.0,
    baseline: 'Baseline: 6.5–8.5',
    scaleLabel: 'Valid: 0.0 – 14.0',
    step: 0.1,
    placeholder: 'e.g. 7.2',
    tooltip:
      'Measures water acidity vs alkalinity. Acidic (< 6.5) can corrode pipes; alkaline (> 8.5) can cause scale encrustation and bitter taste.',
    standardBIS: {
      min: 6.5,
      max: 8.5,
      label: 'Standard: 6.5 – 8.5',
      hasFormalStandard: true,
    },
    standardWHO: {
      min: 6.5,
      max: 8.5,
      label: 'Standard: 6.5 – 8.5',
      hasFormalStandard: true,
    },
  },
  {
    key: 'turbidity',
    label: 'Turbidity',
    fullName: 'Turbidity',
    unit: 'NTU',
    category: 'Core Telemetry',
    minVal: 0.0,
    maxVal: 50.0,
    baseline: 'Baseline: 1.0–5.0 NTU',
    scaleLabel: 'Scale: ≥ 0 NTU',
    step: 0.1,
    placeholder: 'e.g. 2.1',
    tooltip:
      'Cloudiness caused by suspended colloids and particles. High turbidity shields microorganisms from disinfection and indicates filtration breakthrough.',
    standardBIS: {
      min: 1.0,
      max: 5.0,
      label: 'Standard: 1.0 – 5.0 NTU',
      hasFormalStandard: true,
    },
    standardWHO: {
      min: 0.0,
      max: 4.0,
      label: 'Standard: < 4.0 NTU',
      hasFormalStandard: true,
    },
  },
  {
    key: 'solids',
    label: 'Solids (TDS)',
    fullName: 'Solids / TDS',
    unit: 'mg/L',
    category: 'Core Telemetry',
    minVal: 0,
    maxVal: 5000,
    baseline: 'Baseline: < 500 mg/L',
    scaleLabel: 'Positive value',
    step: 1,
    placeholder: 'e.g. 350',
    tooltip:
      'Total Dissolved Solids: inorganic salts (calcium, magnesium, potassium, sodium, chlorides, sulfates) and dissolved matter. High TDS impacts taste and scaling.',
    standardBIS: {
      max: 500,
      label: 'Standard limit: 500 mg/L',
      hasFormalStandard: true,
    },
    standardWHO: {
      max: 600,
      label: 'Standard guideline: < 600 mg/L',
      hasFormalStandard: true,
    },
  },
  {
    key: 'conductivity',
    label: 'Electrical Conductivity',
    fullName: 'Conductivity',
    unit: 'µS/cm',
    category: 'Core Telemetry',
    minVal: 0,
    maxVal: 10000,
    baseline: 'Baseline: < 800 µS/cm',
    scaleLabel: '> 0 µS/cm',
    step: 1,
    placeholder: 'e.g. 450',
    tooltip:
      'Electrical current conduction capacity directly proportional to ionic solute concentration. Useful indicator of dissolved mineral surges or industrial runoff.',
    standardBIS: {
      label: 'Informational baseline',
      hasFormalStandard: false,
    },
    standardWHO: {
      label: 'Informational baseline',
      hasFormalStandard: false,
    },
  },
  {
    key: 'hardness',
    label: 'Total Hardness (CaCO3)',
    fullName: 'Hardness',
    unit: 'mg/L',
    category: 'Core Telemetry',
    minVal: 0,
    maxVal: 1500,
    baseline: 'Baseline: 100–300 mg/L',
    scaleLabel: 'Scale: ≥ 0 mg/L',
    step: 1,
    placeholder: 'e.g. 180',
    tooltip:
      'Concentration of dissolved polyvalent metallic ions, primarily calcium and magnesium. Affects soap lathering, pipe scaling, and culinary suitability.',
    standardBIS: {
      min: 200,
      max: 300,
      label: 'Standard: 200 – 300 mg/L',
      hasFormalStandard: true,
    },
    standardWHO: {
      min: 100,
      max: 300,
      label: 'Aesthetic benchmark: 100 – 300 mg/L',
      hasFormalStandard: false,
    },
  },
  {
    key: 'chloramines',
    label: 'Chloramines',
    fullName: 'Chloramines',
    unit: 'mg/L',
    category: 'Chemical & Residuals',
    minVal: 0,
    maxVal: 20,
    baseline: 'Target: < 4.0 mg/L',
    scaleLabel: 'Non-negative',
    step: 0.1,
    placeholder: 'e.g. 2.4',
    tooltip:
      'Chemical disinfectants formed by chlorine addition to aqueous ammonia. Controls biofilm in distribution networks with lower byproduct formation than free chlorine.',
    standardBIS: {
      max: 4.0,
      label: 'Standard max: 4.0 mg/L',
      hasFormalStandard: true,
    },
    standardWHO: {
      max: 3.0,
      label: 'Standard guideline: < 3.0 mg/L',
      hasFormalStandard: true,
    },
  },
  {
    key: 'organic_carbon',
    label: 'Total Organic Carbon (TOC)',
    fullName: 'Organic Carbon (TOC)',
    unit: 'mg/L',
    category: 'Chemical & Residuals',
    minVal: 0,
    maxVal: 100,
    baseline: 'Baseline: < 10.0 mg/L',
    scaleLabel: '≥ 0 mg/L',
    step: 0.1,
    placeholder: 'e.g. 5.5',
    tooltip:
      'Direct sum of carbon contained within organic compounds. Precursor to disinfection byproducts (THMs/HAAs) during chlorination processes.',
    standardBIS: {
      label: 'Informational baseline',
      hasFormalStandard: false,
    },
    standardWHO: {
      label: 'Informational baseline',
      hasFormalStandard: false,
    },
  },
  {
    key: 'sulfate',
    label: 'Sulfate (SO4)',
    fullName: 'Sulfate (SO₄²⁻)',
    unit: 'mg/L',
    category: 'Chemical & Residuals',
    minVal: 0,
    maxVal: 1000,
    baseline: '250–500 mg/L',
    scaleLabel: 'Ref: < 250 mg/L',
    step: 1,
    placeholder: '250–500 mg/L',
    isOptional: true,
    tooltip:
      'Inorganic salt anion. Naturally occurring in mineral deposits and industrial discharge. High levels (> 500 mg/L) impart bitter taste and cathartic laxative effects.',
    standardBIS: {
      min: 200,
      max: 400,
      label: 'Standard: 200 – 400 mg/L',
      hasFormalStandard: true,
    },
    standardWHO: {
      max: 500,
      label: 'Guideline max: 500 mg/L',
      hasFormalStandard: true,
    },
  },
  {
    key: 'trihalomethanes',
    label: 'Trihalomethanes (THM)',
    fullName: 'Trihalomethanes',
    unit: 'µg/L',
    category: 'Chemical & Residuals',
    minVal: 0,
    maxVal: 500,
    baseline: '< 80 µg/L',
    scaleLabel: 'Ref: < 80 µg/L',
    step: 0.1,
    placeholder: '< 80 µg/L',
    isOptional: true,
    tooltip:
      'Volatile halogenated disinfection byproducts (chloroform, bromoform, etc.) resulting from chlorine reacting with natural organic carbon matter.',
    standardBIS: {
      max: 80,
      label: 'Standard limit: 80 µg/L',
      hasFormalStandard: true,
    },
    standardWHO: {
      max: 100,
      label: 'Guideline sum: < 100 µg/L',
      hasFormalStandard: true,
    },
  },
];
