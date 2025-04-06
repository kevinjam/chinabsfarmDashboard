import Dashboard from '@/components/Dashboard';

interface EggData {
  number: number;
  date: string;
  house: string;
  totalEggs: number;
  mortality: number;
  brokenEggs: number;
  chickens: number;
  food: number;
  user: string;
  tray: number;
  percentage: number;
}

export default async function DashboardPage() {
  let eggData: EggData[] = [];
  let error: string | null = null;
  

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!baseUrl) {
          throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
        }

        const response = await fetch(`${baseUrl}/api/eggs`); // Use the environment variable
    if (!response.ok) {
      throw new Error('Failed to fetch egg data from the API.');
    }
    eggData = await response.json();
  } catch (err: unknown) {
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = 'An unknown error occurred';
    }
  }

  return <Dashboard eggData={eggData} error={error} />;
}