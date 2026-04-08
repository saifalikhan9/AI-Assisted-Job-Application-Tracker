import { getUserFromRequest } from "@/src/lib/auth";
import { ParsedJD } from "@/src/types/parseJD";
import { getSuggestions } from "@/src/services/ai/suggestions";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const decoded = await getUserFromRequest(req);

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body: ParsedJD = await req.json();
    const { role, requiredSkills } = body;

    if (!role && (!requiredSkills || requiredSkills.length === 0)) {
      return NextResponse.json(
        {
          message: "Insufficient data to generate suggestions",
        },
        { status: 400 },
      );
    }

    const suggestions = await getSuggestions(body);

    return NextResponse.json({ suggestions }, { status: 200 });
  } catch (error) {
    console.error("SUGGESTIONS ROUTE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to generate suggestions" },
      { status: 500 },
    );
  }
};
