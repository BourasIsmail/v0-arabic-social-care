import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getTokenFromRequest } from "@/lib/backend-api";

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const searchParams = request.nextUrl.searchParams;
  
  // Forward query parameters to backend (e.g., prefectureId for filtering)
  const queryString = searchParams.toString();
  const path = `/api/v1/institutions/stats${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await backendFetch(path, { method: "GET" }, token);
    
    // If backend doesn't have stats endpoint, calculate from list
    if (!response.ok) {
      // Fallback: fetch all institutions and calculate stats
      const listPath = `/api/v1/institutions${queryString ? `?${queryString}&size=1000` : "?size=1000"}`;
      const listResponse = await backendFetch(listPath, { method: "GET" }, token);
      
      if (!listResponse.ok) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
      }
      
      const listData = await listResponse.json();
      const institutions = listData.content || [];
      
      // Calculate stats
      const stats = {
        total: institutions.length,
        DAR_TALIB: institutions.filter((i: any) => i.institutionType === "DAR_TALIB").length,
        DAR_TALIBA: institutions.filter((i: any) => i.institutionType === "DAR_TALIBA").length,
        MIXED: institutions.filter((i: any) => i.institutionType === "MIXED").length,
      };
      
      return NextResponse.json(stats);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
