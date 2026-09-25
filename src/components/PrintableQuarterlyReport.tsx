import React from 'react';
import { AccusedRecord, QuarterNumber } from '../types/trial';
import { calculateQuarterlySummary } from '../utils/quarterlyCalculations';
import { Printer, ArrowLeft } from 'lucide-react';

interface PrintableQuarterlyReportProps {
  records: AccusedRecord[];
  quarter: QuarterNumber;
  year: number;
  courtBranch?: string;
  judicialRegion?: string;
  presidingJudge?: string;
  branchClerk?: string;
  onClose: () => void;
}

export const PrintableQuarterlyReport: React.FC<PrintableQuarterlyReportProps> = ({
  records,
  quarter,
  year,
  courtBranch = "Branch 42",
  judicialRegion = "National Capital Judicial Region",
  presidingJudge = "Hon. Maria Victoria S. Alcantara",
  branchClerk = "Atty. Renato P. Dimagiba",
  onClose,
}) => {
  const summary = calculateQuarterlySummary(records, year, quarter);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Top Action Toolbar (Hidden when printing) */}
      <div className="sticky top-0 z-50 bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to CTMS</span>
          </button>
          <span className="text-xs text-amber-400 font-serif-court font-semibold">
            Official OCA Form Preview · {summary.quarterLabel}
          </span>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow transition-colors"
        >
          <Printer className="w-4 h-4 text-slate-950" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Official Court Document Sheet */}
      <div className="max-w-5xl mx-auto p-6 sm:p-10 font-sans print:p-0 print:max-w-none text-slate-900">
        {/* Supreme Court / RTC Header */}
        <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full border border-slate-800 p-0.5 overflow-hidden">
              <img
                src="/src/assets/images/rtc_judicial_seal_1790301356377.jpg"
                alt="RTC Seal"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="text-xs font-serif-court tracking-widest uppercase font-bold text-slate-700">
            Republic of the Philippines
          </div>
          <div className="text-sm font-serif-court font-bold uppercase tracking-wider text-slate-900">
            Supreme Court of the Philippines
          </div>
          <div className="text-xs font-serif-court text-slate-700 font-medium">
            Office of the Court Administrator
          </div>
          <div className="text-base font-serif-court font-bold uppercase tracking-wider text-slate-900 mt-1">
            Regional Trial Court
          </div>
          <div className="text-xs text-slate-700 font-medium">
            {judicialRegion} · {courtBranch}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-300">
            <h1 className="text-lg font-serif-court font-bold uppercase tracking-wide text-slate-950">
              Quarterly Continuous Trial Performance & Caseload Audit Report
            </h1>
            <p className="text-xs text-slate-600 italic">
              In Compliance with Supreme Court Administrative Matter No. 15-06-10-SC (Revised Guidelines for Continuous Trial of Criminal Cases)
            </p>
            <p className="text-xs font-bold text-slate-900 mt-1 font-mono-court">
              REPORTING PERIOD: {summary.quarterLabel.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Section 1: Executive Docket Summary */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
            I. Executive Trial Statistics & Performance Metrics
          </h2>
          <div className="grid grid-cols-4 gap-3 text-xs border border-slate-300 p-3 bg-slate-50/50">
            <div>
              <span className="text-slate-500 block">Total Handled:</span>
              <span className="font-bold font-mono-court text-sm">{summary.recordsInQuarter.length} cases</span>
            </div>
            <div>
              <span className="text-slate-500 block">Newly Received:</span>
              <span className="font-bold font-mono-court text-sm">{summary.totalReceived} cases</span>
            </div>
            <div>
              <span className="text-slate-500 block">Pending Trial:</span>
              <span className="font-bold font-mono-court text-sm">{summary.totalActive} cases</span>
            </div>
            <div>
              <span className="text-slate-500 block">Disposed / Promulgated:</span>
              <span className="font-bold font-mono-court text-sm text-emerald-800">{summary.totalDisposed} cases</span>
            </div>
            <div>
              <span className="text-slate-500 block">In Detention (Jail):</span>
              <span className="font-bold font-mono-court text-sm text-red-800">{summary.inDetentionCount} accused</span>
            </div>
            <div>
              <span className="text-slate-500 block">On Provisional Bail:</span>
              <span className="font-bold font-mono-court text-sm">{summary.onBailCount} accused</span>
            </div>
            <div>
              <span className="text-slate-500 block">Disposition Clearance:</span>
              <span className="font-bold font-mono-court text-sm">{summary.clearanceRate}%</span>
            </div>
            <div>
              <span className="text-slate-500 block">Continuous Trial Compliance:</span>
              <span className="font-bold font-mono-court text-sm">{summary.continuousTrialComplianceRate}%</span>
            </div>
          </div>
        </div>

        {/* Section 2: Mandated Case Type Breakdown Table */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
            II. Case Type Inventory Matrix (Pursuant to Court Administrator Directives)
          </h2>
          <table className="w-full text-[11px] border border-slate-400 border-collapse">
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-400">
                <th className="p-2 border-r border-slate-400 text-left">Case Type / Category</th>
                <th className="p-2 border-r border-slate-400 text-right">Beg. Pending</th>
                <th className="p-2 border-r border-slate-400 text-right">Received (Q{quarter})</th>
                <th className="p-2 border-r border-slate-400 text-right">Total Handled</th>
                <th className="p-2 border-r border-slate-400 text-right">Disposed</th>
                <th className="p-2 border-r border-slate-400 text-right">End Pending</th>
                <th className="p-2 border-r border-slate-400 text-right">In Detention</th>
                <th className="p-2 text-right">On Bail</th>
              </tr>
            </thead>
            <tbody>
              {summary.typeBreakdown.map((row, idx) => (
                <tr key={row.type} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-2 border-t border-r border-slate-300 font-medium text-slate-900">
                    {row.type}
                  </td>
                  <td className="p-2 border-t border-r border-slate-300 text-right font-mono-court">
                    {row.pendingStart}
                  </td>
                  <td className="p-2 border-t border-r border-slate-300 text-right font-mono-court font-semibold">
                    {row.receivedInQuarter}
                  </td>
                  <td className="p-2 border-t border-r border-slate-300 text-right font-mono-court font-semibold">
                    {row.pendingStart + row.receivedInQuarter}
                  </td>
                  <td className="p-2 border-t border-r border-slate-300 text-right font-mono-court font-bold text-emerald-800">
                    {row.disposedInQuarter}
                  </td>
                  <td className="p-2 border-t border-r border-slate-300 text-right font-mono-court">
                    {row.pendingEnd}
                  </td>
                  <td className="p-2 border-t border-r border-slate-300 text-right font-mono-court font-medium text-red-800">
                    {row.inDetention}
                  </td>
                  <td className="p-2 border-t border-slate-300 text-right font-mono-court">
                    {row.onBail}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-200 font-bold border-t-2 border-slate-500">
                <td className="p-2 border-r border-slate-400 uppercase">Total Criminal Dockets</td>
                <td className="p-2 border-r border-slate-400 text-right font-mono-court">
                  {summary.typeBreakdown.reduce((acc, r) => acc + r.pendingStart, 0)}
                </td>
                <td className="p-2 border-r border-slate-400 text-right font-mono-court">
                  {summary.totalReceived}
                </td>
                <td className="p-2 border-r border-slate-400 text-right font-mono-court">
                  {summary.recordsInQuarter.length}
                </td>
                <td className="p-2 border-r border-slate-400 text-right font-mono-court text-emerald-900">
                  {summary.totalDisposed}
                </td>
                <td className="p-2 border-r border-slate-400 text-right font-mono-court">
                  {summary.totalActive}
                </td>
                <td className="p-2 border-r border-slate-400 text-right font-mono-court text-red-900">
                  {summary.inDetentionCount}
                </td>
                <td className="p-2 text-right font-mono-court">
                  {summary.onBailCount}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Section 3: Accused Caseload Audit List */}
        <div className="mb-8 print-break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
            III. Accused Information & Continuous Trial Stage Status
          </h2>
          <table className="w-full text-[10px] border border-slate-400 border-collapse">
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-400">
                <th className="p-1.5 border-r border-slate-400 text-left">Case Number</th>
                <th className="p-1.5 border-r border-slate-400 text-left">Status</th>
                <th className="p-1.5 border-r border-slate-400 text-left">Accused Name & Alias</th>
                <th className="p-1.5 border-r border-slate-400 text-left">Type of Case</th>
                <th className="p-1.5 border-r border-slate-400 text-left">Date Filed / Received</th>
                <th className="p-1.5 border-r border-slate-400 text-left">Custody</th>
                <th className="p-1.5 border-r border-slate-400 text-left">Current Stage</th>
                <th className="p-1.5 text-left">Remarks / Hearing</th>
              </tr>
            </thead>
            <tbody>
              {summary.recordsInQuarter.map((rec) => (
                <tr key={rec.id} className="border-t border-slate-300">
                  <td className="p-1.5 border-r border-slate-300 font-mono-court font-semibold">
                    {rec.docketNumber}
                  </td>
                  <td className="p-1.5 border-r border-slate-300 font-medium">
                    <span className="font-semibold text-slate-800">
                      {rec.caseStatus || (rec.isDisposed ? 'Decided' : 'Ongoing')}
                    </span>
                  </td>
                  <td className="p-1.5 border-r border-slate-300">
                    <span className="font-bold">{rec.surname}, {rec.firstname} {rec.middleName || ''}</span>
                    {rec.alias && rec.alias !== 'N/A' && (
                      <span className="block text-slate-500 italic">a.k.a. {rec.alias}</span>
                    )}
                    <span className="text-[9px] text-slate-400 block">{rec.age} yrs · {rec.address}</span>
                  </td>
                  <td className="p-1.5 border-r border-slate-300 font-medium">
                    {rec.typeOfCase}
                  </td>
                  <td className="p-1.5 border-r border-slate-300 font-mono-court">
                    <div>F: {rec.dateFiled}</div>
                    <div>R: {rec.dateReceived}</div>
                  </td>
                  <td className="p-1.5 border-r border-slate-300 font-semibold">
                    {rec.custodyStatus === 'In Detention' ? (
                      <span className="text-red-700">Detained</span>
                    ) : (
                      <span className="text-slate-700">{rec.custodyStatus}</span>
                    )}
                  </td>
                  <td className="p-1.5 border-r border-slate-300 font-medium">
                    {rec.currentTrialStage}
                    {rec.dispositionOutcome && (
                      <span className="block text-emerald-800 font-bold">[{rec.dispositionOutcome}]</span>
                    )}
                  </td>
                  <td className="p-1.5 text-slate-700">
                    {rec.nextHearingDate ? (
                      <span>Hrg: {rec.nextHearingDate} ({rec.nextHearingPurpose || 'Trial'})</span>
                    ) : (
                      <span>{rec.remarks || '—'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4: Legal Certification & Signatures */}
        <div className="pt-8 border-t-2 border-slate-800 print-break-inside-avoid">
          <p className="text-xs text-slate-700 mb-8 leading-relaxed">
            <strong>CERTIFICATION:</strong> I hereby certify under oath that this Quarterly Continuous Trial Monitoring and Caseload Inventory Report has been verified with the primary docket books, minutes of court sessions, and detention facility records of this Branch, in strict adherence to Supreme Court A.M. No. 15-06-10-SC.
          </p>

          <div className="grid grid-cols-2 gap-12 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 text-[11px] block">Prepared and Submitted by:</span>
              <div className="h-10"></div>
              <div className="font-bold uppercase tracking-wider text-slate-900 border-t border-slate-400 pt-1">
                {branchClerk}
              </div>
              <div className="text-slate-600 font-medium">
                Branch Clerk of Court
              </div>
              <div className="text-slate-400 text-[10px]">
                Regional Trial Court, {courtBranch}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 text-[11px] block">Verified and Attested by:</span>
              <div className="h-10"></div>
              <div className="font-bold uppercase tracking-wider text-slate-900 border-t border-slate-400 pt-1">
                {presidingJudge}
              </div>
              <div className="text-slate-600 font-medium">
                Presiding Judge
              </div>
              <div className="text-slate-400 text-[10px]">
                Regional Trial Court, {courtBranch}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
            Official Judicial Document · Regional Trial Court Continuous Trial Monitoring System · A.M. No. 15-06-10-SC
          </div>
        </div>
      </div>
    </div>
  );
};
