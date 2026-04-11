import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ApplicationStatus } from "./generated/prisma/enums";

const applications = [
  {
    company: "Amazon",
    role: "Frontend Developer",
    status: ApplicationStatus.APPLIED,
    location: "Remote",
    requiredSkills: ["React", "JavaScript", "CSS"],
  },
  {
    company: "Google",
    role: "Software Engineer",
    status: ApplicationStatus.PHONE_SCREEN,
    location: "Bangalore",
    requiredSkills: ["Node.js", "System Design"],
  },
  {
    company: "Meta",
    role: "UI Engineer",
    status: ApplicationStatus.INTERVIEW,
    location: "Remote",
    requiredSkills: ["React", "UI/UX"],
  },
  {
    company: "Netflix",
    role: "Frontend Engineer",
    status: ApplicationStatus.OFFER,
    location: "USA Remote",
    requiredSkills: ["React", "Performance"],
  },
  {
    company: "Adobe",
    role: "Frontend Developer",
    status: ApplicationStatus.REJECTED,
    location: "India",
    requiredSkills: ["JavaScript", "HTML", "CSS"],
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      password: hashedPassword,
    },
  });

  console.log("✅ User created:", user.email);

  for (const app of applications) {
    await prisma.application.create({
      data: {
        ...app,
        userId: user.id,
      },
    });
  }

  console.log("✅ Applications seeded");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
