/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  WaterSampleAnalysis,
  ModelCardData,
} from '../../types';
import { evaluateStandards } from '../../lib/standards';

export const SEED_WARD_12: WaterSampleAnalysis = {
  id: 'sample-ward-12',
  created_at: '2026-10-08T11:42:00Z',
  label: 'Community tank – Ward 12',
  location: 'Station G-04',
  inputs: {
    ph: 8.9,
    turbidity: 5.4,
    solids: 742,
    conductivity: 1180,
    hardness: 186,
    chloramines: 3.9,
    organic_carbon: 14.2,
    sulfate: null,
    trihalomethanes: null,
  },
  completeness: {
    provided: 7,
    total: 9,
    percent: 78,
    missing: ['Sulfate (SO₄²⁻)', 'Trihalomethanes'],
    confidenceTier: 'Moderate Confidence',
  },
  ml: {
    score: 0.47,
    band: 'Inconclusive — lab testing recommended',
    classifierBias: 'Neutral Band',
    thresholds: {
      low: 0.4,
      high: 0.6,
    },
    modelVersion: 'v2.4 · Calibrated',
    calloutText:
      'The model could not clearly place this sample in either empirical direction. Feature interactions yield counter-balancing weights.',
  },
  shap: {
    base_value: 0.39,
    contributions: [
      {
        parameter: 'Turbidity (5.4 NTU)',
        paramKey: 'turbidity',
        value: 5.4,
        unit: 'NTU',
        contribution: -0.05,
        direction: 'Elevated Concern',
      },
      {
        parameter: 'Solids / TDS (742 mg/L)',
        paramKey: 'solids',
        value: 742,
        unit: 'mg/L',
        contribution: -0.04,
        direction: 'Elevated Concern',
      },
      {
        parameter: 'pH (8.9)',
        paramKey: 'ph',
        value: 8.9,
        unit: 'pH',
        contribution: -0.03,
        direction: 'Elevated Concern',
      },
      {
        parameter: 'Chloramines (3.9 mg/L)',
        paramKey: 'chloramines',
        value: 3.9,
        unit: 'mg/L',
        contribution: 0.07,
        direction: 'Lower Concern',
      },
      {
        parameter: 'Hardness (186 mg/L)',
        paramKey: 'hardness',
        value: 186,
        unit: 'mg/L',
        contribution: 0.06,
        direction: 'Lower Concern',
      },
      {
        parameter: 'Organic Carbon (14.2 mg/L)',
        paramKey: 'organic_carbon',
        value: 14.2,
        unit: 'mg/L',
        contribution: 0.05,
        direction: 'Lower Concern',
      },
      {
        parameter: 'Conductivity (1,180 µS/cm)',
        paramKey: 'conductivity',
        value: 1180,
        unit: 'µS/cm',
        contribution: 0.02,
        direction: 'Lower Concern',
      },
    ],
    final_score: 0.47,
  },
  standards: evaluateStandards(
    {
      ph: 8.9,
      turbidity: 5.4,
      solids: 742,
      conductivity: 1180,
      hardness: 186,
      chloramines: 3.9,
      organic_carbon: 14.2,
      sulfate: null,
      trihalomethanes: null,
    },
    'BIS IS 10500'
  ),
  explanation: {
    text: "The model's screening for this sample is inconclusive. Higher turbidity and total dissolved solids moved the score toward Elevated Concern, while hardness and chloramines moved it the other way. Two inputs were missing, so confidence is reduced. This result should prompt a confirmatory laboratory test, not an operational conclusion.",
    source: 'template',
  },
  recommendations: [
    {
      id: 'rec-1',
      title: 'Confirm with an accredited laboratory',
      description:
        'Dispatch split samples to certified testing facilities to resolve parameter ambiguities.',
      iconName: 'flask',
    },
    {
      id: 'rec-2',
      title: 'Re-test and document sampling protocol',
      description:
        'Record container sterilization class, collection timestamp, ambient temperature, and transport lag.',
      iconName: 'calendar',
    },
    {
      id: 'rec-3',
      title: 'Include unrecorded parameters',
      description:
        'Acquiring Sulfate and Trihalomethanes values will eliminate statistical imputation variance.',
      iconName: 'checklist',
    },
    {
      id: 'rec-4',
      title: 'Consult local regulatory water authorities',
      description:
        'Review historical municipal catchment reports and regional public water advisory notices.',
      iconName: 'building',
    },
  ],
  limitations: [
    'Screening models rely strictly on standard physicochemical indicators and cannot detect microbiological pathogens (e.g., E. coli, Giardia, Cryptosporidium).',
    'Heavy metal ions (lead, arsenic, cadmium, mercury) and emerging contaminants (PFAS, microplastics, pharmaceutical residues) require dedicated spectroscopic laboratory assays.',
    'Imputed values carry baseline hydrological distributions and do not substitute for actual point-source sensor measurement.',
    'Does not constitute official certification under WHO, BIS, US EPA, or EU Drinking Water Directives.',
  ],
  saved: true,
};

export const SEED_LOWER_CONCERN: WaterSampleAnalysis = {
  id: 'sample-khadakwasla-03',
  created_at: '2026-10-09T08:15:00Z',
  label: 'Khadakwasla Basin Outlet – Well 03',
  location: 'Catchment K-South',
  inputs: {
    ph: 7.2,
    turbidity: 1.8,
    solids: 280,
    conductivity: 420,
    hardness: 195,
    chloramines: 2.1,
    organic_carbon: 4.5,
    sulfate: 240,
    trihalomethanes: 35,
  },
  completeness: {
    provided: 9,
    total: 9,
    percent: 100,
    missing: [],
    confidenceTier: 'High Confidence',
  },
  ml: {
    score: 0.78,
    band: 'Lower Concern',
    classifierBias: 'Lower Bias',
    thresholds: { low: 0.4, high: 0.6 },
    modelVersion: 'v2.4 · Calibrated',
    calloutText:
      'Parameter metrics align closely with historical non-exceedance profiles. Balanced physicochemical indicators provide steady screening confidence.',
  },
  shap: {
    base_value: 0.39,
    contributions: [
      {
        parameter: 'Turbidity (1.8 NTU)',
        paramKey: 'turbidity',
        value: 1.8,
        unit: 'NTU',
        contribution: 0.09,
        direction: 'Lower Concern',
      },
      {
        parameter: 'Solids / TDS (280 mg/L)',
        paramKey: 'solids',
        value: 280,
        unit: 'mg/L',
        contribution: 0.08,
        direction: 'Lower Concern',
      },
      {
        parameter: 'pH (7.2)',
        paramKey: 'ph',
        value: 7.2,
        unit: 'pH',
        contribution: 0.07,
        direction: 'Lower Concern',
      },
      {
        parameter: 'Chloramines (2.1 mg/L)',
        paramKey: 'chloramines',
        value: 2.1,
        unit: 'mg/L',
        contribution: 0.06,
        direction: 'Lower Concern',
      },
      {
        parameter: 'Hardness (195 mg/L)',
        paramKey: 'hardness',
        value: 195,
        unit: 'mg/L',
        contribution: 0.05,
        direction: 'Lower Concern',
      },
      {
        parameter: 'Organic Carbon (4.5 mg/L)',
        paramKey: 'organic_carbon',
        value: 4.5,
        unit: 'mg/L',
        contribution: 0.04,
        direction: 'Lower Concern',
      },
    ],
    final_score: 0.78,
  },
  standards: evaluateStandards(
    {
      ph: 7.2,
      turbidity: 1.8,
      solids: 280,
      conductivity: 420,
      hardness: 195,
      chloramines: 2.1,
      organic_carbon: 4.5,
      sulfate: 240,
      trihalomethanes: 35,
    },
    'BIS IS 10500'
  ),
  explanation: {
    text: 'All 9 evaluated physical and chemical parameters fall within established normative ranges. Low turbidity, neutral pH, and moderate mineralization contribute positively toward the Lower Concern tier.',
    source: 'template',
  },
  recommendations: [
    {
      id: 'rec-1',
      title: 'Maintain periodic baseline logging',
      description: 'Continue scheduled sensor telemetry and quarterly laboratory split-sample audit.',
      iconName: 'calendar',
    },
    {
      id: 'rec-2',
      title: 'Archive catchment parameters',
      description: 'Store telemetry records in municipal environmental registry for longitudinal trend detection.',
      iconName: 'building',
    },
  ],
  limitations: [
    'Screening models rely strictly on standard physicochemical indicators and cannot detect microbiological pathogens.',
    'Heavy metals and synthetic pesticides require dedicated chemical instrumentation.',
  ],
  saved: false,
};

export const SEED_ELEVATED_CONCERN: WaterSampleAnalysis = {
  id: 'sample-industrial-canal-09',
  created_at: '2026-10-09T14:30:00Z',
  label: 'Industrial Inflow Canal – Sector 9',
  location: 'Outfall Drainage Z-09',
  inputs: {
    ph: 5.4,
    turbidity: 9.2,
    solids: 1240,
    conductivity: 1950,
    hardness: 380,
    chloramines: 5.8,
    organic_carbon: 24.5,
    sulfate: 620,
    trihalomethanes: 110,
  },
  completeness: {
    provided: 9,
    total: 9,
    percent: 100,
    missing: [],
    confidenceTier: 'High Confidence',
  },
  ml: {
    score: 0.22,
    band: 'Elevated Concern',
    classifierBias: 'Elevated Bias',
    thresholds: { low: 0.4, high: 0.6 },
    modelVersion: 'v2.4 · Calibrated',
    calloutText:
      'Multiple indicator parameters deviate sharply from normative hydrologic distributions. Elevated solids, acidity, and organic carbon compounds depress the screening index.',
  },
  shap: {
    base_value: 0.39,
    contributions: [
      {
        parameter: 'Solids / TDS (1,240 mg/L)',
        paramKey: 'solids',
        value: 1240,
        unit: 'mg/L',
        contribution: -0.08,
        direction: 'Elevated Concern',
      },
      {
        parameter: 'Organic Carbon (24.5 mg/L)',
        paramKey: 'organic_carbon',
        value: 24.5,
        unit: 'mg/L',
        contribution: -0.06,
        direction: 'Elevated Concern',
      },
      {
        parameter: 'Turbidity (9.2 NTU)',
        paramKey: 'turbidity',
        value: 9.2,
        unit: 'NTU',
        contribution: -0.05,
        direction: 'Elevated Concern',
      },
      {
        parameter: 'pH (5.4)',
        paramKey: 'ph',
        value: 5.4,
        unit: 'pH',
        contribution: -0.05,
        direction: 'Elevated Concern',
      },
      {
        parameter: 'Chloramines (5.8 mg/L)',
        paramKey: 'chloramines',
        value: 5.8,
        unit: 'mg/L',
        contribution: -0.04,
        direction: 'Elevated Concern',
      },
    ],
    final_score: 0.22,
  },
  standards: evaluateStandards(
    {
      ph: 5.4,
      turbidity: 9.2,
      solids: 1240,
      conductivity: 1950,
      hardness: 380,
      chloramines: 5.8,
      organic_carbon: 24.5,
      sulfate: 620,
      trihalomethanes: 110,
    },
    'BIS IS 10500'
  ),
  explanation: {
    text: 'Several key parameters demonstrate severe variance. Acidic conditions (pH 5.4), extreme turbidity (9.2 NTU), and high total dissolved solids (1,240 mg/L) drive the classifier into the Elevated Concern tier. Immediate investigative screening is warranted.',
    source: 'template',
  },
  recommendations: [
    {
      id: 'rec-1',
      title: 'Notify catchment management team',
      description: 'Trigger immediate catchment inspection for point-source discharge or runoff intrusion.',
      iconName: 'building',
    },
    {
      id: 'rec-2',
      title: 'Initiate priority laboratory spectrum test',
      description: 'Dispatch split samples for heavy metal spectrometry and biological assay.',
      iconName: 'flask',
    },
  ],
  limitations: [
    'Empirical classifier output flags statistical anomaly, not regulatory legal violation.',
  ],
  saved: true,
};

export const SEED_LOW_COMPLETENESS: WaterSampleAnalysis = {
  id: 'sample-borewell-4b',
  created_at: '2026-10-10T16:05:00Z',
  label: 'Peri-urban Borewell 4B',
  location: 'Zone 7 Infiltration Pit',
  inputs: {
    ph: 6.8,
    turbidity: 3.1,
    solids: 410,
    conductivity: 620,
    hardness: null,
    chloramines: null,
    organic_carbon: null,
    sulfate: null,
    trihalomethanes: null,
  },
  completeness: {
    provided: 4,
    total: 9,
    percent: 44,
    missing: [
      'Hardness',
      'Chloramines',
      'Organic Carbon (TOC)',
      'Sulfate (SO₄²⁻)',
      'Trihalomethanes',
    ],
    confidenceTier: 'Low Confidence',
  },
  ml: {
    score: 0.49,
    band: 'Inconclusive — lab testing recommended',
    classifierBias: 'Neutral Band',
    thresholds: { low: 0.4, high: 0.6 },
    modelVersion: 'v2.4 · Calibrated',
    calloutText:
      'Low parameter completeness (4/9). Bayesian imputation fills 5 unrecorded dimensions, heavily inflating predictive variance bounds.',
  },
  shap: {
    base_value: 0.39,
    contributions: [
      {
        parameter: 'pH (6.8)',
        paramKey: 'ph',
        value: 6.8,
        unit: 'pH',
        contribution: 0.05,
        direction: 'Lower Concern',
      },
      {
        parameter: 'Solids / TDS (410 mg/L)',
        paramKey: 'solids',
        value: 410,
        unit: 'mg/L',
        contribution: 0.03,
        direction: 'Lower Concern',
      },
      {
        parameter: 'Turbidity (3.1 NTU)',
        paramKey: 'turbidity',
        value: 3.1,
        unit: 'NTU',
        contribution: 0.02,
        direction: 'Lower Concern',
      },
    ],
    final_score: 0.49,
  },
  standards: evaluateStandards(
    {
      ph: 6.8,
      turbidity: 3.1,
      solids: 410,
      conductivity: 620,
      hardness: null,
      chloramines: null,
      organic_carbon: null,
      sulfate: null,
      trihalomethanes: null,
    },
    'BIS IS 10500'
  ),
  explanation: {
    text: 'Predictive confidence is degraded because 5 of 9 indicators were not recorded. While observed pH and conductivity are within ordinary bounds, chemical residuals remain unobserved.',
    source: 'template',
  },
  recommendations: [
    {
      id: 'rec-1',
      title: 'Conduct complete parameter panel',
      description: 'Acquire readings for hardness, chloramines, TOC, and sulfate to complete the screening model input vector.',
      iconName: 'checklist',
    },
  ],
  limitations: [
    'Low input completeness limits model fidelity. Imputed parameters introduce significant statistical bias.',
  ],
  saved: false,
};

export const MOCK_ANALYSES_INITIAL: WaterSampleAnalysis[] = [
  SEED_WARD_12,
  SEED_LOWER_CONCERN,
  SEED_ELEVATED_CONCERN,
  SEED_LOW_COMPLETENESS,
];

export const MOCK_MODEL_CARD: ModelCardData = {
  version: 'v2.4 (Calibrated)',
  architecture: 'Gradient Boosting Classifier (Histogram-based GBDT + Platt Scaling)',
  dataset: 'Kaggle Water Quality Archive (3,276 records, 9 physicochemical parameters)',
  calibrated: true,
  metrics: {
    accuracy: 0.814,
    precision: 0.792,
    recall: 0.825,
    f1Score: 0.808,
    rocAuc: 0.871,
    brierScore: 0.138,
  },
  modelsBenchmark: [
    {
      model: 'Calibrated GBDT (Selected v2.4)',
      accuracy: 0.814,
      precision: 0.792,
      recall: 0.825,
      f1: 0.808,
      rocAuc: 0.871,
    },
    {
      model: 'Random Forest Ensemble',
      accuracy: 0.791,
      precision: 0.768,
      recall: 0.802,
      f1: 0.784,
      rocAuc: 0.852,
    },
    {
      model: 'Support Vector Machine (RBF)',
      accuracy: 0.745,
      precision: 0.719,
      recall: 0.758,
      f1: 0.738,
      rocAuc: 0.806,
    },
    {
      model: 'Multi-layer Perceptron (2-layer)',
      accuracy: 0.762,
      precision: 0.735,
      recall: 0.771,
      f1: 0.752,
      rocAuc: 0.824,
    },
    {
      model: 'Logistic Regression (ElasticNet)',
      accuracy: 0.683,
      precision: 0.654,
      recall: 0.697,
      f1: 0.675,
      rocAuc: 0.731,
    },
  ],
  confusionMatrix: {
    tp: 382,
    fp: 87,
    fn: 74,
    tn: 439,
  },
  rocCurve: [
    { fpr: 0.0, tpr: 0.0 },
    { fpr: 0.05, tpr: 0.28 },
    { fpr: 0.1, tpr: 0.49 },
    { fpr: 0.15, tpr: 0.66 },
    { fpr: 0.2, tpr: 0.77 },
    { fpr: 0.25, tpr: 0.83 },
    { fpr: 0.35, tpr: 0.89 },
    { fpr: 0.5, tpr: 0.94 },
    { fpr: 0.7, tpr: 0.97 },
    { fpr: 1.0, tpr: 1.0 },
  ],
  prCurve: [
    { recall: 0.0, precision: 0.95 },
    { recall: 0.2, precision: 0.91 },
    { recall: 0.4, precision: 0.87 },
    { recall: 0.6, precision: 0.83 },
    { recall: 0.8, precision: 0.78 },
    { recall: 0.9, precision: 0.71 },
    { recall: 1.0, precision: 0.58 },
  ],
  calibrationCurve: [
    { meanPredicted: 0.1, observedFraction: 0.11 },
    { meanPredicted: 0.25, observedFraction: 0.24 },
    { meanPredicted: 0.4, observedFraction: 0.41 },
    { meanPredicted: 0.55, observedFraction: 0.53 },
    { meanPredicted: 0.7, observedFraction: 0.69 },
    { meanPredicted: 0.85, observedFraction: 0.86 },
    { meanPredicted: 0.95, observedFraction: 0.94 },
  ],
};
