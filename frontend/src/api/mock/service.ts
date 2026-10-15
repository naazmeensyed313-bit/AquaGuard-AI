/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ============================================================================
 * PLACEHOLDER SCORER - NOT THE REAL MACHINE LEARNING MODEL
 * ============================================================================
 * This mock service implements a deterministic placeholder heuristic and
 * synthetic SHAP values for local development and UI evaluation of the
 * AquaGuard AI frontend. It is NOT the trained machine learning model and does
 * not perform real geochemical inference.
 *
 * NOTE ON REFERENCE RANGES:
 * Reference ranges and standard thresholds defined here and in parameters
 * configuration are illustrative baselines for testing and must be replaced
 * with verified, authoritative regulatory values from BIS IS 10500 and WHO
 * Guidelines in the production backend service.
 * ============================================================================
 */

import {
  WaterParameters,
  WaterSampleAnalysis,
  MLRiskBand,
  ShapContribution,
  InputCompleteness,
  DashboardSummary,
  BatchRowInput,
  BatchValidationResponse,
  ModelCardData,
  AnalysesFilterParams,
  AnalysesListResponse,
} from '../../types';
import { PARAMETERS_CONFIG } from '../../config/parameters';
import { evaluateStandards } from '../../lib/standards';
import {
  validateWaterParameters,
  validateBatchRow,
} from '../../lib/validation';
import { MOCK_ANALYSES_INITIAL, MOCK_MODEL_CARD } from './data';

const STORAGE_KEY = 'aquaguard_analyses_records_v2';

function getStoredAnalyses(): WaterSampleAnalysis[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ANALYSES_INITIAL));
      return [...MOCK_ANALYSES_INITIAL];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [...MOCK_ANALYSES_INITIAL];
  } catch (err) {
    console.error('Failed to read from localStorage:', err);
    return [...MOCK_ANALYSES_INITIAL];
  }
}

function saveAnalyses(analyses: WaterSampleAnalysis[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
  } catch (err) {
    console.error('Failed to persist to localStorage:', err);
  }
}

export function computeSampleAnalysis(
  inputs: WaterParameters,
  label?: string,
  location?: string,
  collected_at?: string
): WaterSampleAnalysis {
  const missingKeys: string[] = [];
  let providedCount = 0;

  for (const cfg of PARAMETERS_CONFIG) {
    const v = inputs[cfg.key];
    if (v === null || v === undefined || isNaN(Number(v))) {
      missingKeys.push(cfg.fullName);
    } else {
      providedCount++;
    }
  }

  const percent = Math.round((providedCount / 9) * 100);
  const confidenceTier =
    providedCount >= 8
      ? 'High Confidence'
      : providedCount >= 5
        ? 'Moderate Confidence'
        : 'Low Confidence';

  const completeness: InputCompleteness = {
    provided: providedCount,
    total: 9,
    percent,
    missing: missingKeys,
    confidenceTier,
  };

  // Deterministic SHAP-style placeholder scoring
  const base_value = 0.39;
  const contributions: ShapContribution[] = [];

  // Evaluate contributions for provided values
  for (const cfg of PARAMETERS_CONFIG) {
    const v = inputs[cfg.key];
    if (v === null || v === undefined || isNaN(Number(v))) continue;
    const val = Number(v);
    let delta = 0;

    switch (cfg.key) {
      case 'ph':
        if (val >= 6.8 && val <= 7.8) delta = 0.07;
        else if (val >= 6.5 && val <= 8.5) delta = 0.02;
        else delta = -0.06;
        break;
      case 'turbidity':
        if (val <= 2.0) delta = 0.08;
        else if (val <= 5.0) delta = 0.01;
        else delta = -0.07;
        break;
      case 'solids':
        if (val <= 300) delta = 0.08;
        else if (val <= 500) delta = 0.02;
        else delta = -0.06;
        break;
      case 'conductivity':
        if (val <= 600) delta = 0.04;
        else if (val <= 900) delta = 0.01;
        else delta = -0.04;
        break;
      case 'hardness':
        if (val >= 150 && val <= 250) delta = 0.06;
        else if (val <= 300) delta = 0.02;
        else delta = -0.05;
        break;
      case 'chloramines':
        if (val >= 1.5 && val <= 3.5) delta = 0.07;
        else if (val <= 4.0) delta = 0.03;
        else delta = -0.06;
        break;
      case 'organic_carbon':
        if (val <= 6.0) delta = 0.06;
        else if (val <= 10.0) delta = 0.02;
        else delta = -0.06;
        break;
      case 'sulfate':
        if (val >= 150 && val <= 300) delta = 0.05;
        else if (val <= 400) delta = 0.01;
        else delta = -0.05;
        break;
      case 'trihalomethanes':
        if (val <= 40) delta = 0.06;
        else if (val <= 80) delta = 0.01;
        else delta = -0.06;
        break;
    }

    contributions.push({
      parameter: `${cfg.fullName} (${val} ${cfg.unit})`.trim(),
      paramKey: cfg.key,
      value: val,
      unit: cfg.unit,
      contribution: Number(delta.toFixed(2)),
      direction: delta >= 0 ? 'Lower Concern' : 'Elevated Concern',
    });
  }

  // Sort: Elevated Concern (negative) first, then Lower Concern (positive)
  contributions.sort((a, b) => a.contribution - b.contribution);

  const sumDelta = contributions.reduce((acc, c) => acc + c.contribution, 0);
  let rawScore = base_value + sumDelta;
  rawScore = Math.max(0.08, Math.min(0.96, rawScore));
  const finalScore = Number(rawScore.toFixed(2));

  let band: MLRiskBand = 'Inconclusive — lab testing recommended';
  let classifierBias: 'Neutral Band' | 'Elevated Bias' | 'Lower Bias' =
    'Neutral Band';
  let calloutText =
    'The model could not clearly place this sample in either empirical direction. Feature interactions yield counter-balancing weights.';

  if (finalScore < 0.4) {
    band = 'Elevated Concern';
    classifierBias = 'Elevated Bias';
    calloutText =
      'Multiple indicator parameters deviate from normative baseline distributions, depressing the empirical screening score.';
  } else if (finalScore > 0.6) {
    band = 'Lower Concern';
    classifierBias = 'Lower Bias';
    calloutText =
      'Evaluated indicators show strong convergence with normative historical benchmark parameters.';
  }

  // Synthesis text
  let synthesisText = '';
  if (band === 'Inconclusive — lab testing recommended') {
    synthesisText = `The model's screening for this sample is inconclusive. Certain parameters moved the score toward Elevated Concern, while others moved it toward Lower Concern. ${
      missingKeys.length > 0
        ? `${missingKeys.length} inputs were missing, reducing confidence.`
        : 'Conflicting parameter vectors create a neutral balance.'
    } This result should prompt a confirmatory laboratory test, not an operational conclusion.`;
  } else if (band === 'Lower Concern') {
    synthesisText = `The model's screening places this sample in the Lower Concern band. Key physicochemical readings fall within regular empirical brackets. Routine monitoring protocols should remain active.`;
  } else {
    synthesisText = `The model's screening places this sample in the Elevated Concern band. Several parameters significantly exceed normative baseline boundaries. Immediate investigation and laboratory corroboration are advised.`;
  }

  const standards = evaluateStandards(inputs, 'BIS IS 10500');

  const analysis: WaterSampleAnalysis = {
    id: `sample-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: collected_at || new Date().toISOString(),
    label: label || 'Unlabeled Sample',
    location: location || 'Field Sensor Ingestion',
    inputs,
    completeness,
    ml: {
      score: finalScore,
      band,
      classifierBias,
      thresholds: { low: 0.4, high: 0.6 },
      modelVersion: 'v2.4 · Calibrated',
      calloutText,
    },
    shap: {
      base_value,
      contributions,
      final_score: finalScore,
    },
    standards,
    explanation: {
      text: synthesisText,
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
          'Acquiring all 9 physicochemical parameters eliminates statistical imputation variance.',
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
    saved: false,
  };

  return analysis;
}

export const MockApiService = {
  async analyze(
    inputs: WaterParameters,
    label?: string,
    location?: string,
    collected_at?: string
  ): Promise<WaterSampleAnalysis> {
    const validation = validateWaterParameters(inputs);
    if (!validation.isValid) {
      throw new Error(
        validation.errors._general ||
          Object.values(validation.errors).join(', ') ||
          'Invalid parameter inputs'
      );
    }

    const analysis = computeSampleAnalysis(
      inputs,
      label,
      location,
      collected_at
    );
    const existing = getStoredAnalyses();
    existing.unshift(analysis);
    saveAnalyses(existing);
    return analysis;
  },

  async getAnalyses(
    params: AnalysesFilterParams = {}
  ): Promise<AnalysesListResponse> {
    const list = getStoredAnalyses();
    let filtered = [...list];

    if (params.query) {
      const q = params.query.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.label.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
      );
    }

    if (params.band && params.band !== 'all') {
      filtered = filtered.filter((a) => a.ml.band === params.band);
    }

    // Sort
    const sortBy = params.sortBy || 'created_at';
    const sortOrder = params.sortOrder || 'desc';
    filtered.sort((a, b) => {
      let valA: string | number = a.created_at;
      let valB: string | number = b.created_at;
      if (sortBy === 'score') {
        valA = a.ml.score;
        valB = b.ml.score;
      } else if (sortBy === 'label') {
        valA = a.label;
        valB = b.label;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const items = filtered.slice(startIndex, startIndex + pageSize);

    return {
      items,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize) || 1,
    };
  },

  async getAnalysisById(id: string): Promise<WaterSampleAnalysis> {
    const list = getStoredAnalyses();
    const found = list.find((a) => a.id === id);
    if (!found) {
      // Fallback: if it's the seed ID 'sample-ward-12'
      if (id === 'sample-ward-12') return MOCK_ANALYSES_INITIAL[0];
      throw new Error(`Analysis with ID '${id}' not found.`);
    }
    return found;
  },

  async deleteAnalysis(id: string): Promise<boolean> {
    const list = getStoredAnalyses();
    const updated = list.filter((a) => a.id !== id);
    saveAnalyses(updated);
    return true;
  },

  async toggleSaved(id: string): Promise<WaterSampleAnalysis> {
    const list = getStoredAnalyses();
    const item = list.find((a) => a.id === id);
    if (!item) throw new Error(`Analysis not found`);
    item.saved = !item.saved;
    saveAnalyses(list);
    return item;
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    const list = getStoredAnalyses();

    let lowerCount = 0;
    let inconfCount = 0;
    let elevatedCount = 0;
    let totalCompleteness = 0;

    for (const item of list) {
      if (item.ml.band === 'Lower Concern') lowerCount++;
      else if (item.ml.band === 'Elevated Concern') elevatedCount++;
      else inconfCount++;
      totalCompleteness += item.completeness.percent;
    }

    const avgComp =
      list.length > 0 ? Math.round(totalCompleteness / list.length) : 0;

    // Distribution in buckets
    const buckets = [
      { range: '0.00 – 0.20', count: 0 },
      { range: '0.21 – 0.40', count: 0 },
      { range: '0.41 – 0.60', count: 0 },
      { range: '0.61 – 0.80', count: 0 },
      { range: '0.81 – 1.00', count: 0 },
    ];

    for (const item of list) {
      const s = item.ml.score;
      if (s <= 0.2) buckets[0].count++;
      else if (s <= 0.4) buckets[1].count++;
      else if (s <= 0.6) buckets[2].count++;
      else if (s <= 0.8) buckets[3].count++;
      else buckets[4].count++;
    }

    // Averages across parameters
    const paramAverages = PARAMETERS_CONFIG.map((cfg) => {
      let sum = 0;
      let count = 0;
      for (const item of list) {
        const v = item.inputs[cfg.key];
        if (v !== null && v !== undefined && !isNaN(Number(v))) {
          sum += Number(v);
          count++;
        }
      }
      return {
        parameter: cfg.fullName,
        average: count > 0 ? Number((sum / count).toFixed(1)) : 0,
        unit: cfg.unit,
      };
    });

    return {
      totalAnalyses: list.length,
      lowerConcernCount: lowerCount,
      inconclusiveCount: inconfCount,
      elevatedConcernCount: elevatedCount,
      averageCompleteness: avgComp,
      recentAnalyses: list.slice(0, 5),
      scoreDistribution: buckets,
      parameterAverages: paramAverages,
    };
  },

  async validateBatch(
    rows: Partial<BatchRowInput>[]
  ): Promise<BatchValidationResponse> {
    const validRows: BatchRowInput[] = [];
    const invalidRows: BatchRowInput[] = [];
    const errorsSummary: { row: number; field: string; message: string }[] = [];

    rows.forEach((r, idx) => {
      const validated = validateBatchRow(r, idx + 1);
      if (validated.isValid) {
        validRows.push(validated);
      } else {
        invalidRows.push(validated);
        validated.validationErrors?.forEach((err) => {
          errorsSummary.push({ row: idx + 1, field: 'General', message: err });
        });
      }
    });

    return {
      validRows,
      invalidRows,
      totalRows: rows.length,
      errorsSummary,
    };
  },

  async analyzeBatch(
    validRows: BatchRowInput[]
  ): Promise<WaterSampleAnalysis[]> {
    const results: WaterSampleAnalysis[] = [];
    const existing = getStoredAnalyses();

    for (const row of validRows) {
      const inputs: WaterParameters = {
        ph: row.ph !== undefined && row.ph !== null ? Number(row.ph) : null,
        turbidity:
          row.turbidity !== undefined && row.turbidity !== null
            ? Number(row.turbidity)
            : null,
        solids:
          row.solids !== undefined && row.solids !== null
            ? Number(row.solids)
            : null,
        conductivity:
          row.conductivity !== undefined && row.conductivity !== null
            ? Number(row.conductivity)
            : null,
        hardness:
          row.hardness !== undefined && row.hardness !== null
            ? Number(row.hardness)
            : null,
        chloramines:
          row.chloramines !== undefined && row.chloramines !== null
            ? Number(row.chloramines)
            : null,
        organic_carbon:
          row.organic_carbon !== undefined && row.organic_carbon !== null
            ? Number(row.organic_carbon)
            : null,
        sulfate:
          row.sulfate !== undefined && row.sulfate !== null
            ? Number(row.sulfate)
            : null,
        trihalomethanes:
          row.trihalomethanes !== undefined && row.trihalomethanes !== null
            ? Number(row.trihalomethanes)
            : null,
      };

      const analysis = computeSampleAnalysis(
        inputs,
        row.label,
        row.location,
        new Date().toISOString()
      );
      results.push(analysis);
      existing.unshift(analysis);
    }

    saveAnalyses(existing);
    return results;
  },

  async getModelCard(): Promise<ModelCardData> {
    return MOCK_MODEL_CARD;
  },

  async getHealth(): Promise<{
    status: string;
    uptime: number;
    version: string;
  }> {
    return {
      status: 'operational',
      uptime: 3600,
      version: 'v2.4-calibrated',
    };
  },
};
