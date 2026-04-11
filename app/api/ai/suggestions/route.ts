import { ParsedJD } from "@/src/types/parseJD";
import { getSuggestionsStream } from "@/src/services/ai/suggestions";
import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export const POST = async (req: NextRequest) => {
  try {
    const decoded = await getUserFromRequest(req);

    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body: ParsedJD = await req.json();
    const { role, requiredSkills } = body;

    if (!role && (!requiredSkills || requiredSkills.length === 0)) {
      return new Response("Insufficient data to generate suggestions", {
        status: 400,
      });
    }


    const stream = new ReadableStream({
      async start(controller) {
        try {
          const encoder = new TextEncoder();

          const aiStream = await getSuggestionsStream(body);

          for await (const chunk of aiStream) {
            const text = chunk.data.choices[0].delta.content || "";

            if (text) {
              controller.enqueue(encoder.encode(text as string));
            }
          }

          controller.close();
        } catch (error) {
          console.error("STREAM ERROR:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("SUGGESTIONS ROUTE ERROR:", error);

    return new Response("Failed to generate suggestions", {
      status: 500,
    });
  }
};
