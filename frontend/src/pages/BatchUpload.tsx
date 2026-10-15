/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  Download,
  RotateCcw,
  Sparkles,
  Zap,
  Upload,
  FileText,
  X,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { BatchRowInput, WaterSampleAnalysis, WaterParameters } from '../types';
import { PARAMETERS_CONFIG } from '../config/parameters';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MLRiskBadge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { downloadAnalysesCSV } from '../lib/export';

const SAMPLE_CSV_DATA = `label,location,ph,turbidity,solids,conductivity,hardness,chloramines,organic_carbon,sulfate,trihalomethanes
"Sector 4 Wellhead","Pumping Station 4",7.1,2.2,340,510,180,2.4,5.1,220,42
"Highland Spring Inlet","Ridge Valley Station",6.8,1.4,190,320,140,1.8,3.2,180,28
"Industrial Canal Effluent","Discharge Point B",5.1,8.6,1150,1840,420,5.6,22.1,580,105
"Community Filter Tank","Ward 18 Distribution",7.8,4.9,680,1020,210,3.6,12.8,,,
"Rural Borewell 2A","North Irrigation Zone",8.2,3.4,490,750,290,2.8,7.9,310,55`;

// Exactly the 9 approved parameters tracked by AquaGuard AI
const REQUIRED_PARAMETERS: (keyof WaterParameters)[] = [
  'ph',
  'turbidity',
  'solids',
  'conductivity',
  'hardness',
  'chloramines',
  'organic_carbon',
  'sulfate',
  'trihalomethanes',
];

/**
 * Robust CSV line splitter that handles quotes, escaped quotes, and empty fields.
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

/**
 * Matches CSV header names case-insensitively to approved parameters or sample metadata.
 */
function identifyHeader(
  rawHeader: string
): keyof WaterParameters | 'label' | 'location' | null {
  const h = rawHeader.trim().toLowerCase().replace(/^["']|["']$/g, '');
  if (h === 'ph' || /(?:^|[\s_()-])ph(?:[\s_()-]|$)/i.test(h)) return 'ph';
  if (h.includes('turb')) return 'turbidity';
  if (h.includes('solid') || h.includes('tds')) return 'solids';
  if (h.includes('cond')) return 'conductivity';
  if (h.includes('hard')) return 'hardness';
  if (h.includes('chlor')) return 'chloramines';
  if (h.includes('carb') || h.includes('toc')) return 'organic_carbon';
  if (h.includes('sulf') || h.includes('sulph')) return 'sulfate';
  if (h.includes('tri') || h.includes('thm')) return 'trihalomethanes';
  if (h.includes('label') || h.includes('name') || h === 'sample') return 'label';
  if (h.includes('loc') || h.includes('station') || h.includes('site'))
    return 'location';
  return null;
}

export const BatchUploadPage: React.FC = () => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [validatedRows, setValidatedRows] = useState<BatchRowInput[]>([]);
  const [invalidRows, setInvalidRows] = useState<BatchRowInput[]>([]);
  const [batchResults, setBatchResults] = useState<WaterSampleAnalysis[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Processes and validates a CSV file client-side against all format, size, and schema requirements.
   */
  const handleProcessFile = async (file: File): Promise<boolean> => {
    // 1. Wrong file type check
    const isCsvName = file.name.toLowerCase().endsWith('.csv');
    if (!isCsvName) {
      showToast('Wrong file type: Please upload a valid CSV (.csv) file.', 'error');
      return false;
    }

    // 2. Empty file size check
    if (file.size === 0) {
      showToast('Empty file: The selected CSV file is empty.', 'error');
      return false;
    }

    // 3. File too large check (5 MB limit)
    const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_FILE_SIZE_BYTES) {
      showToast('File too large: File exceeds the 5 MB maximum size limit.', 'error');
      return false;
    }

    // Read content client-side
    let text = '';
    try {
      text = await file.text();
    } catch {
      showToast('Failed to read file content client-side.', 'error');
      return false;
    }

    // 4. Empty content check
    const raw = text.trim();
    if (!raw) {
      showToast('Empty file: The selected CSV file contains no content.', 'error');
      return false;
    }

    const lines = raw.split(/\r?\n/).filter((line) => line.trim() !== '');
    if (lines.length < 2) {
      showToast(
        'Empty file: CSV must contain a header and at least one data row.',
        'error'
      );
      return false;
    }

    // 5. File too large row check (500 rows limit)
    const dataRowCount = lines.length - 1;
    if (dataRowCount > 500) {
      showToast(
        `File too large: CSV exceeds the 500 rows limit (found ${dataRowCount} rows).`,
        'error'
      );
      return false;
    }

    // 6. Missing required columns check
    const rawHeaders = parseCSVLine(lines[0]);
    const headerMappings = rawHeaders.map(identifyHeader);
    const detectedParams = new Set<keyof WaterParameters>();
    headerMappings.forEach((mapping) => {
      if (mapping && mapping !== 'label' && mapping !== 'location') {
        detectedParams.add(mapping);
      }
    });

    const missingColumns = REQUIRED_PARAMETERS.filter(
      (p) => !detectedParams.has(p)
    );

    if (missingColumns.length > 0) {
      showToast(
        `Missing required columns: ${missingColumns.join(', ')}. Please use the CSV template.`,
        'error'
      );
      return false;
    }

    // Successful client-side validation
    setSelectedFile(file);
    setCsvText(text);
    showToast(`Loaded ${file.name} (${dataRowCount} rows)`, 'info');
    return true;
  };

  const handleParseAndValidate = async () => {
    const raw = csvText.trim();
    if (!raw) {
      showToast('Please select or upload a CSV file to proceed.', 'error');
      return;
    }

    try {
      const lines = raw.split(/\r?\n/).filter((line) => line.trim() !== '');
      if (lines.length < 2) {
        showToast(
          'Empty file: CSV must contain a header and at least one data row.',
          'error'
        );
        return;
      }

      const dataRowCount = lines.length - 1;
      if (dataRowCount > 500) {
        showToast(
          `File too large: CSV exceeds the 500 rows limit (found ${dataRowCount} rows).`,
          'error'
        );
        return;
      }

      const rawHeaders = parseCSVLine(lines[0]);
      const headerMappings = rawHeaders.map(identifyHeader);
      const detectedParams = new Set<keyof WaterParameters>();
      headerMappings.forEach((mapping) => {
        if (mapping && mapping !== 'label' && mapping !== 'location') {
          detectedParams.add(mapping);
        }
      });

      const missingColumns = REQUIRED_PARAMETERS.filter(
        (p) => !detectedParams.has(p)
      );

      if (missingColumns.length > 0) {
        showToast(
          `Missing required columns: ${missingColumns.join(', ')}. Please use the CSV template.`,
          'error'
        );
        return;
      }

      const parsedRows: Partial<BatchRowInput>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const rowObj: Record<string, string | number> = { rowNumber: i };

        headerMappings.forEach((paramKey, idx) => {
          if (!paramKey) return;
          const val = values[idx] ?? '';
          rowObj[paramKey] = val;
        });

        parsedRows.push(rowObj);
      }

      const valRes = await apiClient.validateBatch(parsedRows);
      setValidatedRows(valRes.validRows);
      setInvalidRows(valRes.invalidRows);
      setCurrentStep(2);
      showToast(
        `Validated ${valRes.totalRows} rows: ${valRes.validRows.length} valid`,
        'success'
      );
    } catch {
      showToast('Failed to validate CSV structure', 'error');
    }
  };

  const handleRunBatchAnalysis = async () => {
    if (validatedRows.length === 0) return;
    setIsProcessing(true);
    try {
      const results = await apiClient.analyzeBatch(validatedRows);
      setBatchResults(results);
      setCurrentStep(3);
      showToast(`Successfully screened ${results.length} samples!`, 'success');
    } catch {
      showToast('Batch processing failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSampleCSV = () => {
    try {
      const file = new File([SAMPLE_CSV_DATA], 'sample_water_telemetry.csv', {
        type: 'text/csv',
      });
      handleProcessFile(file);
    } catch {
      setCsvText(SAMPLE_CSV_DATA);
      setSelectedFile({
        name: 'sample_water_telemetry.csv',
        size: SAMPLE_CSV_DATA.length,
      } as File);
      showToast('Loaded benchmark batch CSV template', 'info');
    }
  };

  const handleDownloadTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([SAMPLE_CSV_DATA], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'aquaguard_batch_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded CSV template', 'info');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setCsvText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleProcessFile(file);
    }
  };

  const handleClickDropzone = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
    e.target.value = '';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-16 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F2A33] tracking-tight">
          Batch Sensor Telemetry Ingestion
        </h1>
        <p className="text-xs sm:text-sm text-[#4F6C76] mt-1">
          Upload and process multi-sample water quality logs simultaneously.
        </p>
      </div>

      {/* 3-Step Stepper Header */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 pb-2">
        <div
          className={`p-3 rounded-[10px] border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
            currentStep === 1
              ? 'bg-[#E4F7FF] text-[#004B5A] border-[#0F6477]'
              : currentStep > 1
                ? 'bg-[#E2F4EA] text-[#17714A] border-[#9AD3B4]'
                : 'bg-white text-[#93A9B0] border-[#D5E3E7]'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">
            1
          </span>
          <span className="truncate">Data Ingestion</span>
        </div>

        <div
          className={`p-3 rounded-[10px] border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
            currentStep === 2
              ? 'bg-[#E4F7FF] text-[#004B5A] border-[#0F6477]'
              : currentStep > 2
                ? 'bg-[#E2F4EA] text-[#17714A] border-[#9AD3B4]'
                : 'bg-white text-[#93A9B0] border-[#D5E3E7]'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">
            2
          </span>
          <span className="truncate">Validation Review</span>
        </div>

        <div
          className={`p-3 rounded-[10px] border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
            currentStep === 3
              ? 'bg-[#E4F7FF] text-[#004B5A] border-[#0F6477]'
              : 'bg-white text-[#93A9B0] border-[#D5E3E7]'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">
            3
          </span>
          <span className="truncate">Batch Results</span>
        </div>
      </div>

      {/* Step 1: Upload and Column Reference */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-base text-[#0F2A33]">
                CSV Upload
              </h3>
              <Button
                type="button"
                variant="outline-teal"
                size="sm"
                onClick={handleLoadSampleCSV}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Load Sample Data
              </Button>
            </div>

            {/* Drag and Drop Zone */}
            <div
              role="button"
              tabIndex={0}
              onClick={handleClickDropzone}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClickDropzone();
                }
              }}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-xl border-2 border-dashed transition-all duration-150 p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer ${
                isDragging
                  ? 'border-[#0F6477] bg-[#E4F7FF]/50 ring-2 ring-[#0F6477]/20'
                  : selectedFile
                    ? 'border-[#0F6477]/60 bg-[#F4F9FA]'
                    : 'border-[#B0CAD1] bg-[#F4F9FA] hover:border-[#0F6477] hover:bg-[#EEF7F9]'
              }`}
              aria-label="Upload CSV file"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleFileInputChange}
              />

              <div className="w-12 h-12 rounded-full bg-[#E4F7FF] text-[#0F6477] flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>

              <p className="text-sm font-medium text-[#0F2A33]">
                Drag and drop a CSV, or{' '}
                <span className="text-[#0F6477] font-semibold underline underline-offset-2 hover:text-[#004B5A]">
                  browse
                </span>
              </p>

              <p className="text-xs text-[#6F797C] mt-1.5 font-mono">
                CSV · up to 500 rows · 5 MB
              </p>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="text-xs font-semibold text-[#0F6477] hover:underline hover:text-[#004B5A] inline-flex items-center gap-1.5 mt-3 pt-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV template</span>
              </button>

              {selectedFile && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-4 flex items-center justify-between gap-3 w-full max-w-md p-3 bg-white rounded-lg border border-[#D5E3E7] shadow-sm text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-[#0F6477] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#0F2A33] truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-[#6F797C] font-mono">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="p-1 rounded text-[#6F797C] hover:text-[#A63322] hover:bg-[#FBE5E0] transition-colors cursor-pointer"
                    title="Remove file"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                size="md"
                onClick={handleParseAndValidate}
                disabled={!selectedFile && !csvText}
              >
                <span>Validate &amp; Preview Rows</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </Card>

          {/* Column Reference Table */}
          <Card className="p-5 sm:p-6 space-y-3">
            <h4 className="font-display font-semibold text-sm text-[#0F2A33]">
              Accepted Column Headers Reference
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-[#EEF3F5] text-[#0F2A33]">
                <strong>label</strong>: text
              </div>
              <div className="p-2 rounded bg-[#EEF3F5] text-[#0F2A33]">
                <strong>location</strong>: text
              </div>
              {PARAMETERS_CONFIG.map((p) => (
                <div
                  key={p.key}
                  className="p-2 rounded bg-[#EEF3F5] text-[#0F2A33]"
                >
                  <strong>{p.key}</strong>: {p.unit || 'unitless'}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Step 2: Review and Validation */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 bg-[#E2F4EA]/50 border-[#9AD3B4]">
              <span className="text-[11px] font-mono uppercase font-semibold text-[#17714A] block">
                VALID SAMPLES READY
              </span>
              <span className="font-mono text-2xl font-bold text-[#17714A]">
                {validatedRows.length}
              </span>
            </Card>

            <Card className="p-4 bg-[#FBE5E0]/50 border-[#EDA699]">
              <span className="text-[11px] font-mono uppercase font-semibold text-[#A63322] block">
                FLAGGED INVALID ROWS
              </span>
              <span className="font-mono text-2xl font-bold text-[#A63322]">
                {invalidRows.length}
              </span>
            </Card>

            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                <RotateCcw className="w-4 h-4 mr-1.5" />
                Edit CSV
              </Button>
              <Button
                disabled={validatedRows.length === 0}
                isLoading={isProcessing}
                onClick={handleRunBatchAnalysis}
              >
                <Zap className="w-4 h-4 mr-1.5" />
                Run Batch Model
              </Button>
            </div>
          </div>

          {/* Validated Rows Table */}
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-[#E7F0F2] bg-[#F4F9FA]/60">
              <h4 className="font-display font-semibold text-sm text-[#0F2A33]">
                Validated Ingestion Queue
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table
                className="w-full text-left text-xs"
                aria-label="Batch validation queue table"
              >
                <thead className="bg-[#EEF3F5] text-[#4F6C76] font-semibold border-b border-[#D5E3E7]">
                  <tr>
                    <th className="px-4 py-3">Row</th>
                    <th className="px-4 py-3">Sample Label</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3 font-mono">pH</th>
                    <th className="px-4 py-3 font-mono">Turbidity</th>
                    <th className="px-4 py-3 font-mono">Solids</th>
                    <th className="px-4 py-3 font-mono">Hardness</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7F0F2] bg-white">
                  {validatedRows.map((r) => (
                    <tr key={r.rowNumber} className="hover:bg-[#F4F9FA]">
                      <td className="px-4 py-3 font-mono text-[#6F797C]">
                        #{r.rowNumber}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#0F2A33]">
                        {r.label}
                      </td>
                      <td className="px-4 py-3 text-[#4F6C76]">{r.location}</td>
                      <td className="px-4 py-3 font-mono">{r.ph ?? '—'}</td>
                      <td className="px-4 py-3 font-mono">
                        {r.turbidity ?? '—'}
                      </td>
                      <td className="px-4 py-3 font-mono">{r.solids ?? '—'}</td>
                      <td className="px-4 py-3 font-mono">
                        {r.hardness ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-[#17714A] font-semibold">
                        <CheckCircle2 className="w-4 h-4 inline mr-1" />
                        Valid
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Step 3: Batch Results */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-lg text-[#0F2A33]">
                Batch Screening Completed
              </h3>
              <p className="text-xs text-[#4F6C76]">
                {batchResults.length} water samples processed through calibrated
                GBDT model.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  downloadAnalysesCSV(
                    batchResults,
                    'batch_screening_results.csv'
                  )
                }
              >
                <Download className="w-4 h-4 mr-1.5" />
                Export Batch CSV
              </Button>
              <Button size="sm" onClick={() => setCurrentStep(1)}>
                New Batch Upload
              </Button>
            </div>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table
                className="w-full text-left text-xs"
                aria-label="Batch execution results table"
              >
                <thead className="bg-[#EEF3F5] text-[#4F6C76] font-semibold border-b border-[#D5E3E7]">
                  <tr>
                    <th className="px-4 py-3">Sample Label</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">ML Screening Band</th>
                    <th className="px-4 py-3">Classifier Score</th>
                    <th className="px-4 py-3">Completeness</th>
                    <th className="px-4 py-3 text-right">Screening Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7F0F2] bg-white">
                  {batchResults.map((r) => (
                    <tr key={r.id} className="hover:bg-[#F4F9FA]">
                      <td className="px-4 py-3 font-semibold text-[#0F2A33]">
                        {r.label}
                      </td>
                      <td className="px-4 py-3 text-[#4F6C76]">{r.location}</td>
                      <td className="px-4 py-3">
                        <MLRiskBadge band={r.ml.band} size="sm" />
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-[#0F2A33]">
                        {r.ml.score.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-mono text-[#4F6C76]">
                        {r.completeness.percent}% ({r.completeness.provided}/9)
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/result/${r.id}`}
                          className="font-semibold text-[#0F6477] hover:underline inline-flex items-center gap-1"
                        >
                          <span>View</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
