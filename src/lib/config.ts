export const adminEmails: string[] = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

export const mahallaCenter: { lat: number; lng: number; zoom: number } = {
  lat: 30.9700,
  lng: 31.1667,
  zoom: 13,
};

// Approximate bounding box for مدينة المحلة الكبرى
export const mahallaBounds: [[number, number], [number, number]] = [
  [30.92, 31.11], // southwest [lat, lng]
  [31.02, 31.22], // northeast [lat, lng]
];

export const cityName = "المحلة الكبرى";

