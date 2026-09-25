import React from 'react';
import { Scale, BookOpen, Clock, ShieldAlert, CheckCircle, FileText } from 'lucide-react';

export const ContinuousTrialGuidelines: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider">
          <span>Supreme Court of the Philippines</span>
          <span aria-hidden="true">·</span>
          <span>A.M. No. 15-06-10-SC</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif-court font-bold text-slate-900 mt-1">
          Revised Guidelines for Continuous Trial of Criminal Cases
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Standard operational benchmarks, statutory timeframes, and quarterly reporting rules for Regional Trial Courts
        </p>
      </div>

      {/* Grid of Key Timeframes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200">
          <div className="flex items-center gap-2 font-bold text-amber-900 uppercase">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>1. Arraignment</span>
          </div>
          <p className="mt-2 text-slate-700 leading-relaxed">
            Must be set within <strong>10 calendar days</strong> from court acquisition of jurisdiction if accused is in detention, or within <strong>30 calendar days</strong> if on bail.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 font-bold text-slate-900 uppercase">
            <FileText className="w-4 h-4 text-slate-700" />
            <span>2. Pre-Trial Conference</span>
          </div>
          <p className="mt-2 text-slate-700 leading-relaxed">
            Held immediately after arraignment. Must be completed within <strong>30 calendar days</strong>. Pre-Trial Order issued within 10 days from termination.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-red-50/40 border border-red-200">
          <div className="flex items-center gap-2 font-bold text-red-900 uppercase">
            <ShieldAlert className="w-4 h-4 text-red-700" />
            <span>3. Trial Period</span>
          </div>
          <p className="mt-2 text-slate-700 leading-relaxed">
            Continuous trial must be concluded within <strong>180 calendar days</strong> from the initial presentation of prosecution evidence. Postponements strictly prohibited.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200">
          <div className="flex items-center gap-2 font-bold text-emerald-900 uppercase">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            <span>4. Promulgation</span>
          </div>
          <p className="mt-2 text-slate-700 leading-relaxed">
            Judgment must be rendered and promulgated within <strong>90 calendar days</strong> from the time the case is submitted for decision.
          </p>
        </div>
      </div>

      {/* Mandated Case Types Priority List */}
      <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
        <h3 className="text-sm font-serif-court font-bold text-slate-900 uppercase tracking-wide mb-2">
          Mandated Case Types Tracked in Quarterly Inventory
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          Pursuant to Supreme Court rules, these 10 categories represent specialized and regular criminal actions requiring strict quarterly statistics:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-white p-2.5 rounded border border-slate-200">
            <span className="font-bold text-slate-900 block">Rape</span>
            <span className="text-[11px] text-slate-500">Anti-Rape Law / Revised Penal Code Art. 266-A</span>
          </div>
          <div className="bg-white p-2.5 rounded border border-slate-200">
            <span className="font-bold text-slate-900 block">Estafa</span>
            <span className="text-[11px] text-slate-500">RPC Art. 315 & Swindling Provisions</span>
          </div>
          <div className="bg-white p-2.5 rounded border border-slate-200">
            <span className="font-bold text-slate-900 block">RA 10591</span>
            <span className="text-[11px] text-slate-500">Comprehensive Firearms & Ammunition Regulation Act</span>
          </div>
          <div className="bg-white p-2.5 rounded border border-slate-200">
            <span className="font-bold text-slate-900 block">RA 9165</span>
            <span className="text-[11px] text-slate-500">Comprehensive Dangerous Drugs Act of 2002</span>
          </div>
          <div className="bg-white p-2.5 rounded border border-slate-200">
            <span className="font-bold text-slate-900 block">CARNAPPING</span>
            <span className="text-[11px] text-slate-500">RA 10883 / Anti-Carnapping Act</span>
          </div>
          <div className="bg-white p-2.5 rounded border border-slate-200">
            <span className="font-bold text-slate-900 block">KIDNAPPING</span>
            <span className="text-[11px] text-slate-500">Kidnapping and Serious Illegal Detention (RPC Art. 267)</span>
          </div>
          <div className="bg-white p-2.5 rounded border border-slate-200">
            <span className="font-bold text-slate-900 block">RA 9208</span>
            <span className="text-[11px] text-slate-500">Anti-Trafficking in Persons Act (as amended by RA 10364)</span>
          </div>
          <div className="bg-white p-2.5 rounded border border-slate-200">
            <span className="font-bold text-slate-900 block">ILLEGAL RECRUITMENT</span>
            <span className="text-[11px] text-slate-500">Migrant Workers and Overseas Filipinos Act (RA 8042/10022)</span>
          </div>
          <div className="bg-white p-2.5 rounded border border-slate-200">
            <span className="font-bold text-slate-900 block">GRAFT AND CORRUPTION</span>
            <span className="text-[11px] text-slate-500">RA 3019 / Anti-Graft and Corrupt Practices Act</span>
          </div>
          <div className="bg-white p-2.5 rounded border border-slate-200 sm:col-span-2 lg:col-span-3">
            <span className="font-bold text-slate-900 block">All other regular court cases</span>
            <span className="text-[11px] text-slate-500">Homicide, Murder, Theft, Robbery, Physical Injuries, and other penal statutes</span>
          </div>
        </div>
      </div>

      {/* Rules on Detainees & Quarterly Audits */}
      <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20 text-xs text-amber-950 space-y-1.5">
        <span className="font-bold block uppercase tracking-wider">
          Mandatory Priority for Accused in Detention & Quarterly Reporting
        </span>
        <p className="leading-relaxed">
          The trial of criminal cases involving accused persons in jail detention shall be given preferential priority over all other cases. 
          The Branch Clerk of Court is mandated to compile and submit the <strong>Quarterly Continuous Trial Performance & Caseload Audit Report</strong> to the Office of the Court Administrator (OCA) within fifteen (15) calendar days after the end of each quarter (March 31, June 30, September 30, and December 31).
        </p>
      </div>

      {/* Case Status Tracking Taxonomy */}
      <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 text-xs space-y-3">
        <h3 className="text-sm font-serif-court font-bold text-slate-900 uppercase tracking-wide">
          Case Status Tracking Taxonomy
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-white p-3 rounded border border-amber-300">
            <span className="font-bold text-amber-900 block mb-1">1. Pending</span>
            <span className="text-[11px] text-slate-600">Case docketed; awaiting preliminary calling, arraignment, or pending resolution of motions.</span>
          </div>
          <div className="bg-white p-3 rounded border border-sky-300">
            <span className="font-bold text-sky-900 block mb-1">2. Ongoing</span>
            <span className="text-[11px] text-slate-600">Active trial proceedings underway with regular continuous trial hearing dates scheduled.</span>
          </div>
          <div className="bg-white p-3 rounded border border-purple-300">
            <span className="font-bold text-purple-900 block mb-1">3. Adjourned</span>
            <span className="text-[11px] text-slate-600">Court proceedings temporarily adjourned/deferred to a designated calendar date.</span>
          </div>
          <div className="bg-white p-3 rounded border border-emerald-300">
            <span className="font-bold text-emerald-900 block mb-1">4. Decided</span>
            <span className="text-[11px] text-slate-600">Decision rendered, judgment promulgated (conviction/acquittal), or case dismissed.</span>
          </div>
          <div className="bg-white p-3 rounded border border-slate-300">
            <span className="font-bold text-slate-900 block mb-1">5. Archived</span>
            <span className="text-[11px] text-slate-600">Concluded docket committed to the court's permanent records repository.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
