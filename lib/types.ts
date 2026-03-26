// Enums matching backend
export enum InstitutionType {
  DAR_TALIB = "DAR_TALIB",
  DAR_TALIBA = "DAR_TALIBA",
  DAR_TALIB_TALIBA = "DAR_TALIB_TALIBA",
}

export enum Milieu {
  URBAN = "URBAN",
  RURAL = "RURAL",
}

export enum LegalStatus {
  LICENSED = "LICENSED",
  UNLICENSED = "UNLICENSED",
}

export enum Distance {
  LESS_THAN_1KM = "LESS_THAN_1KM",
  FROM_1_TO_3KM = "FROM_1_TO_3KM",
  FROM_3_TO_5KM = "FROM_3_TO_5KM",
  MORE_THAN_5KM = "MORE_THAN_5KM",
}

export enum BuildingStatus {
  BUILT_FOR_PURPOSE = "BUILT_FOR_PURPOSE",
  RENTED = "RENTED",
  BORROWED = "BORROWED",
  MIXED = "MIXED",
}

export enum BuildingCondition {
  GOOD = "GOOD",
  AVERAGE = "AVERAGE",
  POOR = "POOR",
}

export enum RenovationCapacity {
  FULL = "FULL",
  PARTIAL = "PARTIAL",
  NONE = "NONE",
}

export enum OwnerType {
  STATE = "STATE",
  COMMUNE = "COMMUNE",
  ASSOCIATION = "ASSOCIATION",
  OTHER = "OTHER",
}

export enum SelectionBody {
  ASSOCIATION = "ASSOCIATION",
  COMMITTEE = "COMMITTEE",
}

export enum TariffType {
  UNIFORM = "UNIFORM",
  BRACKETED = "BRACKETED",
}

export enum TariffBracket {
  LESS_THAN_50 = "LESS_THAN_50",
  FROM_50_TO_100 = "FROM_50_TO_100",
  FROM_100_TO_150 = "FROM_100_TO_150",
  MORE_THAN_150 = "MORE_THAN_150",
}

export enum MealServiceType {
  OWN_KITCHEN = "OWN_KITCHEN",
  EXTERNAL_CATERER = "EXTERNAL_CATERER",
  MIXED = "MIXED",
}

export enum StaffType {
  DIRECTOR = "DIRECTOR",
  EDUCATOR = "EDUCATOR",
  SOCIAL_WORKER = "SOCIAL_WORKER",
  GUARD_NIGHT = "GUARD_NIGHT",
  GUARD_DAY = "GUARD_DAY",
  COOK = "COOK",
  COOK_HELPER = "COOK_HELPER",
  CLEANING_STAFF = "CLEANING_STAFF",
  DRIVER = "DRIVER",
  ACCOUNTANT = "ACCOUNTANT",
  SECRETARY = "SECRETARY",
  PSYCHOLOGIST = "PSYCHOLOGIST",
  OTHER = "OTHER",
}

// DTOs
export interface SeasonBeneficiaries {
  totalBeneficiaries?: number;
  maleBeneficiaries?: number;
  femaleBeneficiaries?: number;
  primaryBeneficiaries?: number;
  middleSchoolBeneficiaries?: number;
  highSchoolBeneficiaries?: number;
  orphans?: number;
  disabled?: number;
}

export interface BuildingDTO {
  buildingStatus?: BuildingStatus;
  buildingCondition?: BuildingCondition;
  renovationCapacity?: RenovationCapacity;
  ownerType?: OwnerType;
  hasPartnershipAgreement?: boolean;
}

export interface FinancingDTO {
  // Construction Funding Sources
  solidarityMinistry?: boolean;
  nationalEntraide?: boolean;
  indh?: boolean;
  commune?: boolean;
  fondationMohammed5?: boolean;
  nationalRevival?: boolean;
  association?: boolean;
  otherConstruction?: boolean;
  otherConstructionDetail?: string;

  // Equipment Funding Sources
  equipmentSolidarityMinistry?: boolean;
  equipmentNationalEntraide?: boolean;
  equipmentIndh?: boolean;
  equipmentCommune?: boolean;
  equipmentFondationMohammed5?: boolean;
  equipmentAssociation?: boolean;
  equipmentOther?: boolean;
  equipmentOtherDetail?: string;

  // Costs
  totalConstructionCost?: number;
  annualManagementCost?: number;

  // Operating Funding Sources
  operatingIndh?: boolean;
  operatingNationalEntraide?: boolean;
  operatingNationalEducation?: boolean;
  operatingCommune?: boolean;
  operatingParentContributions?: boolean;
  operatingDonors?: boolean;
  operatingAssociationOwnSources?: boolean;
  operatingOther?: boolean;

  // Additional Costs
  annualHRCost?: number;
  annualMealsCost?: number;
  totalMealsAmount?: number;

  // Shares (percentages)
  associationShare?: number;
  educationShare?: number;
  otherShare?: number;

  // Other Expenses
  annualOtherExpenses?: number;
  individualAnnualCost?: number;
}

export interface TargetingDTO {
  // Selection Criteria
  socialSituation?: boolean;
  distance?: boolean;
  schoolResults?: boolean;
  scholarship?: boolean;
  otherCriteria?: boolean;
  otherCriteriaDetail?: string;

  // Priorities
  priority1?: string;
  priority2?: string;
  priority3?: string;
  priority4?: string;
  priority5?: string;

  // Selection Body
  selectionBody?: SelectionBody;

  // Committee Members
  committeeAssociation?: boolean;
  committeeNationalEntraide?: boolean;
  committeeNationalEducation?: boolean;
  committeeCommune?: boolean;
  committeeLocalAuthorities?: boolean;
  otherMember?: boolean;
  otherMemberDetail?: string;

  // Additional Info
  unsatisfiedRequestsCount?: number;
  servicesAreFree?: boolean;
  tariffType?: TariffType;
  uniformAmount?: number;
  tariffBracket?: TariffBracket;
}

export interface HousingMealsDTO {
  season2324?: SeasonBeneficiaries;
  season2425?: SeasonBeneficiaries;
  season2526?: SeasonBeneficiaries;

  capacityRemarks?: string;
  totalMealBeneficiaries2526?: number;
  associationMealBeneficiaries?: number;
  educationMealBeneficiaries?: number;
  fullGrantCount?: number;
  halfGrantCount?: number;
  mealServiceType?: MealServiceType;

  // Improvement Suggestions
  increaseProducts?: boolean;
  externalCaterer?: boolean;
  otherSuggestion?: boolean;
  otherSuggestionDetail?: string;
}

export interface StaffMemberDTO {
  id?: number;
  staffType: StaffType;
  nbAssociation?: number;
  nbDeployed?: number;
  nbVolunteers?: number;
  nbCNSS?: number;
  nbSMIG?: number;
  monthlyCost?: number;
  annualCost?: number;
}

export interface InstitutionRequest {
  // Section 1: Institution Info
  institutionType: InstitutionType;
  associationName: string;
  institutionName: string;
  address?: string;
  region?: string;
  prefectureProvince?: string;
  commune?: string;
  milieu?: Milieu;
  creationYear?: number;
  legalStatus?: LegalStatus;
  unlicensedReason?: string;
  licenseNumber?: string;
  serviceStartDate?: string;

  // Services
  housing?: boolean;
  meals?: boolean;
  educationalSupport?: boolean;
  culturalActivities?: boolean;
  healthCare?: boolean;
  insurance?: boolean;
  psychologicalSupport?: boolean;

  // Capacity
  totalCapacity?: number;
  maleCapacity?: number;
  femaleCapacity?: number;

  // Target Levels
  primary?: boolean;
  middleSchool?: boolean;
  highSchool?: boolean;
  other?: boolean;
  otherDetail?: string;

  // Distance
  distanceToSchool?: Distance;
  distanceToNationalBoardingSchool?: Distance;

  // Nested sections
  building?: BuildingDTO;
  financing?: FinancingDTO;
  targeting?: TargetingDTO;
  housingMeals?: HousingMealsDTO;
  staffMembers?: StaffMemberDTO[];
}

export interface InstitutionResponse extends InstitutionRequest {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionSummary {
  id: number;
  institutionType: InstitutionType;
  institutionName: string;
  associationName: string;
  region?: string;
  commune?: string;
  totalCapacity?: number;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Form step type
export type FormStep =
  | "institution"
  | "building"
  | "financing"
  | "targeting"
  | "housing"
  | "staff"
  | "review";

// Arabic translations for enums
export const institutionTypeLabels: Record<InstitutionType, string> = {
  [InstitutionType.DAR_TALIB]: "دار الطالب",
  [InstitutionType.DAR_TALIBA]: "دار الطالبة",
  [InstitutionType.DAR_TALIB_TALIBA]: "دار الطالب والطالبة",
};

export const milieuLabels: Record<Milieu, string> = {
  [Milieu.URBAN]: "حضري",
  [Milieu.RURAL]: "قروي",
};

export const legalStatusLabels: Record<LegalStatus, string> = {
  [LegalStatus.LICENSED]: "مرخصة",
  [LegalStatus.UNLICENSED]: "غير مرخصة",
};

export const distanceLabels: Record<Distance, string> = {
  [Distance.LESS_THAN_1KM]: "أقل من 1 كم",
  [Distance.FROM_1_TO_3KM]: "من 1 إلى 3 كم",
  [Distance.FROM_3_TO_5KM]: "من 3 إلى 5 كم",
  [Distance.MORE_THAN_5KM]: "أكثر من 5 كم",
};

export const buildingStatusLabels: Record<BuildingStatus, string> = {
  [BuildingStatus.BUILT_FOR_PURPOSE]: "مبني للغرض",
  [BuildingStatus.RENTED]: "مكترى",
  [BuildingStatus.BORROWED]: "معار",
  [BuildingStatus.MIXED]: "مختلط",
};

export const buildingConditionLabels: Record<BuildingCondition, string> = {
  [BuildingCondition.GOOD]: "جيدة",
  [BuildingCondition.AVERAGE]: "متوسطة",
  [BuildingCondition.POOR]: "سيئة",
};

export const renovationCapacityLabels: Record<RenovationCapacity, string> = {
  [RenovationCapacity.FULL]: "كاملة",
  [RenovationCapacity.PARTIAL]: "جزئية",
  [RenovationCapacity.NONE]: "لا توجد",
};

export const ownerTypeLabels: Record<OwnerType, string> = {
  [OwnerType.STATE]: "الدولة",
  [OwnerType.COMMUNE]: "الجماعة",
  [OwnerType.ASSOCIATION]: "الجمعية",
  [OwnerType.OTHER]: "أخرى",
};

export const selectionBodyLabels: Record<SelectionBody, string> = {
  [SelectionBody.ASSOCIATION]: "الجمعية",
  [SelectionBody.COMMITTEE]: "لجنة",
};

export const tariffTypeLabels: Record<TariffType, string> = {
  [TariffType.UNIFORM]: "موحد",
  [TariffType.BRACKETED]: "حسب الشرائح",
};

export const tariffBracketLabels: Record<TariffBracket, string> = {
  [TariffBracket.LESS_THAN_50]: "أقل من 50 درهم",
  [TariffBracket.FROM_50_TO_100]: "من 50 إلى 100 درهم",
  [TariffBracket.FROM_100_TO_150]: "من 100 إلى 150 درهم",
  [TariffBracket.MORE_THAN_150]: "أكثر من 150 درهم",
};

export const mealServiceTypeLabels: Record<MealServiceType, string> = {
  [MealServiceType.OWN_KITCHEN]: "مطبخ خاص",
  [MealServiceType.EXTERNAL_CATERER]: "متعهد خارجي",
  [MealServiceType.MIXED]: "مختلط",
};

export const staffTypeLabels: Record<StaffType, string> = {
  [StaffType.DIRECTOR]: "مدير",
  [StaffType.EDUCATOR]: "مربي",
  [StaffType.SOCIAL_WORKER]: "مساعد اجتماعي",
  [StaffType.GUARD_NIGHT]: "حارس ليلي",
  [StaffType.GUARD_DAY]: "حارس نهاري",
  [StaffType.COOK]: "طباخ",
  [StaffType.COOK_HELPER]: "مساعد طباخ",
  [StaffType.CLEANING_STAFF]: "عامل نظافة",
  [StaffType.DRIVER]: "سائق",
  [StaffType.ACCOUNTANT]: "محاسب",
  [StaffType.SECRETARY]: "كاتب",
  [StaffType.PSYCHOLOGIST]: "أخصائي نفسي",
  [StaffType.OTHER]: "أخرى",
};
