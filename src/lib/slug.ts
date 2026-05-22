export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function ensureUniqueSlug(
  baseSlug: string,
  exists: (slug: string, excludeId?: string) => Promise<boolean>,
  excludeId?: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await exists(slug, excludeId)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
