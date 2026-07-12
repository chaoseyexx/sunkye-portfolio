import { getProjects } from "@/actions/projects";
import ClientPage from "@/components/client-page";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch from MongoDB
  const projectsRes = await getProjects();
  const initialProjects = projectsRes.success ? projectsRes.data : [];

  return <ClientPage initialProjects={initialProjects} />;
}
