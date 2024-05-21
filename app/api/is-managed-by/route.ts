import db from "@/db/drizzle";
import { project, projectMember } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto

// returns if that user is managed by that manager
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const managerId = request.nextUrl.searchParams.get("managerId");
  if (!userId) throw new Error("userId should be provided");
  if (!managerId) throw new Error("managerId should be provided");

  const res = await db
    .select()
    .from(project)
    .innerJoin(projectMember, eq(project.id, projectMember.projectId))
    .where(
      and(eq(projectMember.userId, userId), eq(project.managerId, managerId)),
    );

  if (res.length >= 1) {
    // if there's at least one match, then return true
    return Response.json({ isManagedBy: true });
  }

  // if no matches, return false
  return Response.json({ isManagedBy: false });
}
