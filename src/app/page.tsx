import { readJsonFile } from "@/lib/data";
import ClientPage from "@/components/client-page";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch from MongoDB via BMG generic handler
  const portfolioRes = await readJsonFile<any>("portfolio.json");
  
  return <ClientPage initialPortfolio={portfolioRes} />;
}
