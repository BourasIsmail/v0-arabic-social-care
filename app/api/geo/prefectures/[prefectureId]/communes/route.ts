import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ prefectureId: string }> }
) {
  const { prefectureId } = await params;

  try {
    const response = await backendFetch(
      `/v1/prefectures/${prefectureId}/communes`,
      { method: "GET" }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch communes" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching communes:", error);
    return NextResponse.json(
      { error: "Failed to fetch communes" },
      { status: 500 }
    );
  }
}
