import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export async function saveImageToPublic(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${safeExt}`;

  const dirPath = path.join(process.cwd(), "public", "uploads");
  await mkdir(dirPath, { recursive: true });

  const fullPath = path.join(dirPath, fileName);
  await writeFile(fullPath, buffer);

  return `/uploads/${fileName}`;
}
