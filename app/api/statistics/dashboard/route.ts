import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getTokenFromRequest } from "@/lib/backend-api";
import type { DashboardStats, InstitutionResponse, PageResponse } from "@/lib/types";

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);

  try {
    // Fetch all institutions with full data for KPI computation
    const institutionsResponse = await backendFetch(
      "/api/v1/institutions?size=10000",
      { method: "GET" },
      token
    );

    if (!institutionsResponse.ok) {
      throw new Error("Failed to fetch institutions");
    }

    const institutionsData: PageResponse<InstitutionResponse> = await institutionsResponse.json();
    const institutions = institutionsData.content || [];

    // Basic counts
    const totalInstitutions = institutions.length;
    const totalCapacity = institutions.reduce((sum, inst) => sum + (inst.totalCapacity || 0), 0);
    
    // Type counts
    const darTalibInsts = institutions.filter((i) => i.institutionType === "DAR_TALIB");
    const darTalibaInsts = institutions.filter((i) => i.institutionType === "DAR_TALIBA");
    const mixedInsts = institutions.filter((i) => i.institutionType === "DAR_TALIB_TALIBA" || i.institutionType === "MIXED");

    // Milieu and status counts
    const urbanInsts = institutions.filter((i) => i.milieu === "URBAIN" || i.milieu === "URBAN");
    const ruralInsts = institutions.filter((i) => i.milieu === "RURAL");
    const licensedInsts = institutions.filter((i) => i.legalStatus === "LICENSED");
    const unlicensedInsts = institutions.filter((i) => i.legalStatus === "UNLICENSED");

    // Type stats with breakdown
    const typeStats = {
      darTalib: {
        total: darTalibInsts.length,
        licensed: darTalibInsts.filter(i => i.legalStatus === "LICENSED").length,
        unlicensed: darTalibInsts.filter(i => i.legalStatus === "UNLICENSED").length,
        urban: darTalibInsts.filter(i => i.milieu === "URBAIN" || i.milieu === "URBAN").length,
        rural: darTalibInsts.filter(i => i.milieu === "RURAL").length,
      },
      darTaliba: {
        total: darTalibaInsts.length,
        licensed: darTalibaInsts.filter(i => i.legalStatus === "LICENSED").length,
        unlicensed: darTalibaInsts.filter(i => i.legalStatus === "UNLICENSED").length,
        urban: darTalibaInsts.filter(i => i.milieu === "URBAIN" || i.milieu === "URBAN").length,
        rural: darTalibaInsts.filter(i => i.milieu === "RURAL").length,
      },
      mixed: {
        total: mixedInsts.length,
        licensed: mixedInsts.filter(i => i.legalStatus === "LICENSED").length,
        unlicensed: mixedInsts.filter(i => i.legalStatus === "UNLICENSED").length,
        urban: mixedInsts.filter(i => i.milieu === "URBAIN" || i.milieu === "URBAN").length,
        rural: mixedInsts.filter(i => i.milieu === "RURAL").length,
      },
    };

    // Target levels (المستويات المستهدفة)
    const targetLevels = {
      primary: institutions.filter(i => i.primary).length,
      middleSchool: institutions.filter(i => i.middleSchool).length,
      highSchool: institutions.filter(i => i.highSchool).length,
      other: institutions.filter(i => i.other).length,
    };

    // Building financing (تمويل بناء المؤسسة)
    const buildingFinancing = {
      solidarityMinistry: institutions.filter(i => i.financing?.solidarityMinistry).length,
      nationalEntraide: institutions.filter(i => i.financing?.nationalEntraide).length,
      indh: institutions.filter(i => i.financing?.indh).length,
      commune: institutions.filter(i => i.financing?.commune).length,
      fondationMohammed5: institutions.filter(i => i.financing?.fondationMohammed5).length,
      nationalRevival: institutions.filter(i => i.financing?.nationalRevival).length,
      association: institutions.filter(i => i.financing?.association).length,
      other: institutions.filter(i => i.financing?.otherConstruction).length,
      totalCost: institutions.reduce((sum, i) => sum + (i.financing?.totalConstructionCost || 0), 0),
    };

    // Equipment financing (تمويل تجهيز المؤسسة)
    const equipmentFinancing = {
      solidarityMinistry: institutions.filter(i => i.financing?.equipmentSolidarityMinistry).length,
      nationalEntraide: institutions.filter(i => i.financing?.equipmentNationalEntraide).length,
      indh: institutions.filter(i => i.financing?.equipmentIndh).length,
      commune: institutions.filter(i => i.financing?.equipmentCommune).length,
      fondationMohammed5: institutions.filter(i => i.financing?.equipmentFondationMohammed5).length,
      association: institutions.filter(i => i.financing?.equipmentAssociation).length,
      other: institutions.filter(i => i.financing?.equipmentOther).length,
    };

    // Operating financing (مصادر تمويل تسيير المؤسسة)
    const operatingFinancing = {
      associationShare: institutions.reduce((sum, i) => sum + (i.financing?.associationShare || 0), 0) / Math.max(institutions.length, 1),
      educationShare: institutions.reduce((sum, i) => sum + (i.financing?.educationShare || 0), 0) / Math.max(institutions.length, 1),
      otherShare: institutions.reduce((sum, i) => sum + (i.financing?.otherShare || 0), 0) / Math.max(institutions.length, 1),
      annualManagementCost: institutions.reduce((sum, i) => sum + (i.financing?.annualManagementCost || 0), 0),
      annualHRCost: institutions.reduce((sum, i) => sum + (i.financing?.annualHRCost || 0), 0),
      annualMealsCost: institutions.reduce((sum, i) => sum + (i.financing?.annualMealsCost || 0), 0),
      individualAnnualCost: institutions.reduce((sum, i) => sum + (i.financing?.individualAnnualCost || 0), 0) / Math.max(institutions.length, 1),
    };

    // Meal service (خدمة الإطعام)
    const mealService = {
      institutionKitchen: institutions.filter(i => i.housingMeals?.mealServiceType === "INSTITUTION_KITCHEN" || i.housingMeals?.mealServiceType === "IN_HOUSE").length,
      readyMeals: institutions.filter(i => i.housingMeals?.mealServiceType === "READY_MEALS").length,
      other: institutions.filter(i => i.housingMeals?.mealServiceType === "OTHER").length,
      totalMealBeneficiaries: institutions.reduce((sum, i) => sum + (i.housingMeals?.totalMealBeneficiaries2526 || 0), 0),
    };

    // Beneficiaries by season (المستفيدين من الإيواء والإطعام)
    const beneficiaries = {
      season2324: {
        total: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2324?.totalBeneficiaries || 0), 0),
        male: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2324?.maleBeneficiaries || 0), 0),
        female: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2324?.femaleBeneficiaries || 0), 0),
        primary: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2324?.primaryBeneficiaries || 0), 0),
        middle: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2324?.middleSchoolBeneficiaries || 0), 0),
        high: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2324?.highSchoolBeneficiaries || 0), 0),
      },
      season2425: {
        total: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2425?.totalBeneficiaries || 0), 0),
        male: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2425?.maleBeneficiaries || 0), 0),
        female: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2425?.femaleBeneficiaries || 0), 0),
        primary: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2425?.primaryBeneficiaries || 0), 0),
        middle: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2425?.middleSchoolBeneficiaries || 0), 0),
        high: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2425?.highSchoolBeneficiaries || 0), 0),
      },
      season2526: {
        total: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2526?.totalBeneficiaries || 0), 0),
        male: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2526?.maleBeneficiaries || 0), 0),
        female: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2526?.femaleBeneficiaries || 0), 0),
        primary: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2526?.primaryBeneficiaries || 0), 0),
        middle: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2526?.middleSchoolBeneficiaries || 0), 0),
        high: institutions.reduce((sum, i) => sum + (i.housingMeals?.season2526?.highSchoolBeneficiaries || 0), 0),
      },
    };

    // Human resources (الموارد البشرية)
    const humanResources = {
      directors: {
        total: institutions.reduce((sum, i) => sum + (i.staff?.directors || 0), 0),
        cnss: institutions.reduce((sum, i) => sum + (i.staff?.directorsCnss || 0), 0),
        smig: institutions.reduce((sum, i) => sum + (i.staff?.directorsSmig || 0), 0),
      },
      educators: {
        total: institutions.reduce((sum, i) => sum + (i.staff?.educators || 0), 0),
        cnss: institutions.reduce((sum, i) => sum + (i.staff?.educatorsCnss || 0), 0),
        smig: institutions.reduce((sum, i) => sum + (i.staff?.educatorsSmig || 0), 0),
      },
      cooks: {
        total: institutions.reduce((sum, i) => sum + (i.staff?.cooks || 0), 0),
        cnss: institutions.reduce((sum, i) => sum + (i.staff?.cooksCnss || 0), 0),
        smig: institutions.reduce((sum, i) => sum + (i.staff?.cooksSmig || 0), 0),
      },
      guards: {
        total: institutions.reduce((sum, i) => sum + (i.staff?.guards || 0), 0),
        cnss: institutions.reduce((sum, i) => sum + (i.staff?.guardsCnss || 0), 0),
        smig: institutions.reduce((sum, i) => sum + (i.staff?.guardsSmig || 0), 0),
      },
      other: {
        total: institutions.reduce((sum, i) => sum + (i.staff?.otherStaff || 0), 0),
        cnss: institutions.reduce((sum, i) => sum + (i.staff?.otherStaffCnss || 0), 0),
        smig: institutions.reduce((sum, i) => sum + (i.staff?.otherStaffSmig || 0), 0),
      },
      totalStaff: 0,
      totalWithCnss: 0,
      totalWithSmig: 0,
    };
    
    // Calculate totals
    humanResources.totalStaff = humanResources.directors.total + humanResources.educators.total + 
      humanResources.cooks.total + humanResources.guards.total + humanResources.other.total;
    humanResources.totalWithCnss = humanResources.directors.cnss + humanResources.educators.cnss + 
      humanResources.cooks.cnss + humanResources.guards.cnss + humanResources.other.cnss;
    humanResources.totalWithSmig = humanResources.directors.smig + humanResources.educators.smig + 
      humanResources.cooks.smig + humanResources.guards.smig + humanResources.other.smig;

    // Group by region
    const regionMap = new Map<number, { name?: string; count: number; capacity: number; beneficiaries: number }>();
    institutions.forEach((inst) => {
      if (inst.regionId) {
        const existing = regionMap.get(inst.regionId) || { name: inst.regionName, count: 0, capacity: 0, beneficiaries: 0 };
        existing.count++;
        existing.capacity += inst.totalCapacity || 0;
        existing.beneficiaries += inst.housingMeals?.season2526?.totalBeneficiaries || 0;
        if (inst.regionName) existing.name = inst.regionName;
        regionMap.set(inst.regionId, existing);
      }
    });

    const byRegion = Array.from(regionMap.entries())
      .map(([regionId, data]) => ({
        regionId,
        regionName: data.name,
        count: data.count,
        capacity: data.capacity,
        beneficiaries: data.beneficiaries,
      }))
      .sort((a, b) => b.count - a.count);

    // Group by prefecture
    const prefectureMap = new Map<number, { name?: string; count: number; capacity: number; beneficiaries: number }>();
    institutions.forEach((inst) => {
      if (inst.prefectureId) {
        const existing = prefectureMap.get(inst.prefectureId) || { name: inst.prefectureName, count: 0, capacity: 0, beneficiaries: 0 };
        existing.count++;
        existing.capacity += inst.totalCapacity || 0;
        existing.beneficiaries += inst.housingMeals?.season2526?.totalBeneficiaries || 0;
        if (inst.prefectureName) existing.name = inst.prefectureName;
        prefectureMap.set(inst.prefectureId, existing);
      }
    });

    const byPrefecture = Array.from(prefectureMap.entries())
      .map(([prefectureId, data]) => ({
        prefectureId,
        prefectureName: data.name,
        count: data.count,
        capacity: data.capacity,
        beneficiaries: data.beneficiaries,
      }))
      .sort((a, b) => b.count - a.count);

    const stats: DashboardStats = {
      totalInstitutions,
      totalCapacity,
      totalBeneficiaries: beneficiaries.season2526.total,
      darTalibCount: darTalibInsts.length,
      darTalibaCount: darTalibaInsts.length,
      mixedCount: mixedInsts.length,
      urbanCount: urbanInsts.length,
      ruralCount: ruralInsts.length,
      licensedCount: licensedInsts.length,
      unlicensedCount: unlicensedInsts.length,
      byRegion,
      byPrefecture,
      totalStaffCount: humanResources.totalStaff,
      averageCapacity: totalInstitutions > 0 ? Math.round((totalCapacity / totalInstitutions) * 100) / 100 : 0,
      institutionsWithHousing: institutions.filter(i => i.housing).length,
      institutionsWithMeals: institutions.filter(i => i.meals).length,
      typeStats,
      targetLevels,
      buildingFinancing,
      equipmentFinancing,
      operatingFinancing,
      mealService,
      beneficiaries,
      humanResources,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
