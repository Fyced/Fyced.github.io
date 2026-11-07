import { getCollection } from "astro:content";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export const formatDate = (date: Date) => dateFormat.format(date);
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

// Entradas del diario de un proyecto, de la más reciente a la más antigua.
export async function getProjectLog(projectId: string) {
  const entries = await getCollection("log", (entry) =>
    entry.id.startsWith(`${projectId}/`),
  );
  return entries.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime() || b.id.localeCompare(a.id),
  );
}
