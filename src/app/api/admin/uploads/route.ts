import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const imageTypes = {
  "image/jpeg": { extension: "jpg", signature: (bytes: Buffer) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  "image/png": { extension: "png", signature: (bytes: Buffer) => bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  "image/webp": { extension: "webp", signature: (bytes: Buffer) => bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP" },
};

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Choose an image to upload." }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_FILE_SIZE) {
    return Response.json({ error: "Image must be between 1 byte and 10 MB." }, { status: 400 });
  }

  const imageType = imageTypes[file.type as keyof typeof imageTypes];
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!imageType || !imageType.signature(bytes)) {
    return Response.json({ error: "Use a valid JPEG, PNG or WebP image." }, { status: 400 });
  }

  const filename = `${crypto.randomUUID()}.${imageType.extension}`;
  const uploadDirectory = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(join(uploadDirectory, filename), bytes, { flag: "wx" });

  return Response.json({ url: `/uploads/${filename}` });
}
