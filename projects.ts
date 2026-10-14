import { db } from "@/db";
import { projects } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function getProjects() {
  return db.select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.id));
}
