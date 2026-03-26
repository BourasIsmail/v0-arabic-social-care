import { NextRequest, NextResponse } from "next/server";
import type { InstitutionRequest } from "@/lib/types";

// Reference to the same in-memory storage
// In production, this would be a database
let institutions: (InstitutionRequest & { id: number; createdAt: string; updatedAt: string })[] = [];

// This is a workaround for in-memory storage across routes
// In production, use a proper database
const getInstitutions = () => {
  // @ts-ignore - accessing global storage
  if (!global.institutions) {
    // @ts-ignore
    global.institutions = [];
  }
  // @ts-ignore
  return global.institutions as (InstitutionRequest & { id: number; createdAt: string; updatedAt: string })[];
};

const setInstitutions = (data: (InstitutionRequest & { id: number; createdAt: string; updatedAt: string })[]) => {
  // @ts-ignore
  global.institutions = data;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const institutionId = parseInt(id);
  const institutions = getInstitutions();
  
  const institution = institutions.find((inst) => inst.id === institutionId);

  if (!institution) {
    return NextResponse.json(
      { error: "Institution not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(institution);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const institutionId = parseInt(id);
  const institutions = getInstitutions();
  
  const index = institutions.findIndex((inst) => inst.id === institutionId);

  if (index === -1) {
    return NextResponse.json(
      { error: "Institution not found" },
      { status: 404 }
    );
  }

  try {
    const body: InstitutionRequest = await request.json();

    const updatedInstitution = {
      ...institutions[index],
      ...body,
      id: institutionId,
      updatedAt: new Date().toISOString(),
    };

    institutions[index] = updatedInstitution;
    setInstitutions(institutions);

    return NextResponse.json(updatedInstitution);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const institutionId = parseInt(id);
  const institutions = getInstitutions();
  
  const index = institutions.findIndex((inst) => inst.id === institutionId);

  if (index === -1) {
    return NextResponse.json(
      { error: "Institution not found" },
      { status: 404 }
    );
  }

  institutions.splice(index, 1);
  setInstitutions(institutions);

  return new NextResponse(null, { status: 204 });
}
