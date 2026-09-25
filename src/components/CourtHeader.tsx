import React from 'react';
import { Scale, FileSpreadsheet, UserPlus, BookOpen, Printer } from 'lucide-react';

interface CourtHeaderProps {
  currentTab: 'overview' | 'input' | 'registry' | 'quarterly' | 'guidelines';
  setCurrentTab: (tab: 'overview' | 'input' | 'registry' | 'quarterly' | 'guidelines') => void;
  onOpenQuickInput: () => void;
  onPrintReport?: () => void;
}

export const CourtHeader: React.FC<CourtHeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenQuickInput,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-court tracking-wider font-semibold text-base text-slate-100 uppercase">
                Regional Trial Court
              </span>
              <span className="text-[11px] tracking-wide text-amber-400/90 font-medium">
                Continuous Trial Monitoring System
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('overview')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                currentTab === 'overview'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Court Overview
            </button>

            <button
              onClick={() => setCurrentTab('input')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                currentTab === 'input'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Input Accused Record
            </button>

            <button
              onClick={() => setCurrentTab('registry')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                currentTab === 'registry'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Accused Registry
            </button>

            <button
              onClick={() => setCurrentTab('quarterly')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                currentTab === 'quarterly'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Quarterly Report
            </button>

            <button
              onClick={() => setCurrentTab('guidelines')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                currentTab === 'guidelines'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Continuous Trial Rules
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('quarterly')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors whitespace-nowrap"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span>Quarterly Report</span>
            </button>
            <button
              onClick={onOpenQuickInput}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow-sm transition-colors whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-950" />
              <span>New Accused</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800 text-xs">
          <button
            onClick={() => setCurrentTab('overview')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentTab === 'overview' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentTab('input')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentTab === 'input' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Input Accused
          </button>
          <button
            onClick={() => setCurrentTab('registry')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentTab === 'registry' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Accused Docket
          </button>
          <button
            onClick={() => setCurrentTab('quarterly')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentTab === 'quarterly' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Quarterly Report
          </button>
          <button
            onClick={() => setCurrentTab('guidelines')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentTab === 'guidelines' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Rules
          </button>
        </div>
      </div>
    </header>
  );
};
