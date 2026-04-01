import { prisma } from "@/lib/db/prisma";
import type { User } from "@/lib/types";

export async function getCurrentUser(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } }) as Promise<User | null>;
}

export async function getUsers(): Promise<User[]> {
  return prisma.user.findMany({ orderBy: { email: "asc" } }) as Promise<User[]>;
}
