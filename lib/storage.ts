import { supabase } from "./supabase";
import imageCompression from "browser-image-compression";

export async function uploadReceipt(file: File, tripId: string) {
  let uploadFile: File | Blob = file;

  if (file.type.startsWith("image/")) {
    uploadFile = await imageCompression(file, {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
    });
  }

  const ext =
    file.name.split(".").pop() ||
    (file.type === "application/pdf" ? "pdf" : "jpg");
  const path = `${tripId}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from("receipts")
    .upload(path, uploadFile, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  return { path, size: uploadFile.size };
}