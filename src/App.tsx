import React, { useState, useEffect } from 'react';
import { AccusedRecord, CaseStatus, QuarterNumber, TrialStage } from './types/trial';
import { INITIAL_ACCUSED_CASES } from './data/initialCases';
import { CourtHeader } from './components/CourtHeader';
import { CourtGreetingIntro } from './components/CourtGreetingIntro';
import { AccusedInputForm } from './components/AccusedInputForm';
import { AccusedRegistryTable } from './components/AccusedRegistryTable';
import { QuarterlyReportView } from './components/QuarterlyReportView';
import { PrintableQuarterlyReport } from './components/PrintableQuarterlyReport';
import { AccusedDossierModal } from './components/AccusedDossierModal';
import { ContinuousTrialGuidelines } from './components/ContinuousTrialGuidelines';
import { RotateCcw, Download, CheckCircle, Scale } from 'lucide-react';

const STORAGE_KEY = 'rtc_continuous_trial_records_v1';

export default function App() {
  const [records, setRecords] = useState<AccusedRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((r: AccusedRecord) => ({
            ...r,
            caseStatus: r.caseStatus || (r.isDisposed ? 'Decided' : 'Ongoing'),
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load records from storage', e);
    }
    return INITIAL_ACCUSED_CASES;
  });

  const [currentTab, setCurrentTab] = useState<'overview' | 'input' | 'registry' | 'quarterly' | 'guidelines'>('overview');
  const [registryStatusFilter, setRegistryStatusFilter] = useState<string>('all');
  const [selectedRecordForDossier, setSelectedRecordForDossier] = useState<AccusedRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<AccusedRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Printable report state
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [printQuarter, setPrintQuarter] = useState<QuarterNumber>(3);
  const [printYear, setPrintYear] = useState<number>(new Date().getFullYear());

  // Save to localStorage whenever records change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [records]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSaveRecord = (record: AccusedRecord) => {
    setRecords((prev) => {
      const exists = prev.some((r) => r.id === record.id);
      if (exists) {
        return prev.map((r) => (r.id === record.id ? record : r));
      } else {
        return [record, ...prev];
      }
    });

    if (editingRecord) {
      showToast(`Record for accused ${record.surname}, ${record.firstname} has been updated.`);
      setEditingRecord(null);
      setCurrentTab('registry');
    } else {
      showToast(`Accused ${record.surname}, ${record.firstname} (${record.docketNumber}) saved to docket registry.`);
    }
  };

  const handleDeleteRecord = (id: string) => {
    const rec = records.find((r) => r.id === id);
    if (!rec) return;

    const confirmed = window.confirm(
      `Are you sure you want to remove the docket entry for ${rec.surname}, ${rec.firstname} (${rec.docketNumber}) from this Branch's registry?`
    );

    if (confirmed) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      if (selectedRecordForDossier?.id === id) {
        setSelectedRecordForDossier(null);
      }
      showToast(`Docket entry ${rec.docketNumber} removed from registry.`);
    }
  };

  const handleUpdateStage = (id: string, newStage: TrialStage) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const isDisposed = newStage === 'Promulgated / Disposed';
          return {
            ...r,
            currentTrialStage: newStage,
            caseStatus: isDisposed ? 'Decided' : r.caseStatus,
            isDisposed,
            dateDisposed: isDisposed ? (r.dateDisposed || new Date().toISOString().split('T')[0]) : undefined,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );
    showToast(`Trial stage updated to "${newStage}".`);
  };

  const handleUpdateStatus = (id: string, newStatus: CaseStatus) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const isDisposed = newStatus === 'Decided' || r.isDisposed;
          return {
            ...r,
            caseStatus: newStatus,
            isDisposed,
            currentTrialStage: newStatus === 'Decided' && !r.isDisposed ? 'Promulgated / Disposed' : r.currentTrialStage,
            dateDisposed: newStatus === 'Decided' ? (r.dateDisposed || new Date().toISOString().split('T')[0]) : r.dateDisposed,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );
    showToast(`Case status updated to "${newStatus}".`);
  };

  const handleResetToDefault = () => {
    const confirmed = window.confirm(
      'Reset continuous trial records to the default official sample caseload (covers all 10 mandated case types across 2026 quarters)?'
    );
    if (confirmed) {
      setRecords(INITIAL_ACCUSED_CASES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ACCUSED_CASES));
      showToast('Registry restored to default court sample dataset.');
    }
  };

  const handleOpenPrint = (quarter: QuarterNumber, year: number) => {
    setPrintQuarter(quarter);
    setPrintYear(year);
    setIsPrintMode(true);
  };

  if (isPrintMode) {
    return (
      <PrintableQuarterlyReport
        records={records}
        quarter={printQuarter}
        year={printYear}
        onClose={() => setIsPrintMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      <CourtHeader
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenQuickInput={() => {
          setEditingRecord(null);
          setCurrentTab('input');
        }}
      />

      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg border border-slate-700 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1">
        {/* TAB 1: OVERVIEW (Greetings Introduction followed by Accused Input and Quick Docket) */}
        {currentTab === 'overview' && (
          <div className="space-y-8 pb-16">
            {/* The Introduction: Greetings, Mission Statement, and Key Stats */}
            <CourtGreetingIntro
              records={records}
              onNavigateToInput={() => {
                setEditingRecord(null);
                setCurrentTab('input');
              }}
              onNavigateToQuarterly={() => setCurrentTab('quarterly')}
              onNavigateToRegistry={(statusFilter) => {
                setRegistryStatusFilter(statusFilter || 'all');
                setCurrentTab('registry');
              }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              {/* Accused Input Section directly following the Introduction */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-serif-court font-bold text-slate-900">
                      Court Intake: Accused Information Registry
                    </h2>
                    <p className="text-xs text-slate-500">
                      Direct intake form for new accused demographic profiles and court branch filing
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('registry')}
                    className="text-xs font-medium text-amber-700 hover:text-amber-800 underline"
                  >
                    View All {records.length} Accused Records &rarr;
                  </button>
                </div>

                <AccusedInputForm
                  onSave={handleSaveRecord}
                />
              </div>

              {/* Recent Accused Docket Preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-serif-court font-bold text-slate-900">
                      Recent Accused Case Dockets
                    </h2>
                    <p className="text-xs text-slate-500">
                      Active cases under Continuous Trial monitoring in this Branch
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('registry')}
                    className="text-xs font-semibold px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded transition-colors"
                  >
                    Open Full Registry
                  </button>
                </div>

                <AccusedRegistryTable
                  records={records.slice(0, 5)}
                  onViewRecord={(r) => setSelectedRecordForDossier(r)}
                  onEditRecord={(r) => {
                    setEditingRecord(r);
                    setCurrentTab('input');
                  }}
                  onDeleteRecord={handleDeleteRecord}
                  onNewRecord={() => {
                    setEditingRecord(null);
                    setCurrentTab('input');
                  }}
                  onUpdateStage={handleUpdateStage}
                  onUpdateStatus={handleUpdateStatus}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INPUT ACCUSED RECORD */}
        {currentTab === 'input' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <AccusedInputForm
              initialRecord={editingRecord}
              onSave={handleSaveRecord}
              onCancel={() => {
                setEditingRecord(null);
                setCurrentTab('registry');
              }}
            />
          </div>
        )}

        {/* TAB 3: ACCUSED REGISTRY TABLE */}
        {currentTab === 'registry' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <AccusedRegistryTable
              records={records}
              onViewRecord={(r) => setSelectedRecordForDossier(r)}
              onEditRecord={(r) => {
                setEditingRecord(r);
                setCurrentTab('input');
              }}
              onDeleteRecord={handleDeleteRecord}
              onNewRecord={() => {
                setEditingRecord(null);
                setCurrentTab('input');
              }}
              onUpdateStage={handleUpdateStage}
              onUpdateStatus={handleUpdateStatus}
              initialStatusFilter={registryStatusFilter}
            />
          </div>
        )}

        {/* TAB 4: QUARTERLY REPORT GENERATOR */}
        {currentTab === 'quarterly' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <QuarterlyReportView
              records={records}
              onViewRecord={(r) => setSelectedRecordForDossier(r)}
              onPrintReport={handleOpenPrint}
            />
          </div>
        )}

        {/* TAB 5: CONTINUOUS TRIAL GUIDELINES */}
        {currentTab === 'guidelines' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <ContinuousTrialGuidelines />
          </div>
        )}
      </main>

      {/* Accused Full Dossier Modal */}
      {selectedRecordForDossier && (
        <AccusedDossierModal
          record={selectedRecordForDossier}
          onClose={() => setSelectedRecordForDossier(null)}
          onEdit={(r) => {
            setSelectedRecordForDossier(null);
            setEditingRecord(r);
            setCurrentTab('input');
          }}
          onUpdateRecord={(updated) => {
            handleSaveRecord(updated);
            setSelectedRecordForDossier(updated);
          }}
        />
      )}

      {/* Official Court System Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="font-serif-court font-medium text-slate-300">
              Regional Trial Court · Continuous Trial Monitoring System (CTMS)
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Supreme Court A.M. No. 15-06-10-SC</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={handleResetToDefault}
              className="text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
              title="Reset sample cases"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Sample Docket</span>
            </button>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <span>Branch Clerk of Court Registry</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
