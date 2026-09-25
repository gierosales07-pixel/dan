import React from 'react';
import { AccusedRecord, CaseStatus, CASE_STATUSES } from '../types/trial';
import { CaseStatusBadge } from './CaseStatusBadge';
import { UserPlus, FileSpreadsheet, ShieldAlert, Clock, CheckCircle2, Users, Activity, Play, Pause, Archive } from 'lucide-react';

interface CourtGreetingIntroProps {
  records: AccusedRecord[];
  onNavigateToInput: () => void;
  onNavigateToQuarterly: () => void;
  onNavigateToRegistry: (statusFilter?: string) => void;
}

export const CourtGreetingIntro: React.FC<CourtGreetingIntroProps> = ({
  records,
  onNavigateToInput,
  onNavigateToQuarterly,
  onNavigateToRegistry,
}) => {
  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good day';
  };

  const totalAccused = records.length;
  const inDetention = records.filter((r) => r.custodyStatus === 'In Detention' && !r.isDisposed).length;
  const onBail = records.filter((r) => r.custodyStatus === 'On Bail' && !r.isDisposed).length;
  const activeCases = records.filter((r) => !r.isDisposed).length;
  const disposedCases = records.filter((r) => r.isDisposed).length;

  // Case Status counts
  const getEffectiveStatus = (r: AccusedRecord): CaseStatus =>
    r.caseStatus || (r.isDisposed ? 'Decided' : 'Ongoing');

  const pendingCount = records.filter((r) => getEffectiveStatus(r) === 'Pending').length;
  const ongoingCount = records.filter((r) => getEffectiveStatus(r) === 'Ongoing').length;
  const adjournedCount = records.filter((r) => getEffectiveStatus(r) === 'Adjourned').length;
  const decidedCount = records.filter((r) => getEffectiveStatus(r) === 'Decided').length;
  const archivedCount = records.filter((r) => getEffectiveStatus(r) === 'Archived').length;

  const statusConfigs = [
    { status: 'Pending' as CaseStatus, count: pendingCount, icon: Clock, desc: 'Awaiting arraignment / calling', color: 'hover:border-amber-400 bg-amber-50/40 text-amber-900' },
    { status: 'Ongoing' as CaseStatus, count: ongoingCount, icon: Play, desc: 'Active continuous trial', color: 'hover:border-sky-400 bg-sky-50/40 text-sky-900' },
    { status: 'Adjourned' as CaseStatus, count: adjournedCount, icon: Pause, desc: 'Deferred / set for next date', color: 'hover:border-purple-400 bg-purple-50/40 text-purple-900' },
    { status: 'Decided' as CaseStatus, count: decidedCount, icon: CheckCircle2, desc: 'Promulgated / judgment entered', color: 'hover:border-emerald-400 bg-emerald-50/40 text-emerald-900' },
    { status: 'Archived' as CaseStatus, count: archivedCount, icon: Archive, desc: 'Closed & committed to records', color: 'hover:border-slate-400 bg-slate-50 text-slate-900' },
  ];

  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Judicial seal and formal court greeting */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-amber-600/30 shadow-md p-1 bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center overflow-hidden">
              <img
                src="/src/assets/images/rtc_judicial_seal_1790301356377.jpg"
                alt="Regional Trial Court Official Seal"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback container
                  const target = e.currentTarget;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-amber-400 font-serif-court font-bold text-xs opacity-0 hover:opacity-100">
                RTC
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold tracking-wider uppercase">
                <span>Republic of the Philippines</span>
                <span aria-hidden="true">·</span>
                <span>Supreme Court of the Philippines</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif-court font-bold text-slate-900 tracking-tight text-balance">
                {getGreetingTime()}, Court Officers & Judicial Staff
              </h1>

              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                Welcome to the official <strong>Continuous Trial Monitoring System (CTMS)</strong> for the Regional Trial Court. 
                In compliance with Supreme Court Administrative Matter No. 15-06-10-SC (<em>Revised Guidelines for Continuous Trial of Criminal Cases</em>), 
                this registry records accused demographic profiles, enforces strict statutory trial milestones, monitors detention custody, and automates quarterly performance reports.
              </p>
            </div>
          </div>

          {/* Right: Quick actions */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            <button
              onClick={onNavigateToInput}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow-sm transition-colors whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>Input Accused Information</span>
            </button>

            <button
              onClick={onNavigateToQuarterly}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors whitespace-nowrap"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-700" />
              <span>Generate Quarterly Report</span>
            </button>
          </div>
        </div>

        {/* 4-zone High-density Court Metric Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200">
          <div 
            onClick={() => onNavigateToRegistry()}
            className="cursor-pointer bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Total Accused on Record</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 font-mono-court tabular-nums">
              {totalAccused}
            </div>
            <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
              <span>{activeCases} Active</span>
              <span aria-hidden="true">·</span>
              <span>{disposedCases} Disposed</span>
            </div>
          </div>

          <div 
            onClick={() => onNavigateToRegistry()}
            className="cursor-pointer bg-amber-50/60 hover:bg-amber-50 border border-amber-200/80 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-amber-900 font-medium">
              <span>Accused in Detention</span>
              <ShieldAlert className="w-4 h-4 text-amber-700" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-950 font-mono-court tabular-nums">
              {inDetention}
            </div>
            <div className="mt-1 text-xs text-amber-800">
              High Priority Track (SC Mandatory Speedy Trial)
            </div>
          </div>

          <div 
            onClick={() => onNavigateToRegistry()}
            className="cursor-pointer bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Active Trials Underway</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 font-mono-court tabular-nums">
              {activeCases}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {onBail} On Bail / Recognizance
            </div>
          </div>

          <div 
            onClick={onNavigateToQuarterly}
            className="cursor-pointer bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200/80 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-emerald-900 font-medium">
              <span>Cases Disposed / Promulgated</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-950 font-mono-court tabular-nums">
              {disposedCases}
            </div>
            <div className="mt-1 text-xs text-emerald-700">
              Continuous Trial Disposition Rate
            </div>
          </div>
        </div>

        {/* Case Status Tracking Ribbon */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Case Status Tracking Dashboard
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">
              Click a status to filter docket records
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {statusConfigs.map((cfg) => {
              const IconComp = cfg.icon;
              return (
                <button
                  key={cfg.status}
                  onClick={() => onNavigateToRegistry(cfg.status)}
                  className={`p-3 rounded-lg border border-slate-200 text-left transition-all group ${cfg.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wide">
                      {cfg.status}
                    </span>
                    <IconComp className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  </div>
                  <div className="mt-1.5 text-xl font-bold font-mono-court tabular-nums">
                    {cfg.count}
                  </div>
                  <div className="text-[10px] opacity-75 truncate mt-0.5">
                    {cfg.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
