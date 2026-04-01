// Enums matching backend EXACTLY
export enum InstitutionType {
  DAR_TALIB = "DAR_TALIB",
  DAR_TALIBA = "DAR_TALIBA",
  DAR_TALIB_TALIBA = "DAR_TALIB_TALIBA",
}

export enum Milieu {
  URBAIN = "URBAIN",
  RURAL = "RURAL",
}

export enum LegalStatus {
  LICENSED = "LICENSED",
  UNLICENSED = "UNLICENSED",
}

// Backend: INSIDE, LT_1KM, BETWEEN_1_5KM, GT_5KM
export enum Distance {
  INSIDE = "INSIDE",
  LT_1KM = "LT_1KM",
  BETWEEN_1_5KM = "BETWEEN_1_5KM",
  GT_5KM = "GT_5KM",
}

// Backend: RENTAL, OWNED, AT_DISPOSAL, OTHER
export enum BuildingStatus {
  RENTAL = "RENTAL",
  OWNED = "OWNED",
  AT_DISPOSAL = "AT_DISPOSAL",
  OTHER = "OTHER",
}

// Backend: GOOD, SOME_DEGRADATION, BAD, OTHER
export enum BuildingCondition {
  GOOD = "GOOD",
  SOME_DEGRADATION = "SOME_DEGRADATION",
  BAD = "BAD",
  OTHER = "OTHER",
}

// Backend: EASY, DIFFICULT, NEEDS_RECONSTRUCTION
export enum RenovationCapacity {
  EASY = "EASY",
  DIFFICULT = "DIFFICULT",
  NEEDS_RECONSTRUCTION = "NEEDS_RECONSTRUCTION",
}

// Backend: STATE_DOMAIN, COMMUNAL, PRIVATE, OTHER
export enum OwnerType {
  STATE_DOMAIN = "STATE_DOMAIN",
  COMMUNAL = "COMMUNAL",
  PRIVATE = "PRIVATE",
  OTHER = "OTHER",
}

// Backend: ASSOCIATION_ALONE, MIXED_COMMITTEE
export enum SelectionBody {
  ASSOCIATION_ALONE = "ASSOCIATION_ALONE",
  MIXED_COMMITTEE = "MIXED_COMMITTEE",
}

// Backend: UNIFORM, NON_UNIFORM
export enum TariffType {
  UNIFORM = "UNIFORM",
  NON_UNIFORM = "NON_UNIFORM",
}

// Backend: LT_50, BETWEEN_50_100, BETWEEN_100_200, GT_200
export enum TariffBracket {
  LT_50 = "LT_50",
  BETWEEN_50_100 = "BETWEEN_50_100",
  BETWEEN_100_200 = "BETWEEN_100_200",
  GT_200 = "GT_200",
}

// Backend: INSTITUTION_KITCHEN, READY_MEALS, OTHER
export enum MealServiceType {
  INSTITUTION_KITCHEN = "INSTITUTION_KITCHEN",
  READY_MEALS = "READY_MEALS",
  OTHER = "OTHER",
}

// Staff Types matching backend
export enum StaffType {
  DIRECTOR = "DIRECTOR",
  FINANCIAL_MANAGER = "FINANCIAL_MANAGER",
  GENERAL_GUARD = "GENERAL_GUARD",
  SOCIAL_WORKER = "SOCIAL_WORKER",
  DOCTOR = "DOCTOR",
  NURSE = "NURSE",
  PSYCHOLOGIST = "PSYCHOLOGIST",
  EDUCATORS = "EDUCATORS",
  KITCHEN_MANAGER = "KITCHEN_MANAGER",
  KITCHEN_AGENTS = "KITCHEN_AGENTS",
  STORAGE_MANAGER = "STORAGE_MANAGER",
  SECURITY = "SECURITY",
  SERVICE_AGENTS = "SERVICE_AGENTS",
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
  buildingStatusOther?: string;
  buildingCondition?: BuildingCondition;
  buildingConditionOther?: string;
  renovationCapacity?: RenovationCapacity;
  ownerType?: OwnerType;
  ownerTypeOther?: string;
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
  totalConstructionCost?: number;

  // Equipment Funding Sources
  equipmentSolidarityMinistry?: boolean;
  equipmentNationalEntraide?: boolean;
  equipmentIndh?: boolean;
  equipmentCommune?: boolean;
  equipmentFondationMohammed5?: boolean;
  equipmentAssociation?: boolean;
  equipmentOther?: boolean;
  equipmentOtherDetail?: string;

  // Operating Funding Sources
  operatingIndh?: boolean;
  operatingNationalEntraide?: boolean;
  operatingNationalEducation?: boolean;
  operatingCommune?: boolean;
  operatingParentContributions?: boolean;
  operatingDonors?: boolean;
  operatingAssociationOwnSources?: boolean;
  operatingOther?: boolean;

  // Costs
  annualManagementCost?: number;
  annualHRCost?: number;
  annualMealsCost?: number;
  annualOtherExpenses?: number;
  individualAnnualCost?: number;

  // Shares
  associationShare?: number;
  educationShare?: number;
  otherShare?: number;
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

  // Committee Members (when selectionBody is COMMITTEE)
  committeeAssociation?: boolean;
  committeeNationalEntraide?: boolean;
  committeeNationalEducation?: boolean;
  committeeCommune?: boolean;
  committeeLocalAuthorities?: boolean;
  otherMember?: boolean;
  otherMemberDetail?: string;

  // Tariff
  servicesAreFree?: boolean;
  tariffType?: TariffType;
  uniformAmount?: number;
  tariffBracket?: TariffBracket;

  // Tariff Determination Body (من يحدد مبلغ الاشتراك الشهري)
  tariffDeterminationBody?: SelectionBody;
  tariffCommitteeAssociation?: boolean;
  tariffCommitteeNationalEntraide?: boolean;
  tariffCommitteeNationalEducation?: boolean;
  tariffCommitteeCommune?: boolean;
  tariffCommitteeLocalAuthorities?: boolean;
  tariffOtherMember?: boolean;
  tariffOtherMemberDetail?: string;

  // Additional
  unsatisfiedRequestsCount?: number;
}

export interface HousingMealsDTO {
  // Season Data
  season2324?: SeasonBeneficiaries;
  season2425?: SeasonBeneficiaries;
  season2526?: SeasonBeneficiaries;

  // Capacity remarks
  capacityRemarks?: string;

  // Meals
  totalMealBeneficiaries2526?: number;
  associationMealBeneficiaries?: number;
  educationMealBeneficiaries?: number;
  fullGrantCount?: number;
  halfGrantCount?: number;
  mealServiceType?: MealServiceType;
  mealServiceTypeOther?: string;

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

// Geo DTOs
export interface GeoDTO {
  id: number;
  name: string;
}

export interface InstitutionRequest {
  // Section 1: Institution Info
  institutionType: InstitutionType;
  associationName: string;
  institutionName: string;
  address?: string;
  regionId?: number | "";
  prefectureId?: number | "";
  communeId?: number | "";
  milieu?: Milieu;
  latitude?: number;
  longitude?: number;
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

  // Signed questionnaire PDF
  signedPdfUrl?: string;

  // Nested sections
  building?: BuildingDTO;
  financing?: FinancingDTO;
  targeting?: TargetingDTO;
  housingMeals?: HousingMealsDTO;
  staffMembers?: StaffMemberDTO[];
}

export interface InstitutionResponse {
  id: number;
  institutionType: InstitutionType;
  associationName: string;
  institutionName: string;
  address?: string;
  regionId?: number;
  regionName?: string;
  prefectureId?: number;
  prefectureName?: string;
  communeId?: number;
  communeName?: string;
  milieu?: Milieu;
  latitude?: number;
  longitude?: number;
  creationYear?: number;
  legalStatus?: LegalStatus;
  unlicensedReason?: string;
  licenseNumber?: string;
  serviceStartDate?: string;
  housing?: boolean;
  meals?: boolean;
  educationalSupport?: boolean;
  culturalActivities?: boolean;
  healthCare?: boolean;
  insurance?: boolean;
  psychologicalSupport?: boolean;
  totalCapacity?: number;
  maleCapacity?: number;
  femaleCapacity?: number;
  primary?: boolean;
  middleSchool?: boolean;
  highSchool?: boolean;
  other?: boolean;
  otherDetail?: string;
  distanceToSchool?: Distance;
  distanceToNationalBoardingSchool?: Distance;
  building?: BuildingDTO;
  financing?: FinancingDTO;
  targeting?: TargetingDTO;
  housingMeals?: HousingMealsDTO;
  staffMembers?: StaffMemberDTO[];
  signedPdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionSummary {
  id: number;
  institutionType: InstitutionType;
  institutionName: string;
  associationName: string;
  regionId?: number;
  regionName?: string;
  prefectureId?: number;
  prefectureName?: string;
  communeId?: number;
  communeName?: string;
  latitude?: number;
  longitude?: number;
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

// Dashboard Statistics
export interface RegionStats {
  regionId: number;
  regionName?: string;
  count: number;
  capacity: number;
  beneficiaries?: number;
}

export interface PrefectureStats {
  prefectureId: number;
  prefectureName?: string;
  count: number;
  capacity: number;
  beneficiaries?: number;
}

export interface DashboardStats {
  totalInstitutions: number;
  totalCapacity: number;
  totalBeneficiaries: number;
  darTalibCount: number;
  darTalibaCount: number;
  mixedCount: number;
  urbanCount: number;
  ruralCount: number;
  licensedCount: number;
  unlicensedCount: number;
  byRegion: RegionStats[];
  byPrefecture: PrefectureStats[];
  totalStaffCount?: number;
  averageCapacity?: number;
  institutionsWithHousing?: number;
  institutionsWithMeals?: number;
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
  [Milieu.URBAIN]: "حضري",
  [Milieu.RURAL]: "قروي",
};

export const legalStatusLabels: Record<LegalStatus, string> = {
  [LegalStatus.LICENSED]: "مرخصة",
  [LegalStatus.UNLICENSED]: "غير مرخصة",
};

export const distanceLabels: Record<Distance, string> = {
  [Distance.INSIDE]: "داخل المؤسسة التعليمية",
  [Distance.LT_1KM]: "أقل من 1 كلم",
  [Distance.BETWEEN_1_5KM]: "بين 1 و 5 كلم",
  [Distance.GT_5KM]: "أكثر من 5 كلم",
};

export const buildingStatusLabels: Record<BuildingStatus, string> = {
  [BuildingStatus.RENTAL]: "إيجار",
  [BuildingStatus.OWNED]: "ملكية",
  [BuildingStatus.AT_DISPOSAL]: "وضع رهن إشارة المؤسسة",
  [BuildingStatus.OTHER]: "آخر (للتحديد)",
};

export const buildingConditionLabels: Record<BuildingCondition, string> = {
  [BuildingCondition.GOOD]: "جيدة",
  [BuildingCondition.SOME_DEGRADATION]: "بعض علامات التدهور",
  [BuildingCondition.BAD]: "متردية",
  [BuildingCondition.OTHER]: "آخر (للتحديد)",
};

export const renovationCapacityLabels: Record<RenovationCapacity, string> = {
  [RenovationCapacity.EASY]: "سهلة",
  [RenovationCapacity.DIFFICULT]: "صعبة",
  [RenovationCapacity.NEEDS_RECONSTRUCTION]: "تتطلب إعادة البناء",
};

export const ownerTypeLabels: Record<OwnerType, string> = {
  [OwnerType.STATE_DOMAIN]: "أملاك الدولة",
  [OwnerType.COMMUNAL]: "ملك جماعي",
  [OwnerType.PRIVATE]: "ملك خصوصي",
  [OwnerType.OTHER]: "آخر (للتحديد)",
};

export const selectionBodyLabels: Record<SelectionBody, string> = {
  [SelectionBody.ASSOCIATION_ALONE]: "الجمعية بمفردها",
  [SelectionBody.MIXED_COMMITTEE]: "لجنة مختلطة",
};

export const tariffTypeLabels: Record<TariffType, string> = {
  [TariffType.UNIFORM]: "تعريفة موحدة",
  [TariffType.NON_UNIFORM]: "تعريفة غير موحدة",
};

export const tariffBracketLabels: Record<TariffBracket, string> = {
  [TariffBracket.LT_50]: "50 درهم أو أقل",
  [TariffBracket.BETWEEN_50_100]: "بين 50 و 100 درهم",
  [TariffBracket.BETWEEN_100_200]: "بين 100 و 200 درهم",
  [TariffBracket.GT_200]: "أكثر من 200 درهم",
};

export const mealServiceTypeLabels: Record<MealServiceType, string> = {
  [MealServiceType.INSTITUTION_KITCHEN]: "إعداد الوجبات في مطبخ المؤسسة",
  [MealServiceType.READY_MEALS]: "وجبات جاهزة",
  [MealServiceType.OTHER]: "آخر (للتحديد)",
};

export const staffTypeLabels: Record<StaffType, string> = {
  [StaffType.DIRECTOR]: "المدير(ة)",
  [StaffType.FINANCIAL_MANAGER]: "المسؤول المالي",
  [StaffType.GENERAL_GUARD]: "حارس عام",
  [StaffType.SOCIAL_WORKER]: "مساعد اجتماعي",
  [StaffType.DOCTOR]: "طبيب",
  [StaffType.NURSE]: "ممرض",
  [StaffType.PSYCHOLOGIST]: "أخصائي نفسي",
  [StaffType.EDUCATORS]: "المربون",
  [StaffType.KITCHEN_MANAGER]: "مسؤول عن المطبخ",
  [StaffType.KITCHEN_AGENTS]: "أعوان المطبخ",
  [StaffType.STORAGE_MANAGER]: "مسؤول عن المخزن",
  [StaffType.SECURITY]: "الحراسة",
  [StaffType.SERVICE_AGENTS]: "أعوان الخدمة",
  [StaffType.OTHER]: "آخر",
};
