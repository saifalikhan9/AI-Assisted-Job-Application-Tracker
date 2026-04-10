import { Application } from "@/prisma/generated/prisma/client";
import { GroupedApplications } from "@/src/types/applications";

export function groupByStatus(
  applications: Application[],
): GroupedApplications<Application> {
  const grouped: GroupedApplications<Application> = {
    APPLIED: [],
    PHONE_SCREEN: [],
    INTERVIEW: [],
    OFFER: [],
    REJECTED: [],
  };

  for (const app of applications) {
    grouped[app.status].push(app);
  }

  return grouped;
}
