import { getUserFromRequest } from "@/src/lib/auth";
import { parseJobDescription } from "@/src/services/ai/parseJD";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const decoded = await getUserFromRequest(req);

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { jd }: { jd: string } = body;

    if (typeof jd !== "string" || jd.trim().length === 0) {
      return NextResponse.json(
        { message: "Job description must be a valid string" },
        { status: 400 },
      );
    }

    const parsedData = await parseJobDescription(jd);

    if (!parsedData) {
      return NextResponse.json(
        {
          message: "Failed to parse job description",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(parsedData, { status: 200 });
  } catch (error) {
    console.error("PARSE ROUTE ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
