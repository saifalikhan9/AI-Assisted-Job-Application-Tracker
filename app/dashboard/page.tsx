import { Container } from "@/components/common/container";
import KanbanMock from "@/components/kaban/dashboard";
import { verifyToken } from "@/lib/auth";
import { getUserApplications } from "@/lib/serverFuntions/application";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return <div>Unauthorized</div>;

  let decoded;

  try {
    decoded = verifyToken(token);
  } catch {
    return <div>Unauthorized</div>;
  }
  if (!decoded) return <div>Unauthorized</div>;
  const data = await getUserApplications(decoded.userId);

  return (
    <Container className="flex flex-col">
      <KanbanMock initialData={data} />
    </Container>
  );
}