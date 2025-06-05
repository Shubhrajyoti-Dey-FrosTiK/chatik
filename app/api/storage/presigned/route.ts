import { storage } from "@/lib/gcs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GetSignedUrlConfig } from "@google-cloud/storage";

const createPresignedURLRequest = z.object({
  fileName: z.string(),
  contentType: z.string(),
});

export type CreatePresignedURLRequest = z.infer<
  typeof createPresignedURLRequest
>;

export async function POST(req: NextRequest) {
  const sessionDetails = await auth.api.getSession({
    headers: await headers(),
  });

  console.log(sessionDetails?.user.id);
  const body: z.infer<typeof createPresignedURLRequest> = await req.json();

  const parseResult = createPresignedURLRequest.safeParse(body);
  if (!parseResult.success || !sessionDetails?.user.id) {
    return NextResponse.json(
      { error: `Invalid request body ${parseResult.error}` },
      { status: 400 },
    );
  }

  const { fileName, contentType } = parseResult.data;

  const ext = path.extname(fileName);
  const newFileName = `${sessionDetails?.user.id}/uploads/${contentType}/${uuidv4()}.${ext}`;

  const options: GetSignedUrlConfig = {
    version: "v4" as const,
    action: "write" as const,
    expires: Date.now() + 15 * 60 * 1000,
    contentType,
  };

  const [url] = await storage
    .bucket(process.env.GCS_BUCKET ?? "")
    .file(newFileName)
    .getSignedUrl(options);

  // Get a signed download URL for the created object
  const downloadUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${newFileName}`;

  return NextResponse.json({ url, newFileName, downloadUrl });
}
