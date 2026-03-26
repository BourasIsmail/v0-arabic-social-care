import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getTokenFromRequest } from "@/lib/backend-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = getTokenFromRequest(request);

  try {
    const response = await backendFetch(
      `/api/v1/institutions/${id}`,
      { method: "GET" },
      token
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        error,
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching institution:", error);
    return NextResponse.json(
      { error: "Failed to fetch institution" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = getTokenFromRequest(request);

  try {
    const body = await request.json();

    const response = await backendFetch(
      `/api/v1/institutions/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
      token
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        error,
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating institution:", error);
    return NextResponse.json(
      { error: "Failed to update institution" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = getTokenFromRequest(request);

  try {
    const response = await backendFetch(
      `/api/v1/institutions/${id}`,
      { method: "DELETE" },
      token
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        error,
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting institution:", error);
    return NextResponse.json(
      { error: "Failed to delete institution" },
      { status: 500 }
    );
  }
}
