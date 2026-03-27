import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ regionId: string }> }
) {
  const { regionId } = await params;

  try {
    const response = await backendFetch(
      `/v1/regions/${regionId}/prefectures`,
      { method: "GET" }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch prefectures" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching prefectures:", error);
    return NextResponse.json(
      { error: "Failed to fetch prefectures" },
      { status: 500 }
    );
  }
}
