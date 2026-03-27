import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getTokenFromRequest } from "@/lib/backend-api";

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const searchParams = request.nextUrl.searchParams;
  
  // Forward all query parameters to backend
  const queryString = searchParams.toString();
  const path = `/api/v1/institutions${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await backendFetch(path, { method: "GET" }, token);
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching institutions:", error);
    return NextResponse.json(
      { error: "Failed to fetch institutions from backend" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);
  
  try {
    const body = await request.json();
    
    const response = await backendFetch(
      "/api/v1/institutions",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      token
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error creating institution:", error);
    return NextResponse.json(
      { error: "Failed to create institution" },
      { status: 500 }
    );
  }
}
