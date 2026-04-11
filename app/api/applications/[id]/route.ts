import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const decoded = await getUserFromRequest(req);

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = decoded;

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    const {
      status,
      company,
      role,
      seniority,
      location,
      requiredSkills,
      niceToHaveSkills,
      notes,
      salary,
    } = body;

    if (
      !status &&
      !company &&
      !role &&
      !seniority &&
      !location &&
      !requiredSkills &&
      !niceToHaveSkills &&
      !notes &&
      !salary
    ) {
      return NextResponse.json(
        { message: "No fields provided to update" },
        { status: 400 },
      );
    }

    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json(
        { message: "Not found or unauthorized" },
        { status: 404 },
      );
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(company && { company }),
        ...(role && { role }),
        ...(seniority && { seniority }),
        ...(location && { location }),
        ...(requiredSkills && { requiredSkills }),
        ...(niceToHaveSkills && { niceToHaveSkills }),
        ...(notes && { notes }),
        ...(salary && { salary }),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH APPLICATION ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const decoded = await getUserFromRequest(req);

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Invalid ID" },
        { status: 400 }
      );
    }

    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== decoded.userId) {
      return NextResponse.json(
        { message: "Not found or unauthorized" },
        { status: 404 }
      );
    }


    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("failed to delete", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};
