/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WaterParameters, BatchRowInput } from '../types';
import { PARAMETERS_CONFIG } from '../config/parameters';

export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
  statusText?: string;
  statusType?: 'valid' | 'warning' | 'alert' | 'neutral';
}

export function validateParameterField(
  key: keyof WaterParameters,
  val: number | null | undefined
): FieldValidationResult {
  if (val === null || val === undefined || isNaN(val)) {
    return { isValid: true, statusText: 'Unspecified — Imputation applied', statusType: 'neutral' };
  }

  const config = PARAMETERS_CONFIG.find((p) => p.key === key);
  if (!config) return { isValid: true };

  // Strict physical/chemical boundaries
  if (key === 'ph') {
    if (val < 0.0 || val > 14.0) {
      return { isValid: false, error: 'pH must be between 0.0 and 14.0', statusType: 'alert' };
    }
    if (val > 8.5) {
      return { isValid: true, warning: 'Alkaline variance', statusText: '↑ Alkaline variance', statusType: 'alert' };
    }
    if (val < 6.5) {
      return { isValid: true, warning: 'Acidic variance', statusText: '↓ Acidic variance', statusType: 'alert' };
    }
    return { isValid: true, statusText: '✓ Normal pH range', statusType: 'valid' };
  }

  if (val < 0) {
    return { isValid: false, error: 'Value cannot be negative', statusType: 'alert' };
  }

  if (key === 'turbidity') {
    if (val > 5.0) {
      return { isValid: true, statusText: '! Exceeds clarity ideal', statusType: 'alert' };
    }
    return { isValid: true, statusText: '✓ Optical clarity within norm', statusType: 'valid' };
  }

  if (key === 'solids') {
    if (val > 500) {
      return { isValid: true, statusText: '↑ Elevated mineral solids', statusType: 'alert' };
    }
    return { isValid: true, statusText: '✓ Typical mineral solids', statusType: 'valid' };
  }

  if (key === 'conductivity') {
    if (val > 800) {
      return { isValid: true, statusText: '↗ Ion conduction high', statusType: 'alert' };
    }
    return { isValid: true, statusText: '✓ Baseline ion conduction', statusType: 'valid' };
  }

  if (key === 'hardness') {
    if (val >= 100 && val <= 300) {
      return { isValid: true, statusText: '✓ Within regular bracket', statusType: 'valid' };
    }
    if (val > 300) {
      return { isValid: true, statusText: '↑ High hardness tier', statusType: 'warning' };
    }
    return { isValid: true, statusText: '↓ Soft water range', statusType: 'neutral' };
  }

  if (key === 'chloramines') {
    if (val > 4.0) {
      return { isValid: true, statusText: '↑ Residual exceeds target', statusType: 'alert' };
    }
    return { isValid: true, statusText: '✓ Typical residual', statusType: 'valid' };
  }

  if (key === 'organic_carbon') {
    if (val > 10.0) {
      return { isValid: true, statusText: '↑ Elevated organic presence', statusType: 'alert' };
    }
    return { isValid: true, statusText: '✓ Low organic carbon', statusType: 'valid' };
  }

  if (key === 'sulfate') {
    if (val > 400) {
      return { isValid: true, statusText: '↑ Elevated sulfate content', statusType: 'warning' };
    }
    return { isValid: true, statusText: '✓ Moderate sulfate baseline', statusType: 'valid' };
  }

  if (key === 'trihalomethanes') {
    if (val > 80) {
      return { isValid: true, statusText: '↑ Elevated THM concentration', statusType: 'alert' };
    }
    return { isValid: true, statusText: '✓ Low halogenated byproduct', statusType: 'valid' };
  }

  return { isValid: true };
}

export function validateWaterParameters(params: WaterParameters): {
  isValid: boolean;
  errors: Record<string, string>;
  hasAtLeastOne: boolean;
} {
  const errors: Record<string, string> = {};
  let providedCount = 0;

  for (const config of PARAMETERS_CONFIG) {
    const val = params[config.key];
    if (val !== null && val !== undefined && val !== ('' as unknown as number)) {
      providedCount++;
      const res = validateParameterField(config.key, Number(val));
      if (!res.isValid && res.error) {
        errors[config.key] = res.error;
      }
    }
  }

  const hasAtLeastOne = providedCount > 0;
  if (!hasAtLeastOne) {
    errors['_general'] = 'At least one water parameter measurement must be provided.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    hasAtLeastOne,
  };
}

export function validateBatchRow(row: Partial<BatchRowInput>, rowNumber: number): BatchRowInput {
  const errors: string[] = [];
  const label = (row.label && String(row.label).trim()) || `Sample #${rowNumber}`;
  const location = row.location ? String(row.location).trim() : 'Unspecified station';

  const parsedInputs: Record<string, number | null> = {};
  let providedCount = 0;

  for (const p of PARAMETERS_CONFIG) {
    const raw = row[p.key as keyof BatchRowInput];
    if (raw !== undefined && raw !== null && String(raw).trim() !== '') {
      const num = Number(raw);
      if (isNaN(num)) {
        errors.push(`${p.label}: not a valid number`);
      } else {
        const validation = validateParameterField(p.key, num);
        if (!validation.isValid && validation.error) {
          errors.push(`${p.label}: ${validation.error}`);
        } else {
          parsedInputs[p.key] = num;
          providedCount++;
        }
      }
    } else {
      parsedInputs[p.key] = null;
    }
  }

  if (providedCount === 0) {
    errors.push('No parameter readings found in row.');
  }

  return {
    rowNumber,
    label,
    location,
    ...parsedInputs,
    validationErrors: errors,
    isValid: errors.length === 0,
  };
}
