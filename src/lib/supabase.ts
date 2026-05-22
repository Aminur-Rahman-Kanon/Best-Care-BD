import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are not configured");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || "product-images";
}

export async function deleteSupabaseFiles(paths: string[]) {
  if (!paths.length) return;
  const supabase = getSupabaseAdmin();
  const bucket = getStorageBucket();
  await supabase.storage.from(bucket).remove(paths);
}

export async function uploadToSupabase(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<{ url: string; path: string }> {
  const supabase = getSupabaseAdmin();
  const bucket = getStorageBucket();
  const path = `products/${Date.now()}-${fileName}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType,
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return { url: publicUrl, path };
}
