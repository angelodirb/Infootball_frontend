export async function getMatches(date: string) {
     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fixtures?date=${date}`);
     return response.json();
   }