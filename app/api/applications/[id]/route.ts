import { NextRequest, NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const PATCH = async (
  req: NextRequest,
  ctx: RouteContext<"/api/applications/[id]">,
) => {
  try {
    // ✅ Auth check
    const decoded = await getUserFromRequest(req);

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = decoded;
    

    // ✅ Get ID
    const { id } = await ctx.params

    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    // ✅ Get body
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 },
      );
    }

    // ✅ Check ownership (VERY IMPORTANT)
    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json(
        { message: "Not found or unauthorized" },
        { status: 404 },
      );
    }

    // ✅ Update status
    const updated = await prisma.application.update({
      where: { id },
      data: { status },
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
