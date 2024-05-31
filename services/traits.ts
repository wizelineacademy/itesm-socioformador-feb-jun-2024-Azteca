/* import db from "@/db/drizzle";

export async function createProject({
    userId,
    strengths,
    opportunitiesArea
  }: {
    userId: string,
    strengths: string[],
    opportunitiesArea: string[],
  }) {  
    // Create the project and get the id
    const res = await db
      .insert(project)
      .values({ ...newProject, managerId: userId }) // Manager is current user
      .returning({ id: project.id });
    const { id: projectId } = res[0];
  
    // Link the members to that project
    await db.insert(projectMember).values(
      members.map((member) => ({
        userId: member,
        projectId,
      })),
    ); */
