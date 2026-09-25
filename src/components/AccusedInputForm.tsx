import React, { useState, useEffect } from 'react';
import { CASE_TYPES, CaseType, CASE_STATUSES, CaseStatus, CustodyStatus, TrialStage, AccusedRecord } from '../types/trial';
import { Scale, Check, AlertCircle, RefreshCw, Save, ArrowLeft, Calendar, User, FileText, MapPin, Activity } from 'lucide-react';

interface AccusedInputFormProps {
  initialRecord?: AccusedRecord | null;
  onSave: (record: AccusedRecord) => void;
  onCancel?: () => void;
}

export const AccusedInputForm: React.FC<AccusedInputFormProps> = ({
  initialRecord,
  onSave,
  onCancel,
}) => {
  // Required fields from user brief
  const [surname, setSurname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [alias, setAlias] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [typeOfCase, setTypeOfCase] = useState<CaseType>('RA 9165');
  const [dateFiled, setDateFiled] = useState('');
  const [dateReceived, setDateReceived] = useState('');

  // Auxiliary RTC court fields
  const [docketNumber, setDocketNumber] = useState('');
  const [caseStatus, setCaseStatus] = useState<CaseStatus>('Pending');
  const [custodyStatus, setCustodyStatus] = useState<CustodyStatus>('In Detention');
  const [detentionFacility, setDetentionFacility] = useState('City Jail Male Dormitory');
  const [bailAmount, setBailAmount] = useState<number | ''>('');
  const [currentTrialStage, setCurrentTrialStage] = useState<TrialStage>('Arraignment');
  const [presidingJudge, setPresidingJudge] = useState('Hon. Maria Victoria S. Alcantara');
  const [branchClerk, setBranchClerk] = useState('Atty. Renato P. Dimagiba');
  const [assignedProsecutor, setAssignedProsecutor] = useState('Pros. Eduardo M. Ramos');
  const [defenseCounsel, setDefenseCounsel] = useState('Atty. Patricia L. Gomez (PAO)');
  const [nextHearingDate, setNextHearingDate] = useState('');
  const [nextHearingPurpose, setNextHearingPurpose] = useState('Arraignment and Pre-Trial');
  const [remarks, setRemarks] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Initialize or populate if editing
  useEffect(() => {
    if (initialRecord) {
      setSurname(initialRecord.surname);
      setFirstname(initialRecord.firstname);
      setAlias(initialRecord.alias || '');
      setMiddleName(initialRecord.middleName || '');
      setAge(initialRecord.age);
      setDateOfBirth(initialRecord.dateOfBirth);
      setAddress(initialRecord.address);
      setTypeOfCase(initialRecord.typeOfCase);
      setDateFiled(initialRecord.dateFiled);
      setDateReceived(initialRecord.dateReceived);
      setDocketNumber(initialRecord.docketNumber);
      setCaseStatus(initialRecord.caseStatus || (initialRecord.isDisposed ? 'Decided' : 'Ongoing'));
      setCustodyStatus(initialRecord.custodyStatus);
      setDetentionFacility(initialRecord.detentionFacility || '');
      setBailAmount(initialRecord.bailAmount || '');
      setCurrentTrialStage(initialRecord.currentTrialStage);
      setPresidingJudge(initialRecord.presidingJudge);
      setBranchClerk(initialRecord.branchClerk);
      setAssignedProsecutor(initialRecord.assignedProsecutor);
      setDefenseCounsel(initialRecord.defenseCounsel);
      setNextHearingDate(initialRecord.nextHearingDate || '');
      setNextHearingPurpose(initialRecord.nextHearingPurpose || '');
      setRemarks(initialRecord.remarks || '');
    } else {
      // Set sensible defaults for a new case
      const today = new Date().toISOString().split('T')[0];
      setDateFiled(today);
      setDateReceived(today);
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setDocketNumber(`Crim. Case No. RTC-2026-${randomSuffix}`);
    }
  }, [initialRecord]);

  // Auto-calculate age from date of birth
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDateOfBirth(val);
    if (val) {
      const birth = new Date(val);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge >= 0 && calculatedAge < 120) {
        setAge(calculatedAge);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!surname.trim()) newErrors.surname = 'Surname is required.';
    if (!firstname.trim()) newErrors.firstname = 'Firstname is required.';
    if (!address.trim()) newErrors.address = 'Residential address is required.';
    if (!dateFiled) newErrors.dateFiled = 'Date filed is required.';
    if (!dateReceived) newErrors.dateReceived = 'Date received by branch is required.';
    if (age === '' || Number(age) < 1 || Number(age) > 120) {
      newErrors.age = 'Please enter a valid age (1-120).';
    }
    if (!dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required.';
    if (!docketNumber.trim()) newErrors.docketNumber = 'Docket / Criminal Case number is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const now = new Date().toISOString();
    const finalRecord: AccusedRecord = {
      id: initialRecord ? initialRecord.id : `case-${Date.now()}`,
      surname: surname.trim(),
      firstname: firstname.trim(),
      alias: alias.trim() || 'N/A',
      middleName: middleName.trim(),
      age: Number(age),
      dateOfBirth,
      address: address.trim(),
      typeOfCase,
      dateFiled,
      dateReceived,
      docketNumber: docketNumber.trim(),
      caseStatus,
      custodyStatus,
      detentionFacility: custodyStatus === 'In Detention' ? detentionFacility : undefined,
      bailAmount: custodyStatus === 'On Bail' && bailAmount ? Number(bailAmount) : undefined,
      currentTrialStage,
      presidingJudge: presidingJudge.trim(),
      branchClerk: branchClerk.trim(),
      assignedProsecutor: assignedProsecutor.trim(),
      defenseCounsel: defenseCounsel.trim(),
      nextHearingDate: nextHearingDate || undefined,
      nextHearingPurpose: nextHearingPurpose || undefined,
      remarks: remarks.trim() || undefined,
      isDisposed: currentTrialStage === 'Promulgated / Disposed',
      dateDisposed: currentTrialStage === 'Promulgated / Disposed' ? (initialRecord?.dateDisposed || dateReceived) : undefined,
      createdAt: initialRecord ? initialRecord.createdAt : now,
      updatedAt: now,
    };

    onSave(finalRecord);
    setIsSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmittedSuccess(false);
    }, 4000);

    if (!initialRecord) {
      // Clear personal fields for next record if fresh
      setSurname('');
      setFirstname('');
      setAlias('');
      setMiddleName('');
      setAge('');
      setDateOfBirth('');
      setAddress('');
      setRemarks('');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setDocketNumber(`Crim. Case No. RTC-2026-${randomSuffix}`);
    }
  };

  const handleReset = () => {
    setSurname('');
    setFirstname('');
    setAlias('');
    setMiddleName('');
    setAge('');
    setDateOfBirth('');
    setAddress('');
    setTypeOfCase('RA 9165');
    setCaseStatus('Pending');
    const today = new Date().toISOString().split('T')[0];
    setDateFiled(today);
    setDateReceived(today);
    setErrors({});
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-amber-400/20 text-amber-400 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-serif-court font-semibold text-white tracking-wide">
              {initialRecord ? 'Edit Accused & Case Record' : 'Continuous Trial Registry: Input Accused Information'}
            </h2>
            <p className="text-xs text-slate-400">
              Prescribed criminal case intake in accordance with SC A.M. No. 15-06-10-SC
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            type="button"
            className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        )}
      </div>

      {isSubmittedSuccess && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex items-center gap-3 text-emerald-800 text-sm">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Accused case docket <strong>{docketNumber || 'entry'}</strong> has been successfully saved to the continuous trial registry!
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Section 1: Accused Identity Information (Mandatory Brief Fields) */}
        <div>
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 mb-4">
            <User className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              1. Information of the Accused
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Surname */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Surname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="e.g. Dela Cruz"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                  errors.surname ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.surname && <p className="text-[11px] text-red-600 mt-1">{errors.surname}</p>}
            </div>

            {/* Firstname */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="e.g. Juan"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                  errors.firstname ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.firstname && <p className="text-[11px] text-red-600 mt-1">{errors.firstname}</p>}
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="e.g. Santos"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {/* Alias */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alias / Moniker
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="e.g. Johnny / Boyet"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={handleDobChange}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                  errors.dateOfBirth ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.dateOfBirth && <p className="text-[11px] text-red-600 mt-1">{errors.dateOfBirth}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age (Years) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Calculated or manual"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-md font-mono-court tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                  errors.age ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.age && <p className="text-[11px] text-red-600 mt-1">{errors.age}</p>}
            </div>

            {/* Residential Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Address of Accused <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House No., Street, Barangay, Municipality/City, Province"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                  errors.address ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.address && <p className="text-[11px] text-red-600 mt-1">{errors.address}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Case & Branch Details (With User's Mandated Dropdown) */}
        <div>
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 mb-4">
            <FileText className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              2. Case Information & Filing Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* TYPE OF CASE (User's Exact Mandated Options) */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Type of Case <span className="text-red-500">*</span>
              </label>
              <select
                value={typeOfCase}
                onChange={(e) => setTypeOfCase(e.target.value as CaseType)}
                className="w-full px-3 py-2 text-sm font-medium bg-amber-50/50 border border-amber-300 rounded-md text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CASE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Mandated category for quarterly reporting
              </p>
            </div>

            {/* Date Filed of the Case */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date Filed of the Case <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dateFiled}
                onChange={(e) => setDateFiled(e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                  errors.dateFiled ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.dateFiled && <p className="text-[11px] text-red-600 mt-1">{errors.dateFiled}</p>}
            </div>

            {/* Date of Received by the Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date Received by the Branch <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dateReceived}
                onChange={(e) => setDateReceived(e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                  errors.dateReceived ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.dateReceived && <p className="text-[11px] text-red-600 mt-1">{errors.dateReceived}</p>}
            </div>

            {/* Criminal Docket Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Criminal Case / Docket No. <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={docketNumber}
                onChange={(e) => setDocketNumber(e.target.value)}
                placeholder="e.g. Crim. Case No. RTC-2026-0450"
                className={`w-full px-3 py-2 text-sm font-mono-court bg-slate-50 border rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                  errors.docketNumber ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.docketNumber && <p className="text-[11px] text-red-600 mt-1">{errors.docketNumber}</p>}
            </div>

            {/* Case Status Tracking */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Case Status <span className="text-red-500">*</span>
              </label>
              <select
                value={caseStatus}
                onChange={(e) => {
                  const val = e.target.value as CaseStatus;
                  setCaseStatus(val);
                  if (val === 'Decided') {
                    setCurrentTrialStage('Promulgated / Disposed');
                  }
                }}
                className="w-full px-3 py-2 text-sm font-medium bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                {CASE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                {caseStatus === 'Pending' && 'Awaiting first calling, arraignment, or preliminary motion'}
                {caseStatus === 'Ongoing' && 'Active trial proceedings underway under continuous trial'}
                {caseStatus === 'Adjourned' && 'Hearing adjourned/deferred to a future calendar date'}
                {caseStatus === 'Decided' && 'Promulgated, judgment rendered, or case disposed'}
                {caseStatus === 'Archived' && 'Terminated case docket committed to branch archives'}
              </p>
            </div>

            {/* Custody / Detention Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custody / Detention Status
              </label>
              <select
                value={custodyStatus}
                onChange={(e) => setCustodyStatus(e.target.value as CustodyStatus)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="In Detention">In Detention (Jail Facility)</option>
                <option value="On Bail">On Bail (Provisional Liberty)</option>
                <option value="On Recognizance">On Recognizance</option>
              </select>
            </div>

            {/* Current Continuous Trial Stage */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Trial Stage (Continuous Trial)
              </label>
              <select
                value={currentTrialStage}
                onChange={(e) => setCurrentTrialStage(e.target.value as TrialStage)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-medium text-slate-800"
              >
                <option value="Arraignment">Arraignment</option>
                <option value="Pre-Trial">Pre-Trial</option>
                <option value="Prosecution Evidence">Prosecution Evidence</option>
                <option value="Defense Evidence">Defense Evidence</option>
                <option value="Rebuttal / Sur-rebuttal">Rebuttal / Sur-rebuttal</option>
                <option value="Submitted for Decision">Submitted for Decision</option>
                <option value="Promulgated / Disposed">Promulgated / Disposed</option>
              </select>
            </div>

            {/* Facility or Bail details */}
            {custodyStatus === 'In Detention' ? (
              <div className="lg:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detention Jail / Custodial Facility
                </label>
                <input
                  type="text"
                  value={detentionFacility}
                  onChange={(e) => setDetentionFacility(e.target.value)}
                  placeholder="e.g. City Jail Male / Female Dormitory"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none"
                />
              </div>
            ) : custodyStatus === 'On Bail' ? (
              <div className="lg:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bail Amount Posted (PHP)
                </label>
                <input
                  type="number"
                  value={bailAmount}
                  onChange={(e) => setBailAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 50000"
                  className="w-full px-3 py-2 text-sm font-mono-court bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none"
                />
              </div>
            ) : null}

            {/* Next Hearing Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Next Continuous Trial Hearing Date
              </label>
              <input
                type="date"
                value={nextHearingDate}
                onChange={(e) => setNextHearingDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none"
              />
            </div>

            {/* Next Hearing Purpose */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Next Hearing Purpose / Action
              </label>
              <input
                type="text"
                value={nextHearingPurpose}
                onChange={(e) => setNextHearingPurpose(e.target.value)}
                placeholder="e.g. Cross-examination of 1st prosecution witness"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Legal Officers & Remarks */}
        <div>
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 mb-4">
            <Calendar className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              3. Officers of the Court & Remarks
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Presiding Judge
              </label>
              <input
                type="text"
                value={presidingJudge}
                onChange={(e) => setPresidingJudge(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Branch Clerk of Court
              </label>
              <input
                type="text"
                value={branchClerk}
                onChange={(e) => setBranchClerk(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Public Prosecutor
              </label>
              <input
                type="text"
                value={assignedProsecutor}
                onChange={(e) => setAssignedProsecutor(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Defense Counsel / PAO
              </label>
              <input
                type="text"
                value={defenseCounsel}
                onChange={(e) => setDefenseCounsel(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Remarks / Continuous Trial Observations
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter judicial affidavits submitted, witness compliance, continuous trial order dates, or other docket notes..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors"
          >
            Clear Fields
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md shadow-sm transition-colors"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>{initialRecord ? 'Update Accused Record' : 'Save Accused to Registry'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
