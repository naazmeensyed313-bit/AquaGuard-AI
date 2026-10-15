/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Trash2,
  GitCompare,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  ArrowRight,
  CheckSquare,
  Square,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { WaterSampleAnalysis } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { MLRiskBadge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { downloadAnalysesCSV } from '../lib/export';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [analyses, setAnalyses] = useState<WaterSampleAnalysis[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBand, setSelectedBand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'score' | 'label'>(
    'created_at'
  );
  const [isLoading, setIsLoading] = useState(true);

  // Multi-selection for compare
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState<WaterSampleAnalysis | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.getAnalyses({
        query: searchQuery,
        band: selectedBand,
        sortBy,
        sortOrder: 'desc',
        page,
        pageSize,
      });
      setAnalyses(res.items);
      setTotal(res.total);
    } catch {
      showToast('Failed to load history records', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page, selectedBand, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRecords();
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 2) {
        // Keep the latest 2
        setSelectedIds([selectedIds[1], id]);
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.deleteAnalysis(deleteTarget.id);
      showToast(`Deleted "${deleteTarget.label}" successfully`, 'success');
      setDeleteTarget(null);
      setSelectedIds(selectedIds.filter((id) => id !== deleteTarget.id));
      fetchRecords();
    } catch {
      showToast('Failed to delete analysis record', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (analyses.length === 0) {
      showToast('No analyses available to export', 'info');
      return;
    }
    downloadAnalysesCSV(analyses, 'aquaguard_history_export.csv');
    showToast('Exported analyses to CSV', 'success');
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-16 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F2A33] tracking-tight">
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-[#4F6C76] mt-1">
            Historical records, comparative screening logs, and audit entries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-1.5" />
            <span>Export CSV</span>
          </Button>

          <Link to="/analyze">
            <Button size="sm">New Analysis</Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-3">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#93A9B0] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by label, station location, or ID..."
              className="w-full pl-9 pr-3.5 py-2 rounded-[8px] bg-[#F4F9FA] border border-[#D5E3E7] text-xs sm:text-sm text-[#0F2A33] placeholder-[#93A9B0] focus:outline-none focus:border-[#0F6477]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedBand}
              onChange={(e) => {
                setSelectedBand(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-[8px] bg-[#F4F9FA] border border-[#D5E3E7] text-xs font-medium text-[#0F2A33] focus:outline-none focus:border-[#0F6477]"
            >
              <option value="all">All Risk Bands</option>
              <option value="Lower Concern">Lower Concern</option>
              <option value="Inconclusive — lab testing recommended">
                Inconclusive
              </option>
              <option value="Elevated Concern">Elevated Concern</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'created_at' | 'score' | 'label')
              }
              className="px-3 py-2 rounded-[8px] bg-[#F4F9FA] border border-[#D5E3E7] text-xs font-medium text-[#0F2A33] focus:outline-none focus:border-[#0F6477]"
            >
              <option value="created_at">Sort: Newest First</option>
              <option value="score">Sort: Classifier Score</option>
              <option value="label">Sort: Sample Name</option>
            </select>

            <Button type="submit" size="sm" variant="secondary">
              Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Main Table / Mobile Cards */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : analyses.length === 0 ? (
        <Card className="p-12 text-center text-[#4F6C76]">
          <p className="text-base font-semibold text-[#0F2A33]">
            No matching analyses found
          </p>
          <p className="text-xs mt-1">
            Try adjusting your search criteria or ingest a new sample.
          </p>
        </Card>
      ) : (
        <>
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block bg-white rounded-[14px] border border-[#D5E3E7] overflow-hidden shadow-2xs">
            <table
              className="w-full text-left text-xs"
              aria-label="Analyses history table"
            >
              <thead className="bg-[#EEF3F5] text-[#4F6C76] font-semibold border-b border-[#D5E3E7]">
                <tr>
                  <th className="px-4 py-3 w-10 text-center">
                    <span className="sr-only">Select</span>
                  </th>
                  <th className="px-4 py-3">Sample Label</th>
                  <th className="px-4 py-3">Location / Station</th>
                  <th className="px-4 py-3">Date Sampled</th>
                  <th className="px-4 py-3">ML Screening Band</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Completeness</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7F0F2]">
                {analyses.map((a) => {
                  const isChecked = selectedIds.includes(a.id);
                  const formatted = new Date(a.created_at).toLocaleDateString(
                    'en-GB',
                    {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }
                  );

                  return (
                    <tr
                      key={a.id}
                      className={`hover:bg-[#F4F9FA] transition-colors ${
                        isChecked ? 'bg-[#E4F7FF]/40' : ''
                      }`}
                    >
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelect(a.id)}
                          className="text-[#0F6477] hover:opacity-80"
                          aria-label={`Select ${a.label} for comparison`}
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4 text-[#93A9B0]" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-[#0F2A33]">
                        <Link
                          to={`/result/${a.id}`}
                          className="hover:text-[#0F6477] hover:underline"
                        >
                          {a.label}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-[#4F6C76]">
                        {a.location}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[#6F797C]">
                        {formatted}
                      </td>
                      <td className="px-4 py-3.5">
                        <MLRiskBadge band={a.ml.band} size="sm" />
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-[#0F2A33]">
                        {a.ml.score.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[#4F6C76]">
                        {a.completeness.percent}% ({a.completeness.provided}/9)
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <Link
                          to={`/result/${a.id}`}
                          className="font-semibold text-[#0F6477] hover:underline"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(a)}
                          className="text-[#A63322] hover:text-[#720006] p-1 rounded"
                          title="Delete record"
                          aria-label="Delete sample record"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Reflow Cards (Visible on mobile < 768px) */}
          <div className="md:hidden space-y-3">
            {analyses.map((a) => {
              const isChecked = selectedIds.includes(a.id);
              const formatted = new Date(a.created_at).toLocaleDateString(
                'en-GB',
                {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }
              );

              return (
                <Card
                  key={a.id}
                  className={`p-4 space-y-3 ${isChecked ? 'ring-2 ring-[#0F6477] bg-[#E4F7FF]/20' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSelect(a.id)}
                        className="text-[#0F6477]"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4 text-[#93A9B0]" />
                        )}
                      </button>
                      <Link
                        to={`/result/${a.id}`}
                        className="font-display font-semibold text-sm text-[#0F2A33] hover:text-[#0F6477]"
                      >
                        {a.label}
                      </Link>
                    </div>

                    <button
                      onClick={() => setDeleteTarget(a)}
                      className="text-[#A63322] p-1"
                      aria-label="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <MLRiskBadge band={a.ml.band} size="sm" />
                    <span className="font-mono text-sm font-bold text-[#0F2A33]">
                      Score: {a.ml.score.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6F797C] pt-2 border-t border-[#E7F0F2]">
                    <span>{a.location}</span>
                    <span className="font-mono">{formatted}</span>
                  </div>

                  <Link to={`/result/${a.id}`} className="block">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full text-xs"
                    >
                      View Screening
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>

          {/* Pagination bar */}
          <div className="flex items-center justify-between text-xs text-[#4F6C76] pt-2">
            <span>
              Showing {analyses.length} of {total} records
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-2 font-mono font-medium">
                {page} / {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Sticky Bottom Compare Bar if at least 1 item is selected */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[90%] bg-[#0A2F3A] text-white p-3.5 rounded-[14px] shadow-2xl flex items-center justify-between gap-4 border border-[#15677A] animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2 text-xs">
            <GitCompare className="w-4 h-4 text-[#22B3C1]" />
            <span>
              <strong>{selectedIds.length} of 2</strong> samples selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-[#93A9B0] hover:text-white underline cursor-pointer"
            >
              Clear
            </button>
            <Button
              size="sm"
              disabled={selectedIds.length !== 2}
              onClick={() =>
                navigate(
                  `/compare?sampleA=${selectedIds[0]}&sampleB=${selectedIds[1]}`
                )
              }
              className="bg-[#22B3C1] hover:bg-[#0E7C86] text-[#0A2F3A] font-bold text-xs"
            >
              Compare Samples
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Record Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FBE5E0] text-[#A63322] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm text-[#4F6C76] leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-[#0F2A33]">{deleteTarget?.label}</strong>?
              This action will permanently remove this screening record from
              local storage.
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-[#E7F0F2]">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleConfirmDelete}
            >
              Delete Record
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
