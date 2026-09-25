import React, { useState } from 'react';
import { AccusedRecord, QuarterNumber, CASE_STATUSES, CaseStatus } from '../types/trial';
import { calculateQuarterlySummary, exportQuarterlyReportToCSV } from '../utils/quarterlyCalculations';
import { CaseStatusBadge } from './CaseStatusBadge';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Calendar, 
  Scale, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Search, 
  Eye, 
  TrendingUp,
  FileCheck,
  Activity
} from 'lucide-react';

interface QuarterlyReportViewProps {
  records: AccusedRecord[];
  onViewRecord: (record: AccusedRecord) => void;
  onPrintReport: (quarter: QuarterNumber, year: number) => void;
}

export const QuarterlyReportView: React.FC<QuarterlyReportViewProps> = ({
  records,
  onViewRecord,
  onPrintReport,
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedQuarter, setSelectedQuarter] = useState<QuarterNumber>(3); // Q3 2026 default
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const summary = calculateQuarterlySummary(records, selectedYear, selectedQuarter);

  const filteredQuarterRecords = summary.recordsInQuarter.filter((rec) => {
    const fullName = `${rec.surname} ${rec.firstname} ${rec.middleName} ${rec.alias}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      rec.docketNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || rec.typeOfCase === filterType;
    const effectiveStatus = rec.caseStatus || (rec.isDisposed ? 'Decided' : 'Ongoing');
    const matchesStatus = filterStatus === 'all' || effectiveStatus === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Control Strip & Quarter Selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider">
              <span>Office of the Court Administrator</span>
              <span aria-hidden="true">·</span>
              <span>Regional Trial Court</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif-court font-bold text-slate-900 mt-1">
              Quarterly Continuous Trial Docket Report
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive judicial caseload inventory, continuous trial timeline audit, and detention roster
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportQuarterlyReportToCSV(summary)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => onPrintReport(selectedQuarter, selectedYear)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Official Report</span>
            </button>
          </div>
        </div>

        {/* Quarter & Year Selector Bar */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-600" />
              Select Period:
            </span>

            {/* Quarter Buttons */}
            <div className="inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              {([1, 2, 3, 4] as QuarterNumber[]).map((q) => (
                <button
                  key={q}
                  onClick={() => setSelectedQuarter(q)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    selectedQuarter === q
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Q{q}
                </button>
              ))}
            </div>

            {/* Year Dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {[2027, 2026, 2025, 2024].map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-600 font-medium bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
            Reporting Span: <span className="font-semibold text-slate-900">{summary.quarterLabel}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5">
          <span className="text-[11px] font-medium text-slate-500 block">Total Handled</span>
          <span className="text-xl font-bold font-mono-court text-slate-900 tabular-nums">
            {summary.recordsInQuarter.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Active docket pool</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5">
          <span className="text-[11px] font-medium text-slate-500 block">Received in Q{selectedQuarter}</span>
          <span className="text-xl font-bold font-mono-court text-amber-700 tabular-nums">
            {summary.totalReceived}
          </span>
          <span className="text-[10px] text-amber-600/80 block mt-0.5">New intake</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5">
          <span className="text-[11px] font-medium text-slate-500 block">Active Pending</span>
          <span className="text-xl font-bold font-mono-court text-slate-900 tabular-nums">
            {summary.totalActive}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Undergoing trial</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5">
          <span className="text-[11px] font-medium text-slate-500 block">In Detention</span>
          <span className="text-xl font-bold font-mono-court text-red-700 tabular-nums">
            {summary.inDetentionCount}
          </span>
          <span className="text-[10px] text-red-600/80 block mt-0.5">Expedited track</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5">
          <span className="text-[11px] font-medium text-slate-500 block">Disposed / Promulgated</span>
          <span className="text-xl font-bold font-mono-court text-emerald-700 tabular-nums">
            {summary.totalDisposed}
          </span>
          <span className="text-[10px] text-emerald-600/80 block mt-0.5">Clearance: {summary.clearanceRate}%</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5">
          <span className="text-[11px] font-medium text-slate-500 block">SC Continuous Trial</span>
          <span className="text-xl font-bold font-mono-court text-slate-900 tabular-nums">
            {summary.continuousTrialComplianceRate}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Within 180-day limit</span>
        </div>
      </div>

      {/* Case Type Breakdown Matrix (Mandatory Categories) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-serif-court font-semibold tracking-wide">
              Official Caseload Breakdown by Mandated Case Category
            </h3>
          </div>
          <span className="text-xs text-amber-400 font-mono-court">
            A.M. No. 15-06-10-SC Schedule
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Mandated Case Category</th>
                <th className="py-3 px-3 text-right">Pending (Beg.)</th>
                <th className="py-3 px-3 text-right">Received (Q{selectedQuarter})</th>
                <th className="py-3 px-3 text-right">Total Handled</th>
                <th className="py-3 px-3 text-right text-emerald-800">Disposed (Q{selectedQuarter})</th>
                <th className="py-3 px-3 text-right">Pending (End)</th>
                <th className="py-3 px-3 text-right text-red-800">In Detention</th>
                <th className="py-3 px-3 text-right">On Bail</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {summary.typeBreakdown.map((row) => {
                const totalHandled = row.pendingStart + row.receivedInQuarter;
                const hasActivity = totalHandled > 0;
                return (
                  <tr
                    key={row.type}
                    className={`hover:bg-slate-50 transition-colors ${
                      hasActivity ? 'bg-white' : 'bg-slate-50/40 text-slate-400'
                    }`}
                  >
                    <td className="py-2.5 px-4 font-medium text-slate-900">
                      {row.type}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono-court tabular-nums text-slate-600">
                      {row.pendingStart}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono-court tabular-nums font-semibold text-amber-700">
                      {row.receivedInQuarter}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono-court tabular-nums font-semibold text-slate-900">
                      {totalHandled}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono-court tabular-nums font-semibold text-emerald-700">
                      {row.disposedInQuarter}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono-court tabular-nums text-slate-800">
                      {row.pendingEnd}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono-court tabular-nums font-medium text-red-700">
                      {row.inDetention}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono-court tabular-nums text-slate-600">
                      {row.onBail}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {row.disposedInQuarter > 0 ? (
                        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Disposed
                        </span>
                      ) : row.receivedInQuarter > 0 ? (
                        <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                          Active Intake
                        </span>
                      ) : row.pendingEnd > 0 ? (
                        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          Ongoing
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-100 font-semibold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td className="py-3 px-4 uppercase tracking-wider">Total RTC Branch Docket</td>
                <td className="py-3 px-3 text-right font-mono-court tabular-nums">
                  {summary.typeBreakdown.reduce((acc, r) => acc + r.pendingStart, 0)}
                </td>
                <td className="py-3 px-3 text-right font-mono-court tabular-nums text-amber-800 font-bold">
                  {summary.totalReceived}
                </td>
                <td className="py-3 px-3 text-right font-mono-court tabular-nums font-bold">
                  {summary.recordsInQuarter.length}
                </td>
                <td className="py-3 px-3 text-right font-mono-court tabular-nums text-emerald-800 font-bold">
                  {summary.totalDisposed}
                </td>
                <td className="py-3 px-3 text-right font-mono-court tabular-nums font-bold">
                  {summary.totalActive}
                </td>
                <td className="py-3 px-3 text-right font-mono-court tabular-nums text-red-800 font-bold">
                  {summary.inDetentionCount}
                </td>
                <td className="py-3 px-3 text-right font-mono-court tabular-nums font-bold">
                  {summary.onBailCount}
                </td>
                <td className="py-3 px-4 text-center text-xs text-slate-600">
                  {summary.clearanceRate}% Clearance
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Accused Roster for the Selected Quarter */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-serif-court font-bold text-slate-900">
              Accused Caseload Roster for {summary.quarterLabel}
            </h3>
            <p className="text-xs text-slate-500">
              Continuous trial stage audit, custody conditions, and trial notes
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search surname, alias, case no..."
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 w-48 sm:w-60"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none"
            >
              <option value="all">All Case Types</option>
              {summary.typeBreakdown.map((b) => (
                <option key={b.type} value={b.type}>
                  {b.type}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">All Statuses</option>
              {CASE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredQuarterRecords.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-slate-700">No accused records found for this period filter.</p>
            <p className="text-xs text-slate-400 mt-1">
              Select another quarter or add a new accused with intake dates within this period.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Docket Number</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4">Accused Name & Alias</th>
                  <th className="py-3 px-3">Age / DOB</th>
                  <th className="py-3 px-4">Type of Case</th>
                  <th className="py-3 px-3">Date Received</th>
                  <th className="py-3 px-3">Custody</th>
                  <th className="py-3 px-4">Continuous Trial Stage</th>
                  <th className="py-3 px-4">Next Hearing / Remarks</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredQuarterRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono-court font-semibold text-slate-900 whitespace-nowrap">
                      {rec.docketNumber}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <CaseStatusBadge status={rec.caseStatus || (rec.isDisposed ? 'Decided' : 'Ongoing')} size="sm" />
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {rec.surname}, {rec.firstname} {rec.middleName || ''}
                      </div>
                      {rec.alias && rec.alias !== 'N/A' && (
                        <div className="text-[11px] text-slate-500 italic">
                          Alias: "{rec.alias}"
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 font-mono-court text-slate-700 tabular-nums whitespace-nowrap">
                      <span>{rec.age} yrs</span>
                      <span className="block text-[10px] text-slate-400">{rec.dateOfBirth}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 block">
                        {rec.typeOfCase}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Filed: {rec.dateFiled}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono-court text-slate-800 tabular-nums whitespace-nowrap">
                      {rec.dateReceived}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      {rec.custodyStatus === 'In Detention' ? (
                        <span className="text-red-700 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block"></span>
                          In Detention
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                          On Bail
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-900">
                        {rec.currentTrialStage}
                      </span>
                      {rec.isDisposed && rec.dispositionOutcome && (
                        <span className="block text-[11px] text-emerald-700 font-semibold">
                          Outcome: {rec.dispositionOutcome}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                      {rec.nextHearingDate ? (
                        <div>
                          <span className="font-semibold text-slate-800">
                            {rec.nextHearingDate}
                          </span>
                          <span className="block text-[11px] text-slate-500 truncate">
                            {rec.nextHearingPurpose || 'Trial hearing'}
                          </span>
                        </div>
                      ) : (
                        <span>{rec.remarks || 'No remarks recorded'}</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onViewRecord(rec)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Dossier</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
