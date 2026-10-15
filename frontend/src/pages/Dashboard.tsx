/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Plus,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { apiClient } from '../api/client';
import { DashboardSummary } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { MLRiskBadge } from '../components/ui/Badge';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | '30d' | '7d'>('all');

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.getDashboardSummary();
      setSummary(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-[#FBE5E0] text-[#A63322] flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="font-display font-bold text-xl text-[#0F2A33] mb-2">
          Unable to Load Dashboard
        </h2>
        <p className="text-sm text-[#4F6C76] mb-6">{error}</p>
        <Button onClick={fetchDashboard}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const {
    totalAnalyses,
    lowerConcernCount,
    inconclusiveCount,
    elevatedConcernCount,
    averageCompleteness,
    recentAnalyses,
    scoreDistribution,
  } = summary;

  // Donut chart data for risk bands
  const bandDonutData = [
    { name: 'Lower Concern', value: lowerConcernCount, color: '#17714A' },
    { name: 'Inconclusive', value: inconclusiveCount, color: '#8A5A0B' },
    { name: 'Elevated Concern', value: elevatedConcernCount, color: '#A63322' },
  ].filter((d) => d.value > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F2A33] tracking-tight">
            Watershed Screening Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#4F6C76] mt-1">
            Aggregated monitoring metrics, empirical risk distributions, and
            recent screening runs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range filter buttons */}
          <div className="bg-[#EEF3F5] p-1 rounded-[10px] border border-[#D5E3E7] flex text-xs">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1.5 rounded-[8px] font-medium transition-all ${
                timeFilter === 'all'
                  ? 'bg-white text-[#0F2A33] font-semibold shadow-xs'
                  : 'text-[#4F6C76] hover:text-[#0F2A33]'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setTimeFilter('30d')}
              className={`px-3 py-1.5 rounded-[8px] font-medium transition-all ${
                timeFilter === '30d'
                  ? 'bg-white text-[#0F2A33] font-semibold shadow-xs'
                  : 'text-[#4F6C76] hover:text-[#0F2A33]'
              }`}
            >
              Past 30 Days
            </button>
          </div>

          <Link to="/analyze">
            <Button size="sm" className="hidden sm:inline-flex">
              <Plus className="w-4 h-4 mr-1.5" />
              New Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Analyses */}
        <Card className="p-4 sm:p-5">
          <span className="text-[11px] font-mono uppercase text-[#6F797C] font-semibold block mb-1">
            TOTAL SCREENINGS
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-[#0F2A33]">
            {totalAnalyses}
          </div>
          <span className="text-[11px] text-[#4F6C76] mt-1 block">
            Active dataset samples
          </span>
        </Card>

        {/* Lower Concern */}
        <Card className="p-4 sm:p-5 bg-[#E2F4EA]/40 border-[#9AD3B4]/60">
          <div className="flex items-center justify-between text-[#17714A] mb-1">
            <span className="text-[11px] font-mono uppercase font-semibold">
              LOWER CONCERN
            </span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-[#17714A]">
            {lowerConcernCount}
          </div>
          <span className="text-[11px] text-[#17714A]/80 font-mono mt-1 block">
            {totalAnalyses > 0
              ? Math.round((lowerConcernCount / totalAnalyses) * 100)
              : 0}
            % of samples
          </span>
        </Card>

        {/* Inconclusive */}
        <Card className="p-4 sm:p-5 bg-[#FDF1D6]/40 border-[#EBC878]/60">
          <div className="flex items-center justify-between text-[#8A5A0B] mb-1">
            <span className="text-[11px] font-mono uppercase font-semibold">
              INCONCLUSIVE
            </span>
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-[#8A5A0B]">
            {inconclusiveCount}
          </div>
          <span className="text-[11px] text-[#8A5A0B]/80 font-mono mt-1 block">
            {totalAnalyses > 0
              ? Math.round((inconclusiveCount / totalAnalyses) * 100)
              : 0}
            % of samples
          </span>
        </Card>

        {/* Elevated Concern */}
        <Card className="p-4 sm:p-5 bg-[#FBE5E0]/40 border-[#EDA699]/60">
          <div className="flex items-center justify-between text-[#A63322] mb-1">
            <span className="text-[11px] font-mono uppercase font-semibold">
              ELEVATED CONCERN
            </span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-[#A63322]">
            {elevatedConcernCount}
          </div>
          <span className="text-[11px] text-[#A63322]/80 font-mono mt-1 block">
            {totalAnalyses > 0
              ? Math.round((elevatedConcernCount / totalAnalyses) * 100)
              : 0}
            % of samples
          </span>
        </Card>

        {/* Input Completeness */}
        <Card className="p-4 sm:p-5 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-mono uppercase text-[#6F797C] font-semibold block mb-1">
            AVG. COMPLETENESS
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-[#0F6477]">
            {averageCompleteness}%
          </div>
          <span className="text-[11px] text-[#4F6C76] mt-1 block">
            Observed input density
          </span>
        </Card>
      </div>

      {/* Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: ML Score Distribution Histogram */}
        <Card className="lg:col-span-7 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-base text-[#0F2A33]">
                Score Distribution
              </h3>
              <p className="text-xs text-[#4F6C76]">
                Sample frequency clustered across empirical classifier score
                brackets.
              </p>
            </div>
            <span className="text-xs font-mono text-[#0F6477] font-semibold">
              0.00 – 1.00
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scoreDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 11, fill: '#4F6C76' }}
                  tickLine={false}
                  axisLine={{ stroke: '#D5E3E7' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#4F6C76' }}
                  tickLine={false}
                  axisLine={{ stroke: '#D5E3E7' }}
                />
                <RechartsTooltip
                  formatter={(val: unknown) => [`${val} samples`, 'Count']}
                  contentStyle={{
                    backgroundColor: '#0A2F3A',
                    borderColor: '#15677A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {scoreDistribution.map((entry, index) => {
                    let fill = '#0F6477';
                    if (index <= 1)
                      fill = '#EDA699'; // Elevated Concern bracket
                    else if (index === 2)
                      fill = '#EBC878'; // Inconclusive bracket
                    else fill = '#9AD3B4'; // Lower Concern bracket
                    return <Cell key={`cell-${index}`} fill={fill} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Empirical Risk Band Composition Donut */}
        <Card className="lg:col-span-5 p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="font-display font-semibold text-base text-[#0F2A33]">
              Classification Composition
            </h3>
            <p className="text-xs text-[#4F6C76]">
              Proportion of water samples across screening outcome bands.
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            {bandDonutData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bandDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {bandDonutData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#0A2F3A',
                      borderColor: '#15677A',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-[#93A9B0] italic">
                No samples recorded yet
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-1 gap-2 pt-2 border-t border-[#E7F0F2] text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#17714A]" />
                <span className="text-[#0F2A33] font-medium">
                  Lower Concern
                </span>
              </div>
              <span className="font-mono font-semibold text-[#17714A]">
                {lowerConcernCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8A5A0B]" />
                <span className="text-[#0F2A33] font-medium">Inconclusive</span>
              </div>
              <span className="font-mono font-semibold text-[#8A5A0B]">
                {inconclusiveCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A63322]" />
                <span className="text-[#0F2A33] font-medium">
                  Elevated Concern
                </span>
              </div>
              <span className="font-mono font-semibold text-[#A63322]">
                {elevatedConcernCount}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Analyses Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#E7F0F2] bg-[#F4F9FA]/50">
          <div>
            <h3 className="font-display font-semibold text-base text-[#0F2A33]">
              Recent Sample Analyses
            </h3>
            <p className="text-xs text-[#4F6C76]">
              Latest screening ingestions and calculated risk outcomes.
            </p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-[#0F6477] hover:underline inline-flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table
            className="w-full text-left text-xs"
            aria-label="Recent analyses table"
          >
            <thead className="bg-[#EEF3F5] text-[#4F6C76] font-semibold border-b border-[#D5E3E7]">
              <tr>
                <th className="px-4 py-3">Sample Label</th>
                <th className="px-4 py-3">Catchment / Location</th>
                <th className="px-4 py-3">ML Screening Band</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Completeness</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7F0F2] bg-white">
              {recentAnalyses.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#F4F9FA] transition-colors"
                >
                  <td className="px-4 py-3.5 font-medium text-[#0F2A33]">
                    <Link
                      to={`/result/${item.id}`}
                      className="hover:text-[#0F6477] hover:underline"
                    >
                      {item.label}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-[#4F6C76]">
                    {item.location}
                  </td>
                  <td className="px-4 py-3.5">
                    <MLRiskBadge band={item.ml.band} size="sm" />
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-[#0F2A33]">
                    {item.ml.score.toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[#4F6C76]">
                    {item.completeness.percent}% ({item.completeness.provided}
                    /9)
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      to={`/result/${item.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F6477] hover:underline"
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
  );
};
