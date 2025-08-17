export type Place = {
  displayName: string;
  lat: number;
  lon: number;
};

export async function searchPlaces(query: string): Promise<Place[]> {
  if (!query) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query
  )}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'wakeup-app/1.0 (educational)' },
  });
  const json = (await res.json()) as any[];
  return json.map((item) => ({
    displayName: item.display_name,
    lat: Number(item.lat),
    lon: Number(item.lon),
  }));
}
