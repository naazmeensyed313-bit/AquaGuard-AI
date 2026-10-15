/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  GitCompare,
  Printer,
  Plus,
  Calendar,
  MapPin,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { WaterSampleAnalysis } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { printAnalysisReport } from '../lib/export';
import { ResponsibleUseNotice } from '../components/result/ResponsibleUseNotice';
import { SectionAMLSega } from '../components/result/SectionAMLSega';
import { SectionBStandards } from '../components/result/SectionBStandards';
import { SectionCActions } from '../components/result/SectionCActions';
import { SectionDFooter } from '../components/result/SectionDFooter';

export const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [analysis, setAnalysis] = useState<WaterSampleAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async (targetId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.getAnalysisById(targetId);
      setAnalysis(data);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Analysis record could not be loaded.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAnalysis(id);
    } else {
      // Default fallback to seed sample
      fetchAnalysis('sample-ward-12');
    }
  }, [id]);

  const handleToggleSaved = async () => {
    if (!analysis) return;
    try {
      const updated = await apiClient.toggleSaved(analysis.id);
      setAnalysis(updated);
      showToast(
        updated.saved
          ? 'Sample saved to local records'
          : 'Sample removed from saved',
        'success'
      );
    } catch {
      showToast('Failed to update saved state', 'error');
    }
  };

  const handlePrint = () => {
    printAnalysisReport();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-[#FBE5E0] text-[#A63322] flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-display font-bold text-xl text-[#0F2A33] mb-2">
          Screening Record Not Found
        </h2>
        <p className="text-sm text-[#4F6C76] mb-6 leading-relaxed">
          {error ||
            'The requested water sample could not be found or has been removed.'}
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={() => id && fetchAnalysis(id)}>
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Retry
          </Button>
          <Button onClick={() => navigate('/analyze')}>
            Analyze New Sample
          </Button>
        </div>
      </div>
    );
  }

  // Format created_at nicely
  const formattedDate = new Date(analysis.created_at).toLocaleDateString(
    'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Top Action Bar & Breadcrumbs */}
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/analyze"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#4F6C76] hover:text-[#0F6477] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Analyze › Result</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/compare?sampleA=${analysis.id}`)}
            title="Compare with another sample"
            aria-label="Compare sample"
            className="p-2 rounded-[8px] bg-white border border-[#D5E3E7] hover:bg-[#EEF3F5] text-[#0F6477] transition-colors"
          >
            <GitCompare className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrint}
            title="Print or export report to PDF"
            aria-label="Print or export PDF"
            className="p-2 rounded-[8px] bg-white border border-[#D5E3E7] hover:bg-[#EEF3F5] text-[#0F6477] transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>

          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] bg-[#004B5A] hover:bg-[#0B4A57] text-white text-xs sm:text-sm font-medium shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">New Analysis</span>
          </Link>
        </div>
      </div>

      {/* Sample Screening Hero Card */}
      <Card className="p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#0F6477]">
            SAMPLE SCREENING
          </span>
          <button
            onClick={handleToggleSaved}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
              analysis.saved
                ? 'bg-[#E4F7FF] text-[#0F6477] border-[#A8E3E8]'
                : 'bg-transparent text-[#6F797C] border-[#D5E3E7] hover:bg-[#F4F9FA]'
            }`}
          >
            {analysis.saved ? (
              <BookmarkCheck className="w-3.5 h-3.5 text-[#0F6477]" />
            ) : (
              <Bookmark className="w-3.5 h-3.5" />
            )}
            <span>{analysis.saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F2A33] tracking-tight">
          {analysis.label}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[#4F6C76]">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#0F6477]" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0F6477]" />
            <span>{analysis.location}</span>
          </div>
        </div>
      </Card>

      {/* Responsible-Use Notice Banner */}
      <ResponsibleUseNotice />

      {/* Section A: ML Screening Result */}
      <SectionAMLSega analysis={analysis} />

      {/* Section B: Standards-Based Check */}
      <SectionBStandards analysis={analysis} />

      {/* Section C: Decision-Support Actions */}
      <SectionCActions
        recommendations={analysis.recommendations}
        limitations={analysis.limitations}
      />

      {/* Section D: Responsible Oversight & Purpose */}
      <SectionDFooter />
    </div>
  );
};
