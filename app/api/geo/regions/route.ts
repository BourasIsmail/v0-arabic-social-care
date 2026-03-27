import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-api";

export async function GET() {
  try {
    const response = await backendFetch("/api/v1/regions", { method: "GET" });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch regions" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching regions:", error);
    return NextResponse.json(
      { error: "Failed to fetch regions" },
      { status: 500 }
    );
  }
}
