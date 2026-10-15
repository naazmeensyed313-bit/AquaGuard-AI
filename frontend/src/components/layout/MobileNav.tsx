/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FlaskConical, Compass, LayoutDashboard, History, MoreHorizontal, X, FileSpreadsheet, GitCompare, Info } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const navItems = [
    { label: 'Analyze', path: '/analyze', icon: FlaskConical },
    {
      label: 'Results',
      path: location.pathname.startsWith('/result/')
        ? location.pathname
        : '/result/sample-ward-12',
      icon: Compass,
    },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'History', path: '/history', icon: History },
  ];

  return (
    <>
      {/* Mobile Drawer/Modal for More */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 md:hidden bg-[#0A2F3A]/60 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-[18px] p-5 border-t border-[#D5E3E7] shadow-xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E7F0F2]">
              <span className="font-display font-semibold text-sm text-[#0F2A33]">More Modules</span>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1 text-[#4F6C76] hover:text-[#0F2A33]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Link
                to="/compare"
                onClick={() => setShowMoreMenu(false)}
                className="flex flex-col items-center justify-center p-3 rounded-[10px] bg-[#F4F9FA] hover:bg-[#E4F7FF] text-[#0F2A33] text-xs font-medium gap-2 border border-[#D5E3E7]"
              >
                <GitCompare className="w-5 h-5 text-[#0F6477]" />
                <span>Compare</span>
              </Link>
              <Link
                to="/batch"
                onClick={() => setShowMoreMenu(false)}
                className="flex flex-col items-center justify-center p-3 rounded-[10px] bg-[#F4F9FA] hover:bg-[#E4F7FF] text-[#0F2A33] text-xs font-medium gap-2 border border-[#D5E3E7]"
              >
                <FileSpreadsheet className="w-5 h-5 text-[#0F6477]" />
                <span>Batch Upload</span>
              </Link>
              <Link
                to="/about"
                onClick={() => setShowMoreMenu(false)}
                className="flex flex-col items-center justify-center p-3 rounded-[10px] bg-[#F4F9FA] hover:bg-[#E4F7FF] text-[#0F2A33] text-xs font-medium gap-2 border border-[#D5E3E7]"
              >
                <Info className="w-5 h-5 text-[#0F6477]" />
                <span>Model Card</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D5E3E7] px-2 py-1.5 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive =
              item.label === 'Results'
                ? location.pathname.startsWith('/result')
                : location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'text-[#004B5A] font-semibold'
                    : 'text-[#6F797C] hover:text-[#0F2A33]'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setShowMoreMenu(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[11px] font-medium text-[#6F797C] hover:text-[#0F2A33]"
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span>More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
