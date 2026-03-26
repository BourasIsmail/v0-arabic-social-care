import { NextRequest, NextResponse } from "next/server";
import type { InstitutionRequest, InstitutionSummary, PageResponse } from "@/lib/types";

// Global storage helpers (replace with actual database in production)
const getInstitutions = () => {
  // @ts-ignore
  if (!global.institutions) {
    // @ts-ignore
    global.institutions = [];
  }
  // @ts-ignore
  return global.institutions as (InstitutionRequest & { id: number; createdAt: string; updatedAt: string })[];
};

const getNextId = () => {
  // @ts-ignore
  if (!global.nextInstitutionId) {
    // @ts-ignore
    global.nextInstitutionId = 1;
  }
  // @ts-ignore
  return global.nextInstitutionId++;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "0");
  const size = parseInt(searchParams.get("size") || "10");
  const search = searchParams.get("search") || "";
  const institutionType = searchParams.get("institutionType") || "";

  const institutions = getInstitutions();
  let filtered = [...institutions];

  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (inst) =>
        inst.institutionName?.toLowerCase().includes(searchLower) ||
        inst.associationName?.toLowerCase().includes(searchLower)
    );
  }

  // Filter by institution type
  if (institutionType) {
    filtered = filtered.filter((inst) => inst.institutionType === institutionType);
  }

  // Sort by creation date (newest first)
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Paginate
  const totalElements = filtered.length;
  const totalPages = Math.ceil(totalElements / size);
  const start = page * size;
  const end = start + size;
  const content = filtered.slice(start, end).map((inst) => ({
    id: inst.id,
    institutionType: inst.institutionType,
    institutionName: inst.institutionName,
    associationName: inst.associationName,
    region: inst.region,
    commune: inst.commune,
    totalCapacity: inst.totalCapacity,
    createdAt: inst.createdAt,
  })) as InstitutionSummary[];

  const response: PageResponse<InstitutionSummary> = {
    content,
    totalElements,
    totalPages,
    size,
    number: page,
    first: page === 0,
    last: page >= totalPages - 1,
  };

  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  try {
    const body: InstitutionRequest = await request.json();

    // Validate required fields
    if (!body.institutionType || !body.associationName || !body.institutionName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const institutions = getInstitutions();
    const now = new Date().toISOString();
    const newInstitution = {
      ...body,
      id: getNextId(),
      createdAt: now,
      updatedAt: now,
    };

    institutions.push(newInstitution);

    return NextResponse.json(newInstitution, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
