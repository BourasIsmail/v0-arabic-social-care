import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getTokenFromRequest } from "@/lib/backend-api";

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);

  try {
    const response = await backendFetch(
      "/v1/institutions/export/csv",
      { method: "GET" },
      token
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to export institutions" },
        { status: response.status }
      );
    }

    // Get the CSV content from backend
    const csvContent = await response.text();

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="institutions_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting institutions:", error);
    return NextResponse.json(
      { error: "Failed to export institutions" },
      { status: 500 }
    );
  }
}
