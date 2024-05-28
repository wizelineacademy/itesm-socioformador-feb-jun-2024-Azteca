"use server";

import { auth } from "@/auth";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Resource } from "sst";
import db from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPreSignedURL() {
  const command = new PutObjectCommand({
    Key: crypto.randomUUID(),
    Bucket: Resource.FeedbackFlowBucket.name,
  });
  const url = await getSignedUrl(new S3Client({}), command, { expiresIn: 60 });
  return url;
}

export async function changeProfileImage(newPhotoUrl: string) {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) throw new Error("User is not authenticated");

  await db.update(user).set({ photoUrl: newPhotoUrl }).where(eq(user.id, id));
}
