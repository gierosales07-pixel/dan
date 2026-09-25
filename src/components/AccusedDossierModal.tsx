import React, { useState } from 'react';
import { AccusedRecord, TrialStage, DispositionOutcome, CASE_STATUSES, CaseStatus } from '../types/trial';
import { CaseStatusBadge } from './CaseStatusBadge';
import { 
  X, 
  Scale, 
  User, 
  MapPin, 
  Calendar, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Briefcase,
  AlertTriangle,
  Gavel,
  Activity
} from 'lucide-react';

interface AccusedDossierModalProps {
  record: AccusedRecord;
  onClose: () => void;
  onEdit: (record: AccusedRecord) => void;
  onUpdateRecord: (updated: AccusedRecord) => void;
}

export const AccusedDossierModal: React.FC<AccusedDossierModalProps> = ({
  record,
  onClose,
  onEdit,
  onUpdateRecord,
}) => {
  const [showDispositionBox, setShowDispositionBox] = useState(false);
  const [outcome, setOutcome] = useState<DispositionOutcome>('Convicted');
  const [dispositionNotes, setDispositionNotes] = useState('');

  const daysElapsed = Math.floor(
    (new Date().getTime() - new Date(record.dateReceived).getTime()) / (1000 * 60 * 60 * 24)
  );

  const stages: TrialStage[] = [
    'Arraignment',
    'Pre-Trial',
    'Prosecution Evidence',
    'Defense Evidence',
    'Rebuttal / Sur-rebuttal',
    'Submitted for Decision',
    'Promulgated / Disposed',
  ];

  const currentStageIndex = stages.indexOf(record.currentTrialStage);

  const handleStatusChange = (newStatus: CaseStatus) => {
    const isNowDisposed = newStatus === 'Decided' || record.isDisposed;
    onUpdateRecord({
      ...record,
      caseStatus: newStatus,
      isDisposed: isNowDisposed,
      currentTrialStage: newStatus === 'Decided' && !record.isDisposed ? 'Promulgated / Disposed' : record.currentTrialStage,
      dateDisposed: newStatus === 'Decided' ? (record.dateDisposed || new Date().toISOString().split('T')[0]) : record.dateDisposed,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleStageChange = (newStage: TrialStage) => {
    if (newStage === 'Promulgated / Disposed') {
      setShowDispositionBox(true);
    } else {
      onUpdateRecord({
        ...record,
        currentTrialStage: newStage,
        caseStatus: record.caseStatus === 'Decided' ? 'Ongoing' : record.caseStatus,
        isDisposed: false,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleConfirmDisposition = () => {
    const today = new Date().toISOString().split('T')[0];
    onUpdateRecord({
      ...record,
      caseStatus: 'Decided',
      currentTrialStage: 'Promulgated / Disposed',
      isDisposed: true,
      dateDisposed: today,
      dispositionOutcome: outcome,
      dispositionNotes: dispositionNotes.trim() || undefined,
      updatedAt: new Date().toISOString(),
    });
    setShowDispositionBox(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden border border-slate-200">
        {/* Modal Top Banner */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono-court text-amber-400 font-semibold tracking-wider uppercase block">
                  {record.docketNumber}
                </span>
                <CaseStatusBadge status={record.caseStatus || (record.isDisposed ? 'Decided' : 'Ongoing')} size="sm" />
              </div>
              <h2 className="text-base font-serif-court font-bold text-white tracking-wide">
                Case Dossier: {record.surname}, {record.firstname} {record.middleName || ''}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(record);
              }}
              className="text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-colors"
            >
              Edit Details
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Continuous Trial Status Alert */}
          <div className={`p-4 rounded-lg border flex items-start gap-3 ${
            record.isDisposed
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : daysElapsed > 180
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-amber-50/70 border-amber-200 text-amber-950'
          }`}>
            {record.isDisposed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : daysElapsed > 180 ? (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <span className="font-bold block text-sm">
                {record.isDisposed
                  ? `Case Disposed / Promulgated (${record.dispositionOutcome})`
                  : `Active Under Continuous Trial (${daysElapsed} days since branch intake)`}
              </span>
              <span className="text-slate-600 mt-0.5 block">
                {record.isDisposed
                  ? `Promulgated on ${record.dateDisposed || 'N/A'}. ${record.dispositionNotes || ''}`
                  : daysElapsed > 180
                  ? 'Exceeds the 180-day trial limit under SC Revised Guidelines on Continuous Trial. Branch clerk must audit trial calendar.'
                  : 'Case is progressing within statutory continuous trial time limits.'}
              </span>
            </div>
          </div>

          {/* Case Status Tracking Feature */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-600" />
                Case Status Tracking
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Current Status:</span>
                <CaseStatusBadge status={record.caseStatus || (record.isDisposed ? 'Decided' : 'Ongoing')} />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
              {CASE_STATUSES.map((status) => {
                const isSelected = (record.caseStatus || (record.isDisposed ? 'Decided' : 'Ongoing')) === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusChange(status)}
                    className={`px-3 py-2 rounded text-xs font-medium border text-center transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-xs font-semibold'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block">{status}</span>
                    <span className="text-[10px] opacity-75 font-normal block truncate">
                      {status === 'Pending' && 'Intake / Pre-call'}
                      {status === 'Ongoing' && 'Active Trial'}
                      {status === 'Adjourned' && 'Deferred / Set'}
                      {status === 'Decided' && 'Promulgated'}
                      {status === 'Archived' && 'In Archives'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Continuous Trial Stage Pipeline */}
          <div>
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
              Continuous Trial Milestones Progress
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1">
              {stages.map((stage, idx) => {
                const isPassed = currentStageIndex > idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <button
                    key={stage}
                    onClick={() => handleStageChange(stage)}
                    className={`p-2 rounded text-center transition-all text-[11px] font-medium border ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs'
                        : isPassed
                        ? 'bg-slate-100 text-slate-800 border-slate-300'
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="block text-[9px] uppercase tracking-wider opacity-75">
                      Stage {idx + 1}
                    </span>
                    <span className="truncate block mt-0.5">{stage}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Disposition Dialog (if selected Promulgated) */}
          {showDispositionBox && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <Gavel className="w-4 h-4 text-emerald-700" />
                Record Promulgation / Disposition of Judgment
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-emerald-900 mb-1">
                    Disposition Outcome
                  </label>
                  <select
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value as DispositionOutcome)}
                    className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded text-slate-900 font-medium"
                  >
                    <option value="Convicted">Convicted</option>
                    <option value="Acquitted">Acquitted</option>
                    <option value="Dismissed">Dismissed</option>
                    <option value="Provisionally Dismissed">Provisionally Dismissed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-emerald-900 mb-1">
                    Decision Notes / Sentence Summary
                  </label>
                  <input
                    type="text"
                    value={dispositionNotes}
                    onChange={(e) => setDispositionNotes(e.target.value)}
                    placeholder="e.g. Sentenced under Sec. 12, plea bargain"
                    className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded text-slate-900"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowDispositionBox(false)}
                  className="px-3 py-1 text-xs text-slate-600 bg-white border border-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDisposition}
                  className="px-4 py-1 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded"
                >
                  Confirm Promulgation
                </button>
              </div>
            </div>
          )}

          {/* 2-Column Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Accused Profile */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-200">
                <User className="w-4 h-4 text-amber-600" />
                <span>Accused Demographic Profile</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Full Legal Name:</span>
                  <span className="font-bold text-slate-900">
                    {record.surname}, {record.firstname} {record.middleName || ''}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Alias / Moniker:</span>
                  <span className="font-semibold text-slate-800">
                    {record.alias || 'None / N/A'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Age / Date of Birth:</span>
                  <span className="font-mono-court tabular-nums text-slate-900 font-semibold">
                    {record.age} years old ({record.dateOfBirth})
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-slate-500">Address:</span>
                  <span className="text-right text-slate-900 font-medium max-w-[200px]">
                    {record.address}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Custody Status:</span>
                  <span className={`font-bold flex items-center gap-1 ${
                    record.custodyStatus === 'In Detention' ? 'text-red-700' : 'text-emerald-700'
                  }`}>
                    {record.custodyStatus}
                  </span>
                </div>

                {record.detentionFacility && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Facility:</span>
                    <span className="text-slate-800 font-medium">{record.detentionFacility}</span>
                  </div>
                )}

                {record.bailAmount && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bail Posted:</span>
                    <span className="font-mono-court text-slate-800">
                      PHP {record.bailAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Case & Judicial Tracking */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-200">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Case Docket & Judicial Officers</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center pb-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Case Tracking Status:</span>
                  <CaseStatusBadge status={record.caseStatus || (record.isDisposed ? 'Decided' : 'Ongoing')} />
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Mandated Case Type:</span>
                  <span className="font-bold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded">
                    {record.typeOfCase}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Date Filed:</span>
                  <span className="font-mono-court text-slate-800">{record.dateFiled}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Date Received by Branch:</span>
                  <span className="font-mono-court text-slate-800 font-semibold">{record.dateReceived}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Presiding Judge:</span>
                  <span className="text-slate-900 font-medium">{record.presidingJudge}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Branch Clerk of Court:</span>
                  <span className="text-slate-900 font-medium">{record.branchClerk}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Public Prosecutor:</span>
                  <span className="text-slate-900 font-medium">{record.assignedProsecutor}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Defense Counsel:</span>
                  <span className="text-slate-900 font-medium">{record.defenseCounsel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Hearing & Remarks */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-2">
            <span className="font-bold uppercase tracking-wider text-slate-800 block">
              Hearing Schedule & Court Observations
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block">Next Continuous Trial Hearing Date:</span>
                <span className="font-semibold text-slate-900 text-sm font-mono-court">
                  {record.nextHearingDate || 'No hearing set'}
                </span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Purpose: {record.nextHearingPurpose || 'Regular trial schedule'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Trial Remarks & Submissions:</span>
                <p className="text-slate-800 italic mt-0.5">
                  "{record.remarks || 'No special remarks recorded.'}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-xs transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
