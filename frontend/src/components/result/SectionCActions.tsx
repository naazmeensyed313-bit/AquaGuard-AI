/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ListChecks,
  FlaskConical,
  CalendarCheck,
  FileCheck2,
  Building2,
  ChevronDown,
  Info,
} from 'lucide-react';
import { DecisionAction } from '../../types';
import { Card } from '../ui/Card';

interface SectionCActionsProps {
  recommendations: DecisionAction[];
  limitations: string[];
}

export const SectionCActions: React.FC<SectionCActionsProps> = ({
  recommendations,
  limitations: _limitations,
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const getIcon = (name: DecisionAction['iconName']) => {
    switch (name) {
      case 'flask':
        return <FlaskConical className="w-5 h-5 text-[#0F6477]" />;
      case 'calendar':
        return <CalendarCheck className="w-5 h-5 text-[#0F6477]" />;
      case 'checklist':
        return <FileCheck2 className="w-5 h-5 text-[#0F6477]" />;
      case 'building':
        return <Building2 className="w-5 h-5 text-[#0F6477]" />;
      default:
        return <FileCheck2 className="w-5 h-5 text-[#0F6477]" />;
    }
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-[#0F6477]/10 flex items-center justify-center text-[#0F6477]">
          <ListChecks className="w-4 h-4" />
        </div>
        <h2 className="font-display font-bold text-lg sm:text-xl text-[#0F2A33]">
          Decision-Support Actions
        </h2>
      </div>

      {/* Action Cards */}
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <Card
            key={rec.id}
            className="p-4 flex items-start gap-3.5 hover:border-[#22B3C1] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#E4F7FF] border border-[#BFC8CC]/50 flex items-center justify-center shrink-0 shadow-2xs">
              {getIcon(rec.iconName)}
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-semibold text-sm text-[#0F2A33]">
                {rec.title}
              </h3>
              <p className="text-xs text-[#4F6C76] leading-relaxed">
                {rec.description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Expandable Accordion: What this screening does not cover */}
      <div className="border border-[#D5E3E7] rounded-[14px] bg-white overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F4F9FA] transition-colors cursor-pointer"
          aria-expanded={isAccordionOpen}
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0F2A33]">
            <Info className="w-4 h-4 text-[#0F6477]" />
            <span>What this screening does not cover</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#4F6C76] transition-transform duration-200 ${
              isAccordionOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isAccordionOpen && (
          <div className="p-4 pt-1 border-t border-[#E7F0F2] bg-[#F9FBFC] text-xs text-[#4F6C76] space-y-2.5">
            <p className="font-medium text-[#0F2A33]">
              The 9 parameters evaluated by AquaGuard AI constitute
              physicochemical proxies. The system does not assay:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 leading-relaxed text-[#4F6C76]">
              <li>
                <strong>Microbiological Pathogens:</strong> Bacterial colonies
                (E. coli, coliforms), viral pathogens (rotavirus, norovirus), or
                protozoan cysts (Giardia, Cryptosporidium).
              </li>
              <li>
                <strong>Heavy Metal Contaminants:</strong> Lead (Pb), Arsenic
                (As), Cadmium (Cd), Mercury (Hg), Chromium-6 (Cr-VI), and Copper
                (Cu).
              </li>
              <li>
                <strong>Synthetic Chemicals & PFAS:</strong> Per- and
                polyfluoroalkyl substances (PFAS), industrial solvents,
                microplastics, pesticide runoff, and pharmaceutical residuals.
              </li>
              <li>
                <strong>Radiological Isotopes:</strong> Radon, uranium, radium,
                or gross alpha/beta radioactive decay emissions.
              </li>
            </ul>
            <div className="pt-2 text-[11px] text-[#6F797C] italic">
              Formal drinking water clearance requires state-certified
              multi-barrier laboratory testing.
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
