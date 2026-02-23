// jamaica-gov-fees - Jamaica government service fees database
// Data compiled: 2026-02-22

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * JMD-to-USD exchange rate used when the data was compiled.
 * For production use, fetch the current rate from the Bank of Jamaica (BOJ).
 */
export const EXCHANGE_RATE = 155.47;

/** ISO date string indicating when the fee data was last verified. */
export const DATA_DATE = "2026-02-22";

/** General Consumption Tax rate (15 %). */
export const GCT_RATE = 0.15;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AgencyId =
  | "pica"
  | "nira"
  | "taj"
  | "ita"
  | "coj"
  | "nla"
  | "nepa"
  | "police"
  | "trade_board"
  | "labour";

export interface Agency {
  id: AgencyId;
  name: string;
  acronym?: string;
}

export interface ServiceFee {
  agency: AgencyId;
  agencyName: string;
  service: string;
  description: string;
  jmd: number;
  note?: string;
}

export interface PassportFee {
  type: "standard" | "rush";
  days: number;
  jmd: number;
  office: "kingston" | "regional";
}

export interface VehicleFee {
  type: string;
  jmd: number;
}

// ---------------------------------------------------------------------------
// Embedded data
// ---------------------------------------------------------------------------

const AGENCIES: Record<AgencyId, { name: string; acronym?: string }> = {
  pica: { name: "Passport, Immigration and Citizenship Agency", acronym: "PICA" },
  nira: { name: "National Identification and Registration Authority", acronym: "NIRA" },
  taj: { name: "Tax Administration Jamaica", acronym: "TAJ" },
  ita: { name: "Island Traffic Authority", acronym: "ITA" },
  coj: { name: "Companies Office of Jamaica", acronym: "COJ" },
  nla: { name: "National Land Agency", acronym: "NLA" },
  nepa: { name: "National Environment and Planning Agency", acronym: "NEPA" },
  police: { name: "Jamaica Constabulary Force", acronym: "JCF" },
  trade_board: { name: "Trade Board Limited" },
  labour: { name: "Ministry of Labour and Social Security" },
};

// -- PICA passport fees (JMD) --

const PASSPORT_FEES: {
  adult_new: PassportFee[];
  adult_replacement: PassportFee[];
  minor_new: PassportFee[];
  minor_replacement: PassportFee[];
} = {
  adult_new: [
    { type: "standard", days: 7, jmd: 6500, office: "kingston" },
    { type: "rush", days: 3, jmd: 9500, office: "kingston" },
    { type: "rush", days: 1, jmd: 11500, office: "kingston" },
    { type: "rush", days: 0, jmd: 16500, office: "kingston" },
    { type: "standard", days: 7, jmd: 9500, office: "regional" },
    { type: "standard", days: 5, jmd: 11500, office: "regional" },
  ],
  adult_replacement: [
    { type: "standard", days: 7, jmd: 11500, office: "kingston" },
    { type: "rush", days: 3, jmd: 14500, office: "kingston" },
    { type: "rush", days: 1, jmd: 16500, office: "kingston" },
    { type: "rush", days: 0, jmd: 21500, office: "kingston" },
  ],
  minor_new: [
    { type: "standard", days: 7, jmd: 4000, office: "kingston" },
    { type: "rush", days: 3, jmd: 6000, office: "kingston" },
    { type: "rush", days: 1, jmd: 7000, office: "kingston" },
    { type: "rush", days: 0, jmd: 9000, office: "kingston" },
    { type: "standard", days: 7, jmd: 6000, office: "regional" },
    { type: "standard", days: 5, jmd: 7000, office: "regional" },
  ],
  minor_replacement: [
    { type: "standard", days: 7, jmd: 7000, office: "kingston" },
    { type: "rush", days: 3, jmd: 9000, office: "kingston" },
    { type: "rush", days: 1, jmd: 10000, office: "kingston" },
    { type: "rush", days: 0, jmd: 12000, office: "kingston" },
  ],
};

// -- NIRA vital-records fees (JMD) --

const VITAL_RECORD_FEES: Record<string, Record<string, number>> = {
  birth: { same_day: 7500, next_day: 6000 },
  death: { same_day: 7500, next_day: 6000 },
  marriage: { same_day: 7500, next_day: 6000 },
};

// -- TAJ vehicle registration (24-month, JMD) --

const VEHICLE_REGISTRATION_FEES: VehicleFee[] = [
  { type: "motor_car_up_to_1199cc", jmd: 18480 },
  { type: "motor_car_1200_2999cc", jmd: 25200 },
  { type: "motor_car_3000_3999cc", jmd: 57600 },
  { type: "motor_car_4000cc_plus", jmd: 87650 },
  { type: "electric_motor_car", jmd: 9240 },
  { type: "motorcycle_up_to_125cc", jmd: 3690 },
  { type: "motorcycle_126_500cc", jmd: 5580 },
  { type: "motorcycle_500cc_plus", jmd: 8550 },
];

// -- TAJ certificate-of-fitness fees (JMD) --

const FITNESS_FEES: Record<string, number> = {
  private_motor_vehicle: 4500,
  motorcycle: 4500,
  trailer_tractor: 5400,
  ppv_l_form: 3240,
  public_commercial: 5400,
};

// -- ITA driver's licence fees (JMD) --

const DRIVERS_LICENCE_FEES: Record<string, number> = {
  private: 5400,
  general: 7200,
  motorcycle: 4140,
};

// -- COJ business registration fees (JMD) --

const BUSINESS_REGISTRATION_FEES: Record<string, number> = {
  sole_trader: 2500,
  partnership_small: 2500,
  partnership_large: 5000,
  company: 27000,
};

// -- Police record fees (JMD) --

const POLICE_RECORD_FEES: Record<string, number> = {
  regular: 3000,
  express: 6000,
};

// ---------------------------------------------------------------------------
// Agency helpers
// ---------------------------------------------------------------------------

/**
 * Returns all government agencies in the database.
 */
export function getAgencies(): Agency[] {
  return (Object.entries(AGENCIES) as [AgencyId, { name: string; acronym?: string }][]).map(
    ([id, info]) => ({
      id,
      name: info.name,
      ...(info.acronym ? { acronym: info.acronym } : {}),
    }),
  );
}

/**
 * Look up a single agency by its short identifier.
 */
export function getAgency(id: string): Agency | undefined {
  const info = AGENCIES[id as AgencyId];
  if (!info) return undefined;
  return {
    id: id as AgencyId,
    name: info.name,
    ...(info.acronym ? { acronym: info.acronym } : {}),
  };
}

// ---------------------------------------------------------------------------
// Passport fees
// ---------------------------------------------------------------------------

const SPEED_TO_DAYS: Record<string, number> = {
  standard: 7,
  rush_3day: 3,
  rush_1day: 1,
  same_day: 0,
};

/**
 * Look up a passport fee by type, age category, processing speed, and office.
 *
 * @throws {Error} When no matching fee is found for the given options.
 */
export function getPassportFee(options: {
  type: "new" | "replacement";
  age: "adult" | "minor";
  speed: "standard" | "rush_3day" | "rush_1day" | "same_day";
  office?: "kingston" | "regional";
}): number {
  const { type, age, speed, office = "kingston" } = options;

  const key = `${age}_${type}` as keyof typeof PASSPORT_FEES;
  const list = PASSPORT_FEES[key];
  if (!list) {
    throw new Error(`Unknown passport category: ${age} ${type}`);
  }

  const days = SPEED_TO_DAYS[speed];
  if (days === undefined) {
    throw new Error(`Unknown speed: ${speed}`);
  }

  // For replacements, only kingston data exists in source
  const effectiveOffice = type === "replacement" ? "kingston" : office;

  const match = list.find((f) => f.days === days && f.office === effectiveOffice);
  if (!match) {
    throw new Error(
      `No passport fee found for ${age} ${type}, speed=${speed}, office=${effectiveOffice}`,
    );
  }
  return match.jmd;
}

// ---------------------------------------------------------------------------
// Vehicle fees
// ---------------------------------------------------------------------------

/**
 * Look up the 24-month vehicle registration fee by engine displacement in cc.
 *
 * @throws {Error} When no matching fee bracket is found.
 */
export function getVehicleRegistrationFee(engineCc: number): number {
  if (engineCc < 0) {
    throw new Error(`Invalid engine displacement: ${engineCc}cc (must be non-negative)`);
  }
  if (engineCc <= 1199) return 18480;
  if (engineCc <= 2999) return 25200;
  if (engineCc <= 3999) return 57600;
  return 87650;
}

/**
 * Look up the certificate-of-fitness inspection fee for a vehicle type.
 *
 * @throws {Error} When the vehicle type is not recognised.
 */
export function getCertificateOfFitnessFee(vehicleType: string): number {
  const fee = FITNESS_FEES[vehicleType];
  if (fee === undefined) {
    throw new Error(`Unknown vehicle type for fitness fee: ${vehicleType}`);
  }
  return fee;
}

// ---------------------------------------------------------------------------
// Driver's licence
// ---------------------------------------------------------------------------

/**
 * Look up the driver's licence fee by licence type.
 *
 * @throws {Error} When the licence type is not recognised.
 */
export function getDriversLicenceFee(type: "private" | "general" | "motorcycle"): number {
  const fee = DRIVERS_LICENCE_FEES[type];
  if (fee === undefined) {
    throw new Error(`Unknown licence type: ${type}`);
  }
  return fee;
}

// ---------------------------------------------------------------------------
// Business registration
// ---------------------------------------------------------------------------

/**
 * Look up the business registration fee by business type.
 *
 * @throws {Error} When the business type is not recognised.
 */
export function getBusinessRegistrationFee(
  type: "sole_trader" | "partnership_small" | "partnership_large" | "company",
): number {
  const fee = BUSINESS_REGISTRATION_FEES[type];
  if (fee === undefined) {
    throw new Error(`Unknown business type: ${type}`);
  }
  return fee;
}

// ---------------------------------------------------------------------------
// Vital records (birth / death / marriage certificates)
// ---------------------------------------------------------------------------

/**
 * Look up a vital-record certificate fee.
 *
 * @throws {Error} When the record type or speed is not recognised.
 */
export function getVitalRecordFee(
  type: "birth" | "death" | "marriage",
  speed: "same_day" | "next_day",
): number {
  const record = VITAL_RECORD_FEES[type];
  if (!record) {
    throw new Error(`Unknown vital record type: ${type}`);
  }
  const fee = record[speed];
  if (fee === undefined) {
    throw new Error(`Unknown speed for vital record: ${speed}`);
  }
  return fee;
}

// ---------------------------------------------------------------------------
// Police record
// ---------------------------------------------------------------------------

/**
 * Look up the police record (criminal background check) fee.
 *
 * @throws {Error} When the speed is not recognised.
 */
export function getPoliceRecordFee(speed: "regular" | "express"): number {
  const fee = POLICE_RECORD_FEES[speed];
  if (fee === undefined) {
    throw new Error(`Unknown police record speed: ${speed}`);
  }
  return fee;
}

// ---------------------------------------------------------------------------
// Search / list
// ---------------------------------------------------------------------------

/**
 * Build the complete flat list of all fees in the database.
 */
export function getAllFees(): ServiceFee[] {
  const fees: ServiceFee[] = [];

  // PICA - passports
  for (const [category, list] of Object.entries(PASSPORT_FEES)) {
    for (const item of list) {
      fees.push({
        agency: "pica",
        agencyName: AGENCIES.pica.name,
        service: `passport_${category}`,
        description: `Passport (${category.replace(/_/g, " ")}) - ${item.type} ${item.days}d - ${item.office}`,
        jmd: item.jmd,
      });
    }
  }

  // NIRA - vital records
  for (const [recordType, speeds] of Object.entries(VITAL_RECORD_FEES)) {
    for (const [speed, amount] of Object.entries(speeds)) {
      fees.push({
        agency: "nira",
        agencyName: AGENCIES.nira.name,
        service: `${recordType}_certificate`,
        description: `${recordType.charAt(0).toUpperCase() + recordType.slice(1)} certificate - ${speed.replace(/_/g, " ")}`,
        jmd: amount,
      });
    }
  }
  fees.push({
    agency: "nira",
    agencyName: AGENCIES.nira.name,
    service: "additional_copy",
    description: "Additional copy at time of application",
    jmd: 500,
    note: "at time of application",
  });

  // TAJ - TRN and TCC (free)
  fees.push({
    agency: "taj",
    agencyName: AGENCIES.taj.name,
    service: "trn_application",
    description: "TRN application",
    jmd: 0,
    note: "Free - online or in person",
  });
  fees.push({
    agency: "taj",
    agencyName: AGENCIES.taj.name,
    service: "tcc",
    description: "Tax Compliance Certificate",
    jmd: 0,
    note: "Free - available online via eServices",
  });

  // TAJ - vehicle registration
  for (const vf of VEHICLE_REGISTRATION_FEES) {
    fees.push({
      agency: "taj",
      agencyName: AGENCIES.taj.name,
      service: "vehicle_registration_24mo",
      description: `Vehicle registration 24 months - ${vf.type.replace(/_/g, " ")}`,
      jmd: vf.jmd,
    });
  }

  // TAJ - certificate of fitness
  for (const [vtype, amount] of Object.entries(FITNESS_FEES)) {
    fees.push({
      agency: "taj",
      agencyName: AGENCIES.taj.name,
      service: "certificate_of_fitness",
      description: `Certificate of fitness - ${vtype.replace(/_/g, " ")}`,
      jmd: amount,
    });
  }

  // TAJ - property transfer
  fees.push({
    agency: "taj",
    agencyName: AGENCIES.taj.name,
    service: "property_transfer_stamp_duty",
    description: "Property transfer stamp duty",
    jmd: 5000,
  });

  // ITA - driver's licence
  fees.push({
    agency: "ita",
    agencyName: AGENCIES.ita.name,
    service: "learners_permit_1yr",
    description: "Learner's permit (1 year)",
    jmd: 1800,
  });
  fees.push({
    agency: "ita",
    agencyName: AGENCIES.ita.name,
    service: "drivers_licence_exam",
    description: "Driver's licence examination",
    jmd: 3240,
  });
  for (const [ltype, amount] of Object.entries(DRIVERS_LICENCE_FEES)) {
    fees.push({
      agency: "ita",
      agencyName: AGENCIES.ita.name,
      service: `${ltype}_drivers_licence`,
      description: `Driver's licence - ${ltype}`,
      jmd: amount,
    });
  }
  fees.push({
    agency: "ita",
    agencyName: AGENCIES.ita.name,
    service: "road_code_test",
    description: "Road code test",
    jmd: 0,
    note: "Free",
  });

  // COJ - business registration
  fees.push({
    agency: "coj",
    agencyName: AGENCIES.coj.name,
    service: "name_search",
    description: "Business name search",
    jmd: 500,
  });
  fees.push({
    agency: "coj",
    agencyName: AGENCIES.coj.name,
    service: "name_reservation",
    description: "Business name reservation",
    jmd: 3000,
  });
  fees.push({
    agency: "coj",
    agencyName: AGENCIES.coj.name,
    service: "sole_trader_registration",
    description: "Sole trader registration",
    jmd: 2500,
  });
  fees.push({
    agency: "coj",
    agencyName: AGENCIES.coj.name,
    service: "partnership_2_5",
    description: "Partnership registration (2-5 partners)",
    jmd: 2500,
  });
  fees.push({
    agency: "coj",
    agencyName: AGENCIES.coj.name,
    service: "partnership_6_20",
    description: "Partnership registration (6-20 partners)",
    jmd: 5000,
  });
  fees.push({
    agency: "coj",
    agencyName: AGENCIES.coj.name,
    service: "trade_name_corporation",
    description: "Trade name registration for corporation",
    jmd: 3000,
  });
  fees.push({
    agency: "coj",
    agencyName: AGENCIES.coj.name,
    service: "company_incorporation",
    description: "Company incorporation",
    jmd: 27000,
  });
  fees.push({
    agency: "coj",
    agencyName: AGENCIES.coj.name,
    service: "stamping",
    description: "Stamping fee (minimum)",
    jmd: 500,
    note: "minimum",
  });

  // NLA
  fees.push({
    agency: "nla",
    agencyName: AGENCIES.nla.name,
    service: "title_search_basic",
    description: "Basic title search",
    jmd: 0,
    note: "Free online",
  });
  fees.push({
    agency: "nla",
    agencyName: AGENCIES.nla.name,
    service: "note_change_name",
    description: "Note change of name on title",
    jmd: 100,
  });
  fees.push({
    agency: "nla",
    agencyName: AGENCIES.nla.name,
    service: "name_amendment_on_title",
    description: "Name amendment on title (minimum)",
    jmd: 500,
    note: "minimum",
  });

  // NEPA
  fees.push({
    agency: "nepa",
    agencyName: AGENCIES.nepa.name,
    service: "application_fee",
    description: "NEPA application fee",
    jmd: 2000,
    note: "non-refundable",
  });
  fees.push({
    agency: "nepa",
    agencyName: AGENCIES.nepa.name,
    service: "environmental_permit",
    description: "Environmental permit (typical range J$15,000-25,000)",
    jmd: 15000,
    note: "lower end of range; upper end is J$25,000",
  });
  fees.push({
    agency: "nepa",
    agencyName: AGENCIES.nepa.name,
    service: "environmental_licence",
    description: "Environmental licence",
    jmd: 7500,
  });

  // Police
  for (const [speed, amount] of Object.entries(POLICE_RECORD_FEES)) {
    fees.push({
      agency: "police",
      agencyName: AGENCIES.police.name,
      service: `police_record_${speed}`,
      description: `Police record - ${speed}`,
      jmd: amount,
    });
  }
  fees.push({
    agency: "police",
    agencyName: AGENCIES.police.name,
    service: "fingerprinting_overseas",
    description: "Fingerprinting for overseas use",
    jmd: 1500,
  });
  fees.push({
    agency: "police",
    agencyName: AGENCIES.police.name,
    service: "accident_report",
    description: "Accident report",
    jmd: 3000,
  });

  // Trade Board
  fees.push({
    agency: "trade_board",
    agencyName: AGENCIES.trade_board.name,
    service: "motor_vehicle_import_permit",
    description: "Motor vehicle import permit",
    jmd: 6325,
  });
  fees.push({
    agency: "trade_board",
    agencyName: AGENCIES.trade_board.name,
    service: "amendment_fee",
    description: "Import permit amendment fee",
    jmd: 2875.5,
  });
  fees.push({
    agency: "trade_board",
    agencyName: AGENCIES.trade_board.name,
    service: "permit_printout",
    description: "Permit printout",
    jmd: 1150,
  });

  // Labour
  fees.push({
    agency: "labour",
    agencyName: AGENCIES.labour.name,
    service: "work_permit_processing",
    description: "Work permit processing fee",
    jmd: 17250,
    note: "non-refundable",
  });
  fees.push({
    agency: "labour",
    agencyName: AGENCIES.labour.name,
    service: "work_permit_quarterly",
    description: "Work permit quarterly fee",
    jmd: 48875,
  });
  fees.push({
    agency: "labour",
    agencyName: AGENCIES.labour.name,
    service: "work_permit_annual",
    description: "Work permit annual fee",
    jmd: 195500,
  });

  return fees;
}

/**
 * Full-text search across all fees. Case-insensitive. Matches against
 * service name, description, agency name, and agency ID.
 */
export function searchFees(query: string): ServiceFee[] {
  const q = query.toLowerCase();
  return getAllFees().filter((fee) => {
    const haystack = [
      fee.agency,
      fee.agencyName,
      fee.service,
      fee.description,
      fee.note ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
