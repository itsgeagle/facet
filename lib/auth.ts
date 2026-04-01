import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import type { User } from "@/lib/types";

export async function getSessionUser(): Promise<User | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return dbUser;
}
