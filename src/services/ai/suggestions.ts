import { ParsedJD } from "@/src/types/parseJD";
import { client } from "./minstral";

export const getSuggestionsStream = async (data: ParsedJD) => {
  let { role, seniority, requiredSkills, niceToHaveSkills } = data;

  role = role && role.trim().length > 0 ? role : "Software Developer";
  seniority = seniority || "";

  const safeRequiredSkills = Array.isArray(requiredSkills)
    ? requiredSkills.filter((s) => typeof s === "string")
    : [];

  const safeNiceToHaveSkills = Array.isArray(niceToHaveSkills)
    ? niceToHaveSkills.filter((s) => typeof s === "string")
    : [];

  const prompt = `
You are an expert resume writer.

Generate 3 to 5 strong resume bullet points.

Rules:
- Return ONLY bullet points in markdown format
- Each bullet must start with "-"
- No JSON
- No explanation
- Each bullet should be 1 line
- Use strong action verbs
- Include measurable impact in 1–2 bullets
- Make them ATS-friendly

Input:
Role: ${role}
Seniority: ${seniority || "Not specified"}
Required Skills: ${
    safeRequiredSkills.length > 0
      ? safeRequiredSkills.join(", ")
      : "Not specified"
  }
Nice to Have Skills: ${
    safeNiceToHaveSkills.length > 0
      ? safeNiceToHaveSkills.join(", ")
      : "Not specified"
  }
`;


  const response = await client.chat.stream({
    model: "mistral-small-latest",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response;
};