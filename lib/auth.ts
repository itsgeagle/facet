import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import type { User } from "@/lib/types";

export async function getSessionUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  return dbUser;
}
