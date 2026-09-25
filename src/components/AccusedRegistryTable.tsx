import React, { useState } from 'react';
import { AccusedRecord, CASE_TYPES, CaseType, CASE_STATUSES, CaseStatus, CustodyStatus, TrialStage } from '../types/trial';
import { CaseStatusBadge } from './CaseStatusBadge';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  ShieldAlert, 
  Clock, 
  CheckCircle, 
  UserPlus, 
  FileText,
  AlertTriangle,
  Activity
} from 'lucide-react';

interface AccusedRegistryTableProps {
  records: AccusedRecord[];
  onViewRecord: (record: AccusedRecord) => void;
  onEditRecord: (record: AccusedRecord) => void;
  onDeleteRecord: (id: string) => void;
  onNewRecord: () => void;
  onUpdateStage: (id: string, stage: TrialStage) => void;
  onUpdateStatus?: (id: string, status: CaseStatus) => void;
  initialStatusFilter?: string;
}

export const AccusedRegistryTable: React.FC<AccusedRegistryTableProps> = ({
  records,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  onNewRecord,
  onUpdateStage,
  onUpdateStatus,
  initialStatusFilter = 'all',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCaseType, setSelectedCaseType] = useState<string>('all');
  const [selectedCustody, setSelectedCustody] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatusFilter);

  const filteredRecords = records.filter((rec) => {
    const searchStr = `${rec.surname} ${rec.firstname} ${rec.middleName} ${rec.alias} ${rec.docketNumber} ${rec.address}`.toLowerCase();
    const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
    const matchesType = selectedCaseType === 'all' || rec.typeOfCase === selectedCaseType;
    const matchesCustody = selectedCustody === 'all' || rec.custodyStatus === selectedCustody;
    const matchesStage = selectedStage === 'all' || rec.currentTrialStage === selectedStage;
    const effectiveStatus = rec.caseStatus || (rec.isDisposed ? 'Decided' : 'Ongoing');
    const matchesStatus = selectedStatus === 'all' || effectiveStatus === selectedStatus;

    return matchesSearch && matchesType && matchesCustody && matchesStage && matchesStatus;
  });

  const getDaysElapsed = (dateReceived: string, isDisposed: boolean, dateDisposed?: string) => {
    const start = new Date(dateReceived).getTime();
    const end = isDisposed && dateDisposed ? new Date(dateDisposed).getTime() : new Date().getTime();
    return Math.max(0, Math.floor((end - start) / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Table Title and Actions Header */}
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider">
            <span>Criminal Docket Registry</span>
            <span aria-hidden="true">·</span>
            <span>Continuous Trial Monitoring</span>
          </div>
          <h2 className="text-xl font-serif-court font-bold text-slate-900 mt-0.5">
            Accused Records & Trial Case Inventory
          </h2>
          <p className="text-xs text-slate-500">
            Total of {records.length} registered accused records under Branch jurisdiction
          </p>
        </div>

        <button
          onClick={onNewRecord}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow-sm transition-colors whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4 text-slate-950" />
          <span>Input New Accused</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by surname, firstname, alias, docket no..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Case Type Filter */}
          <select
            value={selectedCaseType}
            onChange={(e) => setSelectedCaseType(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-700 focus:outline-none"
          >
            <option value="all">All Case Types (10 Categories)</option>
            {CASE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Custody Filter */}
          <select
            value={selectedCustody}
            onChange={(e) => setSelectedCustody(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-700 focus:outline-none"
          >
            <option value="all">All Custody</option>
            <option value="In Detention">In Detention (Priority)</option>
            <option value="On Bail">On Bail</option>
            <option value="On Recognizance">On Recognizance</option>
          </select>

          {/* Case Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Case Statuses (5)</option>
            {CASE_STATUSES.map((status) => (
              <option key={status} value={status}>
                Status: {status}
              </option>
            ))}
          </select>

          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-700 focus:outline-none"
          >
            <option value="all">All Trial Stages</option>
            <option value="Arraignment">Arraignment</option>
            <option value="Pre-Trial">Pre-Trial</option>
            <option value="Prosecution Evidence">Prosecution Evidence</option>
            <option value="Defense Evidence">Defense Evidence</option>
            <option value="Rebuttal / Sur-rebuttal">Rebuttal</option>
            <option value="Submitted for Decision">Submitted for Decision</option>
            <option value="Promulgated / Disposed">Disposed / Promulgated</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      {filteredRecords.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-medium text-slate-700">No accused records match the search or filter criteria.</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting the filters or add a new accused entry.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Accused Name & Alias</th>
                <th className="py-3 px-3">Docket Number</th>
                <th className="py-3 px-3">Case Status</th>
                <th className="py-3 px-3">Age / DOB</th>
                <th className="py-3 px-3">Type of Case</th>
                <th className="py-3 px-3">Custody</th>
                <th className="py-3 px-4">Current Trial Stage</th>
                <th className="py-3 px-3 text-right">Elapsed Days</th>
                <th className="py-3 px-4">Next Hearing / Remarks</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.map((rec) => {
                const days = getDaysElapsed(rec.dateReceived, rec.isDisposed, rec.dateDisposed);
                const isOverdue = !rec.isDisposed && days > 180;
                const isApproaching = !rec.isDisposed && days > 120 && days <= 180;
                const effectiveStatus = rec.caseStatus || (rec.isDisposed ? 'Decided' : 'Ongoing');

                return (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    {/* Name & Alias */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 text-sm">
                        {rec.surname}, {rec.firstname} {rec.middleName || ''}
                      </div>
                      {rec.alias && rec.alias !== 'N/A' && (
                        <div className="text-[11px] text-slate-500 italic">
                          Alias: {rec.alias}
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {rec.address}
                      </div>
                    </td>

                    {/* Docket Number */}
                    <td className="py-3 px-3 font-mono-court font-semibold text-slate-800 whitespace-nowrap">
                      {rec.docketNumber}
                    </td>

                    {/* Case Status Tracking with interactive selector */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <CaseStatusBadge status={effectiveStatus} size="sm" />
                        {onUpdateStatus && (
                          <select
                            value={effectiveStatus}
                            onChange={(e) => onUpdateStatus(rec.id, e.target.value as CaseStatus)}
                            className="text-[10px] py-0.5 px-1 bg-slate-50 hover:bg-white border border-slate-200 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                            title="Update Case Status"
                          >
                            {CASE_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                Set: {status}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>

                    {/* Age / DOB */}
                    <td className="py-3 px-3 font-mono-court tabular-nums whitespace-nowrap">
                      <span className="font-medium text-slate-900">{rec.age} yrs</span>
                      <span className="block text-[10px] text-slate-400">{rec.dateOfBirth}</span>
                    </td>

                    {/* Type of Case */}
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900 block">
                        {rec.typeOfCase}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Recv: {rec.dateReceived}
                      </span>
                    </td>

                    {/* Custody */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {rec.custodyStatus === 'In Detention' ? (
                        <span className="text-red-700 font-semibold inline-flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Detained</span>
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>On Bail</span>
                        </span>
                      )}
                    </td>

                    {/* Current Stage with Quick Advancement */}
                    <td className="py-3 px-4">
                      <select
                        value={rec.currentTrialStage}
                        onChange={(e) => onUpdateStage(rec.id, e.target.value as TrialStage)}
                        className="text-xs py-1 px-2 font-medium bg-slate-50 hover:bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="Arraignment">Arraignment</option>
                        <option value="Pre-Trial">Pre-Trial</option>
                        <option value="Prosecution Evidence">Prosecution Evidence</option>
                        <option value="Defense Evidence">Defense Evidence</option>
                        <option value="Rebuttal / Sur-rebuttal">Rebuttal</option>
                        <option value="Submitted for Decision">Submitted for Decision</option>
                        <option value="Promulgated / Disposed">Disposed / Promulgated</option>
                      </select>
                      {rec.isDisposed && rec.dispositionOutcome && (
                        <span className="block text-[10px] font-semibold text-emerald-700 mt-0.5">
                          Outcome: {rec.dispositionOutcome}
                        </span>
                      )}
                    </td>

                    {/* Days Elapsed & Continuous Trial limit warning */}
                    <td className="py-3 px-3 text-right font-mono-court tabular-nums whitespace-nowrap">
                      <span
                        className={`font-semibold ${
                          isOverdue
                            ? 'text-red-700'
                            : isApproaching
                            ? 'text-amber-700'
                            : 'text-slate-700'
                        }`}
                      >
                        {days} d
                      </span>
                      {isOverdue && (
                        <span className="block text-[10px] text-red-600 font-medium">
                          Exceeds 180d
                        </span>
                      )}
                      {isApproaching && (
                        <span className="block text-[10px] text-amber-600 font-medium">
                          Limit near
                        </span>
                      )}
                    </td>

                    {/* Next Hearing / Remarks */}
                    <td className="py-3 px-4 max-w-xs">
                      {rec.nextHearingDate ? (
                        <div>
                          <span className="font-semibold text-slate-900 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            {rec.nextHearingDate}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {rec.nextHearingPurpose || 'Trial'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px] truncate block">
                          {rec.remarks || 'No notes'}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onViewRecord(rec)}
                          title="View Full Accused Dossier"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditRecord(rec)}
                          title="Edit Accused Information"
                          className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteRecord(rec.id)}
                          title="Delete Record"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
