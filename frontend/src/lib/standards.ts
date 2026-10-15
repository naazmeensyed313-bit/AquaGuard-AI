/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NOTE ON REFERENCE RANGES:
 * Reference ranges and standard classifications in this evaluation module are
 * illustrative for client-side placeholder evaluations and must be replaced with
 * verified, authoritative values from official BIS IS 10500 and WHO specifications.
 */

import {
  WaterParameters,
  RegulatoryStandard,
  StandardsResult,
  StandardItem,
  StandardStatus,
} from '../types';
import { PARAMETERS_CONFIG } from '../config/parameters';

export function evaluateStandards(
  inputs: WaterParameters,
  standard: RegulatoryStandard = 'BIS IS 10500'
): StandardsResult {
  const items: StandardItem[] = [];
  let above = 0;
  let within = 0;
  let below = 0;
  let unassessed = 0;

  for (const config of PARAMETERS_CONFIG) {
    const rawVal = inputs[config.key];
    const stdConfig =
      standard === 'BIS IS 10500' ? config.standardBIS : config.standardWHO;

    if (rawVal === null || rawVal === undefined || isNaN(Number(rawVal))) {
      items.push({
        parameter: config.fullName,
        paramKey: config.key,
        value: null,
        unit: config.unit,
        status: 'Not provided',
        reference_text: stdConfig.label,
        reference_min: stdConfig.min,
        reference_max: stdConfig.max,
      });
      unassessed++;
      continue;
    }

    const val = Number(rawVal);

    if (!stdConfig.hasFormalStandard) {
      items.push({
        parameter: config.fullName,
        paramKey: config.key,
        value: val,
        unit: config.unit,
        status: 'No formal reference',
        reference_text: 'Informational baseline',
        reference_min: stdConfig.min,
        reference_max: stdConfig.max,
      });
      unassessed++;
      continue;
    }

    let status: StandardStatus = 'Within range';

    if (stdConfig.min !== undefined && val < stdConfig.min) {
      status = 'Below range';
      below++;
    } else if (stdConfig.max !== undefined && val > stdConfig.max) {
      status = 'Above range';
      above++;
    } else {
      status = 'Within range';
      within++;
    }

    items.push({
      parameter: config.fullName,
      paramKey: config.key,
      value: val,
      unit: config.unit,
      status,
      reference_text: stdConfig.label,
      reference_min: stdConfig.min,
      reference_max: stdConfig.max,
    });
  }

  return {
    standard,
    items,
    summary_counts: {
      above,
      within,
      below,
      unassessed,
    },
  };
}
