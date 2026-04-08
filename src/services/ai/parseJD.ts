import { ParsedJD } from "@/src/types/parseJD";
import { client } from "./minstral";

export async function parseJobDescription(jd: string): Promise<ParsedJD> {
  try {
    const prompt = `
  You are an AI that extracts structured job data from the given job decription.
  
  Return ONLY valid JSON. No explanation.
  
  Schema:
  {
    "company": "string",
    "role": "string",
    "seniority": "string",
    "location": "string",
    "requiredSkills": ["string"],
    "niceToHaveSkills": ["string"]
  }
  
  Rules:
  - If unknown, use empty string "" or empty array []
  - Do NOT add extra text
  
  Job Description:
  ${jd}
  `;

    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
    });

    const content = response?.choices[0]?.message?.content as string;

   
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    
    return {
      company: typeof parsed.company === "string" ? parsed.company : "Unknown",
      role: typeof parsed.role === "string" ? parsed.role : "Unknown",
      seniority: typeof parsed.seniority === "string" ? parsed.seniority : "",
      location: typeof parsed.location === "string" ? parsed.location : "",
      requiredSkills: Array.isArray(parsed.requiredSkills)
        ? parsed.requiredSkills
        : [],
      niceToHaveSkills: Array.isArray(parsed.niceToHaveSkills)
        ? parsed.niceToHaveSkills
        : [],
    };
  } catch (error) {
    console.error("AI PARSE ERROR:", error);
    throw new Error("Failed to parse job description");
  }
}
