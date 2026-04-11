
import { getUserFromRequest } from "@/lib/auth";
import { groupByStatus } from "@/lib/helperFn";
import prisma from "@/lib/prisma";
import { CreateApplicationInput } from "@/src/types/applications";
import { NextRequest, NextResponse } from "next/server";


// ✅ GET → Fetch applications (grouped for Kanban)
export const GET = async (req: NextRequest) => {
  try {
    const decoded = await getUserFromRequest(req);

    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = decoded;

    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const grouped = groupByStatus(applications);

    return NextResponse.json(grouped, { status: 200 });
  } catch (error) {
    console.error("GET APPLICATIONS ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

// ✅ POST → Create application
export const POST = async (req: NextRequest) => {
  try {
    const decoded = await getUserFromRequest(req);

    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = decoded;

    const body: CreateApplicationInput = await req.json();
    const {
      company,
      role,
      location,
      seniority,
      requiredSkills,
      niceToHaveSkills,
      suggestions,  
      jdLink,
      notes,
      salaryMin,
      salaryMax,
    } = body;

    // 🔴 Validation
    if (!company || !role) {
      return NextResponse.json(
        { message: "Company and role are required" },
        { status: 400 }
      );
    }

    // 🧠 Normalize AI fields (important)
    const safeRequiredSkills = Array.isArray(requiredSkills)
      ? requiredSkills
      : [];

    const safeNiceToHaveSkills = Array.isArray(niceToHaveSkills)
      ? niceToHaveSkills
      : [];

    const safeSuggestions = Array.isArray(suggestions)
      ? suggestions
      : [];

    const application = await prisma.application.create({
      data: {
        userId,
        company,
        role,
        location: location || null,
        seniority: seniority || null,
        requiredSkills: safeRequiredSkills,
        niceToHaveSkills: safeNiceToHaveSkills,
        suggestions: safeSuggestions,
        jdLink: jdLink || null,
        notes: notes || null,
        salaryMin: salaryMin || null,
        salaryMax: salaryMax || null,
      },
    });

    return NextResponse.json(
      {
        message: "Application created successfully",
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE APPLICATION ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};