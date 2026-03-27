import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getTokenFromRequest } from "@/lib/backend-api";
import type { DashboardStats, InstitutionSummary, PageResponse } from "@/lib/types";

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);

  try {
    // Fetch from backend statistics endpoint
    const response = await backendFetch("/v1/statistics/dashboard", { method: "GET" }, token);
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    }

    // If backend endpoint fails, fallback to computing from institutions
    console.log("Backend statistics endpoint returned error, computing from institutions data");
    
    const institutionsResponse = await backendFetch(
      "/v1/institutions?size=10000",
      { method: "GET" },
      token
    );

    if (!institutionsResponse.ok) {
      throw new Error("Failed to fetch institutions");
    }

    const institutionsData: PageResponse<InstitutionSummary> = await institutionsResponse.json();
    const institutions = institutionsData.content || [];

    // Compute statistics from institutions list
    const totalCapacity = institutions.reduce((sum, inst) => sum + (inst.totalCapacity || 0), 0);
    const totalInstitutions = institutions.length;

    const stats: DashboardStats = {
      totalInstitutions,
      totalCapacity,
      totalBeneficiaries: 0,
      darTalibCount: institutions.filter((i) => i.institutionType === "DAR_TALIB").length,
      darTalibaCount: institutions.filter((i) => i.institutionType === "DAR_TALIBA").length,
      mixedCount: institutions.filter((i) => i.institutionType === "DAR_TALIB_TALIBA" || i.institutionType === "MIXED").length,
      urbanCount: 0,
      ruralCount: 0,
      licensedCount: 0,
      unlicensedCount: 0,
      byRegion: [],
      byPrefecture: [],
      totalStaffCount: 0,
      averageCapacity: totalInstitutions > 0 ? Math.round((totalCapacity / totalInstitutions) * 100) / 100 : 0,
      institutionsWithHousing: 0,
      institutionsWithMeals: 0,
    };

    // Group by region
    const regionMap = new Map<number, { name?: string; count: number; capacity: number; beneficiaries: number }>();
    institutions.forEach((inst) => {
      if (inst.regionId) {
        const existing = regionMap.get(inst.regionId) || { name: inst.regionName, count: 0, capacity: 0, beneficiaries: 0 };
        existing.count++;
        existing.capacity += inst.totalCapacity || 0;
        if (inst.regionName) existing.name = inst.regionName;
        regionMap.set(inst.regionId, existing);
      }
    });

    stats.byRegion = Array.from(regionMap.entries())
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
        if (inst.prefectureName) existing.name = inst.prefectureName;
        prefectureMap.set(inst.prefectureId, existing);
      }
    });

    stats.byPrefecture = Array.from(prefectureMap.entries())
      .map(([prefectureId, data]) => ({
        prefectureId,
        prefectureName: data.name,
        count: data.count,
        capacity: data.capacity,
        beneficiaries: data.beneficiaries,
      }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
