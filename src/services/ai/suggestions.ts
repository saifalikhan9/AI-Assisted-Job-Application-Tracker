import { ParsedJD } from "@/src/types/parseJD";
import { client } from "./minstral";

export const getSuggestions = async (data: ParsedJD) => {
  try {
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
      You are an expert resume writer specializing in ATS-optimized resumes.
      
      Your task is to generate 3 to 5 strong, realistic resume bullet points tailored to the given job role.
      
      Return ONLY valid JSON. Do NOT include any explanation or extra text.
      
      Format:
      {
        "suggestions": ["string"]
      }
      
      Strict Rules:
      - Each bullet must start with a strong action verb (e.g., Built, Developed, Improved, Implemented)
      - Keep each bullet concise (1 line)
      - Make bullets specific to the role and skills provided
      - Include measurable impact (numbers, percentages, scale) in ONLY 1 or 2 bullets (do NOT overuse)
      - Ensure all bullets are ATS-friendly (use relevant keywords naturally)
      - Avoid generic phrases like "worked on" or "responsible for"
      - Do NOT repeat the same idea
      - Do NOT include company names or personal details
      
      If some fields are missing, still generate meaningful bullets based on available data.
      
      Input:
      Role: ${role || "Software Developer"}
      Seniority: ${seniority || "Not specified"}
      Required Skills: ${safeRequiredSkills.length > 0 ? safeRequiredSkills.join(", ") : "Not specified"}
      Nice to Have Skills: ${safeNiceToHaveSkills.length > 0 ? safeNiceToHaveSkills.join(", ") : "Not specified"}
      `;

    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message?.content as string;

    const match = content.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("Invalid AI response");
    }

    const parsed = JSON.parse(match[0]);

    let suggestions: string[] = [];

    if (Array.isArray(parsed.suggestions)) {
      suggestions = parsed.suggestions.filter(
        (s) => typeof s === "string" && s.trim().length > 0,
      );
    }

    if (suggestions.length === 0) {
      suggestions = [
        `Developed applications using ${
          safeRequiredSkills.join(", ") || "modern technologies"
        }`,
      ];
    }

    return suggestions;
  } catch (error) {
    console.error("SUGGESTIONS ERROR:", error);
    throw new Error("Failed to generate suggestions");
  }
};
