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

// Backend: GOOD, SOME_DEGRADATION, BAD
export enum BuildingCondition {
  GOOD = "GOOD",
  SOME_DEGRADATION = "SOME_DEGRADATION",
  BAD = "BAD",
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

// Backend: DIRECTOR, FINANCIAL_MANAGER, GENERAL_GUARD, SOCIAL_WORKER, DOCTOR, NURSE, PSYCHOLOGIST, EDUCATORS, KITCHEN_MANAGER, KITCHEN_AGENTS, STORAGE_MANAGER, SECURITY, SERVICE_AGENTS, OTHER
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
  buildingCondition?: BuildingCondition;
  renovationCapacity?: RenovationCapacity;
  ownerType?: OwnerType;
  hasPartnershipAgreement?: boolean;
}

export interface FinancingDTO {
  // Construction Funding Sources
  constructionByAssociation?: boolean;
  constructionByMinistry?: boolean;
  constructionByINDH?: boolean;
  constructionByCouncil?: boolean;
  constructionByDonors?: boolean;
  constructionByOther?: boolean;

  // Equipment Funding Sources
  equipmentByAssociation?: boolean;
  equipmentByMinistry?: boolean;
  equipmentByINDH?: boolean;
  equipmentByCouncil?: boolean;
  equipmentByDonors?: boolean;
  equipmentByOther?: boolean;

  // Operating Funding Sources
  operatingByAssociation?: boolean;
  operatingByMinistry?: boolean;
  operatingByINDH?: boolean;
  operatingByCouncil?: boolean;
  operatingByDonors?: boolean;
  operatingByOther?: boolean;

  // Budget
  annualBudget?: number;
  ministryContribution?: number;
  associationContribution?: number;
  councilContribution?: number;
  otherContribution?: number;
}

export interface TargetingDTO {
  // Selection Criteria
  povertyBased?: boolean;
  distanceBased?: boolean;
  orphansBased?: boolean;
  disabilityBased?: boolean;
  otherCriteria?: boolean;

  // Selection Body
  selectionBody?: SelectionBody;

  // Committee Members
  committeeHasAssociation?: boolean;
  committeeHasAuthority?: boolean;
  committeeHasEducation?: boolean;
  committeeHasSocial?: boolean;
  committeeHasOther?: boolean;

  // Tariff
  servicesAreFree?: boolean;
  tariffType?: TariffType;
  fixedTariffAmount?: number;
  tariffBracket?: TariffBracket;
}

export interface HousingMealsDTO {
  totalRooms?: number;
  totalBeds?: number;
  bedsPerRoom?: number;
  hasRefectory?: boolean;
  refectoryCapacity?: number;
  mealServiceType?: MealServiceType;

  // Improvement Suggestions
  suggestBuildingRenovation?: boolean;
  suggestNewBuilding?: boolean;
  suggestEquipment?: boolean;
  suggestCapacityIncrease?: boolean;
  suggestStaffTraining?: boolean;

  // Season Data
  season2324?: SeasonBeneficiaries;
  season2425?: SeasonBeneficiaries;
  season2526?: SeasonBeneficiaries;
}

export interface StaffMemberDTO {
  id?: number;
  staffType: StaffType;
  count?: number;
  isCertified?: boolean;
  monthlySalary?: number;
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
  // Additional stats from backend
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
  [Distance.INSIDE]: "داخل المؤسسة",
  [Distance.LT_1KM]: "أقل من 1 كم",
  [Distance.BETWEEN_1_5KM]: "بين 1 و 5 كم",
  [Distance.GT_5KM]: "أكثر من 5 كم",
};

export const buildingStatusLabels: Record<BuildingStatus, string> = {
  [BuildingStatus.RENTAL]: "مكترى",
  [BuildingStatus.OWNED]: "ملك",
  [BuildingStatus.AT_DISPOSAL]: "رهن الإشارة",
  [BuildingStatus.OTHER]: "أخرى",
};

export const buildingConditionLabels: Record<BuildingCondition, string> = {
  [BuildingCondition.GOOD]: "جيدة",
  [BuildingCondition.SOME_DEGRADATION]: "متوسطة",
  [BuildingCondition.BAD]: "سيئة",
};

export const renovationCapacityLabels: Record<RenovationCapacity, string> = {
  [RenovationCapacity.EASY]: "سهلة",
  [RenovationCapacity.DIFFICULT]: "صعبة",
  [RenovationCapacity.NEEDS_RECONSTRUCTION]: "تحتاج إعادة بناء",
};

export const ownerTypeLabels: Record<OwnerType, string> = {
  [OwnerType.STATE_DOMAIN]: "ملك الدولة",
  [OwnerType.COMMUNAL]: "جماعي",
  [OwnerType.PRIVATE]: "خاص",
  [OwnerType.OTHER]: "أخرى",
};

export const selectionBodyLabels: Record<SelectionBody, string> = {
  [SelectionBody.ASSOCIATION_ALONE]: "الجمعية لوحدها",
  [SelectionBody.MIXED_COMMITTEE]: "لجنة مختلطة",
};

export const tariffTypeLabels: Record<TariffType, string> = {
  [TariffType.UNIFORM]: "موحد",
  [TariffType.NON_UNIFORM]: "غير موحد",
};

export const tariffBracketLabels: Record<TariffBracket, string> = {
  [TariffBracket.LT_50]: "أقل من 50 درهم",
  [TariffBracket.BETWEEN_50_100]: "بين 50 و 100 درهم",
  [TariffBracket.BETWEEN_100_200]: "بين 100 و 200 درهم",
  [TariffBracket.GT_200]: "أكثر من 200 درهم",
};

export const mealServiceTypeLabels: Record<MealServiceType, string> = {
  [MealServiceType.INSTITUTION_KITCHEN]: "مطبخ المؤسسة",
  [MealServiceType.READY_MEALS]: "وجبات جاهزة",
  [MealServiceType.OTHER]: "أخرى",
};

export const staffTypeLabels: Record<StaffType, string> = {
  [StaffType.DIRECTOR]: "مدير",
  [StaffType.FINANCIAL_MANAGER]: "مسؤول مالي",
  [StaffType.GENERAL_GUARD]: "حارس عام",
  [StaffType.SOCIAL_WORKER]: "مساعد اجتماعي",
  [StaffType.DOCTOR]: "طبيب",
  [StaffType.NURSE]: "ممرض",
  [StaffType.PSYCHOLOGIST]: "أخصائي نفسي",
  [StaffType.EDUCATORS]: "مربين",
  [StaffType.KITCHEN_MANAGER]: "مسؤول المطبخ",
  [StaffType.KITCHEN_AGENTS]: "عمال المطبخ",
  [StaffType.STORAGE_MANAGER]: "مسؤول المخزن",
  [StaffType.SECURITY]: "الأمن",
  [StaffType.SERVICE_AGENTS]: "عمال الخدمة",
  [StaffType.OTHER]: "أخرى",
};
