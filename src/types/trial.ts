export const CASE_TYPES = [
  "Rape",
  "Estafa",
  "RA 10591",
  "RA 9165",
  "CARNAPPING",
  "KIDNAPPING",
  "RA 9208",
  "ILLEGAL RECRUITMENT",
  "GRAFT AND CORRUPTION",
  "All other regular court cases",
] as const;

export type CaseType = typeof CASE_TYPES[number];

export const CASE_STATUSES = [
  "Pending",
  "Ongoing",
  "Adjourned",
  "Decided",
  "Archived",
] as const;

export type CaseStatus = typeof CASE_STATUSES[number];

export type CustodyStatus = "In Detention" | "On Bail" | "On Recognizance";

export type TrialStage =
  | "Arraignment"
  | "Pre-Trial"
  | "Prosecution Evidence"
  | "Defense Evidence"
  | "Rebuttal / Sur-rebuttal"
  | "Submitted for Decision"
  | "Promulgated / Disposed";

export type DispositionOutcome =
  | "Convicted"
  | "Acquitted"
  | "Dismissed"
  | "Provisionally Dismissed";

export interface AccusedRecord {
  id: string;
  // Accused Information (User's Required Fields)
  surname: string;
  firstname: string;
  alias: string;
  middleName: string;
  age: number;
  dateOfBirth: string; // YYYY-MM-DD
  address: string;
  typeOfCase: CaseType;
  dateFiled: string; // YYYY-MM-DD
  dateReceived: string; // YYYY-MM-DD

  // RTC Docket & Monitoring Details
  docketNumber: string; // e.g., Crim. Case No. RTC-2026-1042
  caseStatus: CaseStatus; // 'Pending' | 'Ongoing' | 'Adjourned' | 'Decided' | 'Archived'
  custodyStatus: CustodyStatus;
  currentTrialStage: TrialStage;
  detentionFacility?: string;
  bailAmount?: number;
  presidingJudge: string;
  branchClerk: string;
  assignedProsecutor: string;
  defenseCounsel: string;
  nextHearingDate?: string;
  nextHearingPurpose?: string;
  remarks?: string;

  // Disposition metadata if promulgated
  isDisposed: boolean;
  dateDisposed?: string;
  dispositionOutcome?: DispositionOutcome;
  dispositionNotes?: string;

  // Audit timestamps
  createdAt: string;
  updatedAt: string;
}

export type QuarterNumber = 1 | 2 | 3 | 4;

export interface QuarterlySummary {
  year: number;
  quarter: QuarterNumber;
  quarterLabel: string;
  startDate: string;
  endDate: string;
  totalReceived: number;
  totalActive: number;
  totalDisposed: number;
  inDetentionCount: number;
  onBailCount: number;
  clearanceRate: number; // Disposed / (Received + Pending Beginning)
  continuousTrialComplianceRate: number; // % compliant with statutory timeframe
  typeBreakdown: {
    type: CaseType;
    pendingStart: number;
    receivedInQuarter: number;
    disposedInQuarter: number;
    pendingEnd: number;
    inDetention: number;
    onBail: number;
  }[];
  recordsInQuarter: AccusedRecord[];
}
