/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const ResponsibleUseNotice: React.FC = () => {
  return (
    <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-[12px] bg-[#E4F7FF] border border-[#BFC8CC]/60 text-xs sm:text-sm text-[#004B5A] leading-relaxed shadow-2xs">
      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 text-[#0F6477] shadow-xs">
        <ShieldCheck className="w-4 h-4" />
      </div>
      <p>
        <strong>Screening result for educational decision-support.</strong> Not a formal compliance or public supply certification.
      </p>
    </div>
  );
};
