/**
 * Mock regulatory submission data for RP360 Gap Tracker.
 * In production this would be fetched from the backend API.
 *
 * status values:
 *   "gap_detected"   – no valid clearance found in the registry
 *   "expiring_soon"  – clearance expires within 90 days
 *   "active"         – clearance is valid and not near expiry
 *   "reviewed"       – user manually confirmed clearance
 */

export const JURISDICTIONS = ["US-FDA", "EU-CE", "Health Canada", "PMDA", "TGA", "ANVISA"];

export const STATUS_ORDER = {
  gap_detected: 0,
  expiring_soon: 1,
  active: 2,
  reviewed: 3,
};

function iso(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

function ts(daysAgo, hoursAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

export const INITIAL_RECORDS = [
  // ── CardioSense Pro ──────────────────────────────────────────────────────
  {
    id: "rec-001",
    deviceName: "CardioSense Pro",
    jurisdiction: "US-FDA",
    status: "active",
    clearanceNumber: "K240123",
    expiryDate: iso(420),
    lastChecked: ts(0, 2),
    registryResponse: {
      source: "510(k) Database",
      deviceName: "CardioSense Pro ECG Monitor",
      applicant: "MedTech Solutions Inc.",
      decisionDate: "2023-11-15",
      productCode: "DXN",
      reviewPanel: "Cardiovascular",
    },
    matchMethod: "exact_number",
    registryUrl: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm",
    reviewNote: null,
    reviewedAt: null,
    reviewedBy: null,
    trendData: [2, 2, 2, 2, 2, 2, 2],
  },
  {
    id: "rec-002",
    deviceName: "CardioSense Pro",
    jurisdiction: "EU-CE",
    status: "gap_detected",
    clearanceNumber: null,
    expiryDate: null,
    lastChecked: ts(0, 1),
    registryResponse: {
      source: "EUDAMED",
      searchQuery: "CardioSense Pro",
      results: 0,
      message: "No matching device registration found.",
    },
    matchMethod: "name_match",
    registryUrl: "https://ec.europa.eu/tools/eudamed",
    reviewNote: null,
    reviewedAt: null,
    reviewedBy: null,
    trendData: [2, 2, 0, 0, 0, 0, 0],
  },
  {
    id: "rec-003",
    deviceName: "CardioSense Pro",
    jurisdiction: "Health Canada",
    status: "expiring_soon",
    clearanceNumber: "HC-MD-89234",
    expiryDate: iso(45),
    lastChecked: ts(1),
    registryResponse: {
      source: "Health Canada Medical Devices Database",
      licenceNumber: "HC-MD-89234",
      deviceName: "CardioSense Pro",
      licenceHolder: "MedTech Solutions Inc.",
      licenceStatus: "ACTIVE",
      expiryDate: iso(45),
    },
    matchMethod: "exact_number",
    registryUrl: "https://health-products.canada.ca/mdall-limh/start-debuter.do",
    reviewNote: null,
    reviewedAt: null,
    reviewedBy: null,
    trendData: [2, 2, 2, 2, 1, 1, 1],
  },

  // ── NeuroPatch X1 ────────────────────────────────────────────────────────
  {
    id: "rec-004",
    deviceName: "NeuroPatch X1",
    jurisdiction: "US-FDA",
    status: "gap_detected",
    clearanceNumber: null,
    expiryDate: null,
    lastChecked: ts(0, 3),
    registryResponse: {
      source: "510(k) Database",
      searchQuery: "NeuroPatch X1",
      results: 0,
      message: "No 510(k) clearance found. Device may require PMA.",
    },
    matchMethod: "name_match",
    registryUrl: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm",
    reviewNote: null,
    reviewedAt: null,
    reviewedBy: null,
    trendData: [2, 2, 0, 0, 0, 0, 0],
  },
  {
    id: "rec-005",
    deviceName: "NeuroPatch X1",
    jurisdiction: "EU-CE",
    status: "active",
    clearanceNumber: "CE-0123-MDR-2024",
    expiryDate: iso(300),
    lastChecked: ts(0, 1),
    registryResponse: {
      source: "EUDAMED",
      srn: "EU-MD-0000012345",
      deviceName: "NeuroPatch X1 Neural Interface",
      manufacturer: "NeuroDevice GmbH",
      classificationRule: "Rule 6",
      riskClass: "IIb",
      certificateNumber: "CE-0123-MDR-2024",
    },
    matchMethod: "exact_number",
    registryUrl: "https://ec.europa.eu/tools/eudamed",
    reviewNote: null,
    reviewedAt: null,
    reviewedBy: null,
    trendData: [2, 2, 2, 2, 2, 2, 2],
  },
  {
    id: "rec-006",
    deviceName: "NeuroPatch X1",
    jurisdiction: "PMDA",
    status: "expiring_soon",
    clearanceNumber: "PMDA-2021-00456",
    expiryDate: iso(62),
    lastChecked: ts(2),
    registryResponse: {
      source: "PMDA Medical Device Database",
      approvalNumber: "PMDA-2021-00456",
      deviceName: "NeuroPatch X1",
      approvalHolder: "NeuroDevice GmbH Japan Branch",
      approvalDate: "2021-03-18",
      expiryDate: iso(62),
    },
    matchMethod: "exact_number",
    registryUrl: "https://www.pmda.go.jp/english/review-services/reviews/0001.html",
    reviewNote: null,
    reviewedAt: null,
    reviewedBy: null,
    trendData: [2, 2, 2, 2, 1, 1, 1],
  },

  // ── OrthoAlign System ────────────────────────────────────────────────────
  {
    id: "rec-007",
    deviceName: "OrthoAlign System",
    jurisdiction: "US-FDA",
    status: "active",
    clearanceNumber: "K211567",
    expiryDate: iso(550),
    lastChecked: ts(0, 4),
    registryResponse: {
      source: "510(k) Database",
      deviceName: "OrthoAlign Surgical Navigation System",
      applicant: "OrthoTech Corp.",
      decisionDate: "2021-08-22",
      productCode: "IYO",
      reviewPanel: "Orthopedic",
    },
    matchMethod: "exact_number",
    registryUrl: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm",
    reviewNote: null,
    reviewedAt: null,
    reviewedBy: null,
    trendData: [2, 2, 2, 2, 2, 2, 2],
  },
  {
    id: "rec-008",
    deviceName: "OrthoAlign System",
    jurisdiction: "EU-CE",
    status: "gap_detected",
    clearanceNumber: null,
    expiryDate: null,
    lastChecked: ts(0, 2),
    registryResponse: {
      source: "EUDAMED",
      searchQuery: "OrthoAlign System",
      results: 1,
      partialMatch: "OrthoAlign Basic (discontinued)",
      message: "Full OrthoAlign System registration not found. Partial match is discontinued.",
    },
    matchMethod: "name_match",
    registryUrl: "https://ec.europa.eu/tools/eudamed",
    reviewNote: null,
    reviewedAt: null,
    reviewedBy: null,
    trendData: [2, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "rec-009",
    deviceName: "OrthoAlign System",
    jurisdiction: "TGA",
    status: "reviewed",
    clearanceNumber: "TGA-ARTG-234567",
    expiryDate: iso(190),
    lastChecked: ts(3),
    registryResponse: {
      source: "TGA ARTG Database",
      artgNumber: "234567",
      deviceName: "OrthoAlign Surgical Navigation System",
      sponsor: "OrthoTech Australia Pty Ltd",
      registrationDate: "2022-05-10",
      deviceClass: "Class IIb",
    },
    matchMethod: "exact_number",
    registryUrl: "https://www.tga.gov.au/resources/artg",
    reviewNote: "Clearance confirmed via vendor portal on 2026-05-20. Certificate on file.",
    reviewedAt: ts(6),
    reviewedBy: "J. Martinez",
    trendData: [2, 2, 2, 3, 3, 3, 3],
  },

  // ── PulmoTrack Lite ──────────────────────────────────────────────────────
  {
    id: "rec-010",
    deviceName: "PulmoTrack Lite",
    jurisdiction: "US-FDA",
    status: "expiring_soon",
    clearanceNumber: "K190234",
    expiryDate: iso(30),
    lastChecked: ts(0, 1),
    registryResponse: {
      source: "510(k) Database",
      deviceName: "PulmoTrack Lite Spirometry Device",
      applicant: "RespiCare Technologies",
      decisionDate: "2019-04-12",
      productCode: "BZG",
      reviewPanel: "Pulmonology",
      renewalRequired: true,
    },
    matchMethod: "exact_number",
    registryUrl: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm",
    reviewNote: null,
    reviewedAt: null,
    reviewedBy: null,
    trendData: [2, 2, 2, 1, 1, 1, 1],
  },
  {
    id: "rec-011",
    deviceName: "PulmoTrack Lite",
    jurisdiction: "ANVISA",
    status: "gap_detected",
    clearanceNumber: null,
    expiryDate: null,
    lastChecked: ts(1, 2),
    registryResponse: {
      source: "ANVISA Medical Device Registry",
      searchQuery: "PulmoTrack Lite",
      results: 0,
      message: "Product not registered in Brazil. ANVISA registration required before market entry.",
    },
    matchMethod: "name_match",
    registryUrl: "https://consultas.anvisa.gov.br/#/produtosRegulados",
    reviewNote: null,
    reviewedAt: null,
    reviewedBy: null,
    trendData: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "rec-012",
    deviceName: "PulmoTrack Lite",
    jurisdiction: "Health Canada",
    status: "active",
    clearanceNumber: "HC-MD-45678",
    expiryDate: iso(380),
    lastChecked: ts(0, 5),
    registryResponse: {
      source: "Health Canada Medical Devices Database",
      licenceNumber: "HC-MD-45678",
      deviceName: "PulmoTrack Lite",
      licenceHolder: "RespiCare Technologies Canada Inc.",
      licenceStatus: "ACTIVE",
    },
    matchMethod: "exact_number",
    registryUrl: "https://health-products.canada.ca/mdall-limh/start-debuter.do",
    reviewNote: null,
    reviewedAt: null,
    reviewedBy: null,
    trendData: [2, 2, 2, 2, 2, 2, 2],
  },

  // ── DiabetaWatch 3 ───────────────────────────────────────────────────────
  {
    id: "rec-013",
    deviceName: "DiabetaWatch 3",
    jurisdiction: "EU-CE",
    status: "active",
    clearanceNumber: "CE-0459-MDR-2023",
    expiryDate: iso(480),
    lastChecked: ts(0, 2),
    registryResponse: {
      source: "EUDAMED",
      srn: "EU-MD-0000098765",
      deviceName: "DiabetaWatch 3 Continuous Glucose Monitor",
      manufacturer: "GlucoTech AG",
      riskClass: "IIb",
      certificateNumber: "CE-0459-MDR-2023",
    },
    matchMethod: "exact_number",
    registryUrl: "https://ec.europa.eu/tools/eudamed",
    reviewNote: null,
    reviewedAt: null,
    reviewedBy: null,
    trendData: [2, 2, 2, 2, 2, 2, 2],
  },
  {
    id: "rec-014",
    deviceName: "DiabetaWatch 3",
    jurisdiction: "TGA",
    status: "gap_detected",
    clearanceNumber: null,
    expiryDate: null,
    lastChecked: ts(0, 3),
    registryResponse: {
      source: "TGA ARTG Database",
      searchQuery: "DiabetaWatch 3",
      results: 0,
      message: "Device not found in ARTG. Import and supply requires inclusion application.",
    },
    matchMethod: "name_match",
    registryUrl: "https://www.tga.gov.au/resources/artg",
    reviewNote: null,
    reviewedAt: null,
    reviewedBy: null,
    trendData: [2, 0, 0, 0, 0, 0, 0],
  },
];

/**
 * Computed summary stats from the current records array.
 */
export function computeStats(records) {
  const gaps = records.filter((r) => r.status === "gap_detected").length;
  const expiring = records.filter((r) => r.status === "expiring_soon").length;
  const active = records.filter((r) => r.status === "active").length;
  const reviewed = records.filter((r) => r.status === "reviewed").length;
  const total = records.length;
  return { gaps, expiring, active, reviewed, total };
}

/**
 * Sort records: gap_detected → expiring_soon → active → reviewed
 */
export function sortRecords(records) {
  return [...records].sort((a, b) => {
    const orderDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (orderDiff !== 0) return orderDiff;
    return a.deviceName.localeCompare(b.deviceName);
  });
}
