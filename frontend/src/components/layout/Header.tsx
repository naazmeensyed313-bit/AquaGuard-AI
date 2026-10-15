/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Plus } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { label: 'Analyze', path: '/analyze' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'History', path: '/history' },
    { label: 'Compare', path: '/compare' },
    { label: 'Batch Upload', path: '/batch' },
    { label: 'About / Model Card', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F2FBFF]/90 backdrop-blur-md border-b border-[#D5E3E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Left: Brand lockup */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#0F6477] to-[#0A2F3A] flex items-center justify-center text-white shadow-sm ring-1 ring-[#22B3C1]/30">
            {/* Custom stylized water droplet + leaf / shield icon */}
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
                fill="rgba(34, 179, 193, 0.25)"
              />
              <path d="M12 12a3 3 0 0 0 3 3" />
            </svg>
          </div>
          <div>
            <span className="font-display font-bold text-base sm:text-lg text-[#0F2A33] tracking-tight group-hover:text-[#0F6477] transition-colors">
              AquaGuard AI
            </span>
          </div>
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === '/history' &&
                location.pathname.startsWith('/result'));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-[8px] text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#E4F7FF] text-[#004B5A] font-semibold'
                    : 'text-[#4F6C76] hover:text-[#0F2A33] hover:bg-white/60'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/analyze"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-[#004B5A] hover:bg-[#0B4A57] active:bg-[#0A2F3A] text-white text-xs sm:text-sm font-medium shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Analysis</span>
          </Link>

          <div
            title="Anonymous Analytical Session"
            className="w-8 h-8 rounded-full bg-[#E4F7FF] border border-[#BFC8CC] flex items-center justify-center text-[#0F6477] cursor-pointer hover:bg-[#D7F2FE] transition-colors"
          >
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
