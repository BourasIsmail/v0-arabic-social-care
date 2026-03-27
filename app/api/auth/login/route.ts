import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await backendFetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "فشل تسجيل الدخول" },
      { status: 500 }
    );
  }
}
