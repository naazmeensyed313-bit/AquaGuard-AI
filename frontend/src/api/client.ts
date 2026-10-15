/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  WaterParameters,
  WaterSampleAnalysis,
  AnalysesFilterParams,
  AnalysesListResponse,
  DashboardSummary,
  BatchRowInput,
  BatchValidationResponse,
  ModelCardData,
} from '../types';
import { MockApiService } from './mock/service';

// The single switch controlling whether to hit the local mock engine or a remote FastAPI backend.
// By default, VITE_USE_MOCK is true if unset or set to 'true'.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// Real backend base URL: accepts e.g. "http://localhost:8000" or "http://localhost:8000/api"
const RAW_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000';

const normalizedBase = RAW_API_BASE_URL.replace(/\/+$/, '');
const API_BASE_URL = normalizedBase.endsWith('/api')
  ? normalizedBase
  : `${normalizedBase}/api`;

const REQUEST_TIMEOUT_MS = 45000; // 45 seconds for backend cold starts

// Typed error classes for structured API error handling
export class ApiError extends Error {
  public status?: number;
  public details?: unknown;
  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export class NetworkError extends ApiError {
  constructor(
    message = 'Network connection failed. Please check your network connection or verify that the backend service is running.'
  ) {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation error occurred.', details?: unknown) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

export class ServerError extends ApiError {
  constructor(
    message = 'Server encountered an internal error. Please try again later.',
    status = 500
  ) {
    super(message, status);
    this.name = 'ServerError';
  }
}

export class TimeoutError extends ApiError {
  constructor(
    message = 'Request timed out after 45 seconds. The backend may still be starting up from cold state.'
  ) {
    super(message, 408);
    this.name = 'TimeoutError';
  }
}

const SESSION_STORAGE_KEY = 'aquaguard_session_id';

/**
 * Returns or generates a stable anonymous session ID persisted in localStorage.
 * Transmitted via the X-Session-Id header with all API requests.
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'session-ssr';
  let sid = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sid) {
    sid =
      'ses_' +
      Math.random().toString(36).substring(2, 11) +
      '_' +
      Date.now().toString(36);
    localStorage.setItem(SESSION_STORAGE_KEY, sid);
  }
  return sid;
}

/**
 * Generic fetch wrapper with CORS settings, timeout, cold-start detection, and typed errors.
 */
async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const controller = new AbortController();
  const timeoutTimer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  // If a request takes > 2500ms, notify warm-up listeners of potential cold start
  const slowTimer = setTimeout(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('aquaguard:warmup-slow', { detail: { path } })
      );
    }
  }, 2500);

  const sessionId = getSessionId();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Session-Id': sessionId,
    ...((options.headers as Record<string, string>) || {}),
  };

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers['Content-Type']
  ) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'omit',
      signal: controller.signal,
    });
    clearTimeout(timeoutTimer);
    clearTimeout(slowTimer);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('aquaguard:warmup-ready', { detail: { path } })
      );
    }

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const message =
        errBody.detail ||
        errBody.message ||
        `Request failed with status ${res.status}`;
      if (res.status >= 400 && res.status < 500) {
        throw new ValidationError(message, errBody);
      }
      throw new ServerError(message, res.status);
    }

    if (res.status === 204) {
      return {} as T;
    }

    return (await res.json()) as T;
  } catch (err: unknown) {
    clearTimeout(timeoutTimer);
    clearTimeout(slowTimer);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('aquaguard:warmup-ready', { detail: { path } })
      );
    }

    if (err instanceof ApiError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new TimeoutError();
    }
    throw new NetworkError(
      (err as Error)?.message ||
        'Network error: unable to establish connection to backend service.'
    );
  }
}

class ApiClient {
  public isMockMode = USE_MOCK;

  async analyzeSample(
    inputs: WaterParameters,
    label?: string,
    location?: string,
    collected_at?: string
  ): Promise<WaterSampleAnalysis> {
    if (this.isMockMode) {
      // Simulate realistic UI latency of 400ms
      await new Promise((r) => setTimeout(r, 400));
      return MockApiService.analyze(inputs, label, location, collected_at);
    }

    return apiRequest<WaterSampleAnalysis>('/analyze', {
      method: 'POST',
      body: JSON.stringify({ ...inputs, label, location, collected_at }),
    });
  }

  async getAnalyses(
    params: AnalysesFilterParams = {}
  ): Promise<AnalysesListResponse> {
    if (this.isMockMode) {
      await new Promise((r) => setTimeout(r, 200));
      return MockApiService.getAnalyses(params);
    }

    const query = new URLSearchParams();
    if (params.query) query.set('query', params.query);
    if (params.band) query.set('band', params.band);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));

    const queryString = query.toString();
    return apiRequest<AnalysesListResponse>(
      `/analyses${queryString ? `?${queryString}` : ''}`
    );
  }

  async getAnalysisById(id: string): Promise<WaterSampleAnalysis> {
    if (this.isMockMode) {
      await new Promise((r) => setTimeout(r, 150));
      return MockApiService.getAnalysisById(id);
    }

    return apiRequest<WaterSampleAnalysis>(`/analyses/${id}`);
  }

  async deleteAnalysis(id: string): Promise<boolean> {
    if (this.isMockMode) {
      await new Promise((r) => setTimeout(r, 200));
      return MockApiService.deleteAnalysis(id);
    }

    await apiRequest<void>(`/analyses/${id}`, {
      method: 'DELETE',
    });
    return true;
  }

  async toggleSaved(id: string): Promise<WaterSampleAnalysis> {
    if (this.isMockMode) {
      return MockApiService.toggleSaved(id);
    }

    return apiRequest<WaterSampleAnalysis>(`/analyses/${id}/save`, {
      method: 'POST',
    });
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    if (this.isMockMode) {
      await new Promise((r) => setTimeout(r, 250));
      return MockApiService.getDashboardSummary();
    }

    return apiRequest<DashboardSummary>('/dashboard/summary');
  }

  async validateBatch(
    rows: Partial<BatchRowInput>[]
  ): Promise<BatchValidationResponse> {
    if (this.isMockMode) {
      await new Promise((r) => setTimeout(r, 300));
      return MockApiService.validateBatch(rows);
    }

    return apiRequest<BatchValidationResponse>('/batch/validate', {
      method: 'POST',
      body: JSON.stringify({ rows }),
    });
  }

  async analyzeBatch(
    validRows: BatchRowInput[]
  ): Promise<WaterSampleAnalysis[]> {
    if (this.isMockMode) {
      await new Promise((r) => setTimeout(r, 600));
      return MockApiService.analyzeBatch(validRows);
    }

    return apiRequest<WaterSampleAnalysis[]>('/batch/analyze', {
      method: 'POST',
      body: JSON.stringify({ rows: validRows }),
    });
  }

  async getModelCard(): Promise<ModelCardData> {
    if (this.isMockMode) {
      await new Promise((r) => setTimeout(r, 200));
      return MockApiService.getModelCard();
    }

    return apiRequest<ModelCardData>('/model-card');
  }

  async getHealth(): Promise<{
    status: string;
    uptime: number;
    version: string;
  }> {
    if (this.isMockMode) {
      return MockApiService.getHealth();
    }

    return apiRequest<{ status: string; uptime: number; version: string }>(
      '/health'
    );
  }
}

export const apiClient = new ApiClient();
