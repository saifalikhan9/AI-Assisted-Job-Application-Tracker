import { groupByStatus } from "../helperFn";
import prisma from "../prisma";


export async function getUserApplications(userId: string) {
  const applications = await prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return groupByStatus(applications);
}