/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Info, X } from 'lucide-react';

export const WarmupBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [isWarmingUp, setIsWarmingUp] = useState(false);

  useEffect(() => {
    const handleSlow = () => {
      setIsWarmingUp(true);
      setDismissed(false);
    };
    const handleReady = () => {
      setIsWarmingUp(false);
    };

    window.addEventListener('aquaguard:warmup-slow', handleSlow);
    window.addEventListener('aquaguard:warmup-ready', handleReady);
    return () => {
      window.removeEventListener('aquaguard:warmup-slow', handleSlow);
      window.removeEventListener('aquaguard:warmup-ready', handleReady);
    };
  }, []);

  if (dismissed) return null;

  return (
    <div className="bg-[#D7F2FE] border-b border-[#BFC8CC] px-4 py-1.5 text-xs text-[#0F6477] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 shrink-0 text-[#004B5A]" />
          <span>
            {isWarmingUp ? (
              <>
                <strong>Backend Warm-up:</strong> The service is waking from a
                cold start. Requests may take up to 45 seconds.
              </>
            ) : (
              <>
                <strong>Screening Model Notice:</strong> Empirical screening is
                calibrated against historical test-sets. Real-time inference
                latency is typically &lt; 500ms.
              </>
            )}
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:text-[#0A2F3A] rounded transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
