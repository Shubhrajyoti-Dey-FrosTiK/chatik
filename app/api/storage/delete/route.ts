import { auth } from "@/lib/auth";
import { storage } from "@/lib/gcs";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BUCKET_NAME = process.env.GCS_BUCKET!;

export async function DELETE(req: NextRequest) {
  const id = req.headers.get("id");
  const sessionDetails = await auth.api.getSession({
    headers: await headers(),
  });
  if (!id || !sessionDetails?.user || !id.includes(sessionDetails.user.id)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(id);

    await file.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
