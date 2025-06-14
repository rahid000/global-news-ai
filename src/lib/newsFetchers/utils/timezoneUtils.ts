export const countryTimezones: Record<string, string> = {
  AF: "Asia/Kabul",
  // Add other countries and their timezones here
  // e.g., BD: "Asia/Dhaka",
  // US: "America/New_York", // Example for US East Coast
};

export function getLocalTime(countryCode: string): Date | null {
  const timezone = countryTimezones[countryCode.toUpperCase()];
  if (!timezone) {
    console.warn(`Timezone not found for country code: ${countryCode}`);
    return null;
  }
  try {
    return new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));
  } catch (error) {
    console.error(`Error getting local time for ${countryCode} with timezone ${timezone}:`, error);
    return null;
  }
}
