/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WaterSampleAnalysis } from '../types';
import { PARAMETERS_CONFIG } from '../config/parameters';

export function downloadAnalysesCSV(analyses: WaterSampleAnalysis[], filename = 'aquaguard_analyses.csv') {
  const headers = [
    'Sample ID',
    'Date & Time',
    'Sample Label',
    'Location',
    'ML Risk Band',
    'ML Score',
    'Completeness %',
    ...PARAMETERS_CONFIG.map((p) => `${p.label} (${p.unit || 'unitless'})`),
  ];

  const rows = analyses.map((a) => [
    `"${a.id}"`,
    `"${a.created_at}"`,
    `"${a.label.replace(/"/g, '""')}"`,
    `"${a.location.replace(/"/g, '""')}"`,
    `"${a.ml.band}"`,
    a.ml.score.toFixed(2),
    `${a.completeness.percent}%`,
    ...PARAMETERS_CONFIG.map((p) => {
      const v = a.inputs[p.key];
      return v !== null && v !== undefined ? v : '';
    }),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printAnalysisReport() {
  window.print();
}
