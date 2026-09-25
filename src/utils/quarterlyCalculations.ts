import { AccusedRecord, CASE_TYPES, CaseType, QuarterNumber, QuarterlySummary } from '../types/trial';

export function getQuarterDateRange(year: number, quarter: QuarterNumber): { startDate: string; endDate: string; label: string } {
  switch (quarter) {
    case 1:
      return {
        startDate: `${year}-01-01`,
        endDate: `${year}-03-31`,
        label: `1st Quarter (January 1 - March 31, ${year})`,
      };
    case 2:
      return {
        startDate: `${year}-04-01`,
        endDate: `${year}-06-30`,
        label: `2nd Quarter (April 1 - June 30, ${year})`,
      };
    case 3:
      return {
        startDate: `${year}-07-01`,
        endDate: `${year}-09-30`,
        label: `3rd Quarter (July 1 - September 30, ${year})`,
      };
    case 4:
      return {
        startDate: `${year}-10-01`,
        endDate: `${year}-12-31`,
        label: `4th Quarter (October 1 - December 31, ${year})`,
      };
  }
}

export function getCurrentQuarter(): { year: number; quarter: QuarterNumber } {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  let quarter: QuarterNumber = 1;
  if (month >= 0 && month <= 2) quarter = 1;
  else if (month >= 3 && month <= 5) quarter = 2;
  else if (month >= 6 && month <= 8) quarter = 3;
  else quarter = 4;

  return {
    year: now.getFullYear(),
    quarter,
  };
}

export function calculateQuarterlySummary(
  records: AccusedRecord[],
  year: number,
  quarter: QuarterNumber
): QuarterlySummary {
  const { startDate, endDate, label } = getQuarterDateRange(year, quarter);

  // Filter records that were active or handled during this quarter
  const handledRecords = records.filter((rec) => {
    const received = rec.dateReceived;
    // Received during this quarter
    if (received >= startDate && received <= endDate) return true;
    // Received before quarter and either still pending or disposed during/after this quarter
    if (received < startDate) {
      if (!rec.isDisposed) return true;
      if (rec.dateDisposed && rec.dateDisposed >= startDate) return true;
    }
    return false;
  });

  const receivedInQuarter = records.filter(
    (rec) => rec.dateReceived >= startDate && rec.dateReceived <= endDate
  );

  const disposedInQuarter = records.filter(
    (rec) => rec.isDisposed && rec.dateDisposed && rec.dateDisposed >= startDate && rec.dateDisposed <= endDate
  );

  const inDetentionCount = handledRecords.filter(
    (rec) => rec.custodyStatus === 'In Detention' && (!rec.isDisposed || (rec.dateDisposed && rec.dateDisposed >= startDate))
  ).length;

  const onBailCount = handledRecords.filter(
    (rec) => rec.custodyStatus === 'On Bail' && (!rec.isDisposed || (rec.dateDisposed && rec.dateDisposed >= startDate))
  ).length;

  // Breakdown by the 10 exact case types
  const typeBreakdown = CASE_TYPES.map((type: CaseType) => {
    const typeRecords = records.filter((r) => r.typeOfCase === type);

    const pendingStart = typeRecords.filter(
      (r) => r.dateReceived < startDate && (!r.isDisposed || (r.dateDisposed && r.dateDisposed >= startDate))
    ).length;

    const received = typeRecords.filter(
      (r) => r.dateReceived >= startDate && r.dateReceived <= endDate
    ).length;

    const disposed = typeRecords.filter(
      (r) => r.isDisposed && r.dateDisposed && r.dateDisposed >= startDate && r.dateDisposed <= endDate
    ).length;

    const pendingEnd = Math.max(0, pendingStart + received - disposed);

    const activeInType = typeRecords.filter((r) => {
      if (r.dateReceived > endDate) return false;
      if (r.isDisposed && r.dateDisposed && r.dateDisposed < startDate) return false;
      return true;
    });

    const inDetention = activeInType.filter((r) => r.custodyStatus === 'In Detention').length;
    const onBail = activeInType.filter((r) => r.custodyStatus === 'On Bail').length;

    return {
      type,
      pendingStart,
      receivedInQuarter: received,
      disposedInQuarter: disposed,
      pendingEnd,
      inDetention,
      onBail,
    };
  });

  const totalHandled = handledRecords.length;
  const clearanceRate =
    totalHandled > 0 ? Math.round((disposedInQuarter.length / totalHandled) * 100) : 0;

  // Continuous trial compliance (benchmarked against 180 days statutory limit for trial completion)
  const compliantCount = handledRecords.filter((rec) => {
    const receivedDate = new Date(rec.dateReceived).getTime();
    const compareDate = rec.isDisposed && rec.dateDisposed
      ? new Date(rec.dateDisposed).getTime()
      : new Date(endDate).getTime();
    const diffDays = Math.floor((compareDate - receivedDate) / (1000 * 60 * 60 * 24));
    return diffDays <= 180;
  }).length;

  const continuousTrialComplianceRate =
    totalHandled > 0 ? Math.round((compliantCount / totalHandled) * 100) : 100;

  return {
    year,
    quarter,
    quarterLabel: label,
    startDate,
    endDate,
    totalReceived: receivedInQuarter.length,
    totalActive: Math.max(0, totalHandled - disposedInQuarter.length),
    totalDisposed: disposedInQuarter.length,
    inDetentionCount,
    onBailCount,
    clearanceRate,
    continuousTrialComplianceRate,
    typeBreakdown,
    recordsInQuarter: handledRecords,
  };
}

export function exportQuarterlyReportToCSV(summary: QuarterlySummary, courtBranch: string = "Branch 42"): void {
  const rows: string[][] = [];

  rows.push(["REPUBLIC OF THE PHILIPPINES", "SUPREME COURT OF THE PHILIPPINES"]);
  rows.push(["OFFICE OF THE COURT ADMINISTRATOR", "REGIONAL TRIAL COURT", courtBranch]);
  rows.push(["QUARTERLY CONTINUOUS TRIAL REPORT & CASELOAD INVENTORY"]);
  rows.push(["Reporting Period:", summary.quarterLabel]);
  rows.push(["Generated On:", new Date().toLocaleDateString('en-PH', { dateStyle: 'long' })]);
  rows.push([]);

  // KPI Summary
  rows.push(["EXECUTIVE TRIAL METRICS"]);
  rows.push(["Total Handled In Quarter", String(summary.recordsInQuarter.length)]);
  rows.push(["Newly Received Cases", String(summary.totalReceived)]);
  rows.push(["Active / Pending Trial", String(summary.totalActive)]);
  rows.push(["Disposed / Promulgated", String(summary.totalDisposed)]);
  rows.push(["Accused in Detention", String(summary.inDetentionCount)]);
  rows.push(["Accused on Bail", String(summary.onBailCount)]);
  rows.push(["Disposition Clearance Rate", `${summary.clearanceRate}%`]);
  rows.push(["Continuous Trial Compliance Rate", `${summary.continuousTrialComplianceRate}%`]);
  rows.push([]);

  // Case Type Breakdown
  rows.push(["CASELOAD BREAKDOWN BY CASE TYPE (MANDATED CATEGORIES)"]);
  rows.push([
    "Type of Case",
    "Pending (Beg. of Quarter)",
    "Received In Quarter",
    "Total Handled",
    "Disposed In Quarter",
    "Pending (End of Quarter)",
    "In Detention",
    "On Bail"
  ]);

  summary.typeBreakdown.forEach((item) => {
    rows.push([
      `"${item.type}"`,
      String(item.pendingStart),
      String(item.receivedInQuarter),
      String(item.pendingStart + item.receivedInQuarter),
      String(item.disposedInQuarter),
      String(item.pendingEnd),
      String(item.inDetention),
      String(item.onBail)
    ]);
  });

  rows.push([]);
  rows.push(["ACCUSED ROSTER & CONTINUOUS TRIAL AUDIT LOG"]);
  rows.push([
    "Docket Number",
    "Case Status",
    "Accused Full Name",
    "Alias",
    "Age",
    "Date of Birth",
    "Residential Address",
    "Type of Case",
    "Date Filed",
    "Date Received by Branch",
    "Custody Status",
    "Current Trial Stage",
    "Next Hearing Date",
    "Next Hearing Purpose",
    "Remarks"
  ]);

  summary.recordsInQuarter.forEach((rec) => {
    const fullName = `${rec.surname}, ${rec.firstname} ${rec.middleName || ''}`.trim();
    rows.push([
      `"${rec.docketNumber}"`,
      `"${rec.caseStatus || (rec.isDisposed ? 'Decided' : 'Ongoing')}"`,
      `"${fullName}"`,
      `"${rec.alias || 'N/A'}"`,
      String(rec.age),
      rec.dateOfBirth,
      `"${rec.address.replace(/"/g, '""')}"`,
      `"${rec.typeOfCase}"`,
      rec.dateFiled,
      rec.dateReceived,
      rec.custodyStatus,
      rec.currentTrialStage,
      rec.nextHearingDate || "—",
      `"${(rec.nextHearingPurpose || '—').replace(/"/g, '""')}"`,
      `"${(rec.remarks || '').replace(/"/g, '""')}"`
    ]);
  });

  rows.push([]);
  rows.push(["CERTIFICATION"]);
  rows.push(["I hereby certify that the foregoing quarterly docket report is a true and correct record of cases."]);
  rows.push(["Prepared by: Branch Clerk of Court", "Attested by: Presiding Judge"]);

  const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `RTC_Quarterly_Continuous_Trial_Report_Q${summary.quarter}_${summary.year}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
