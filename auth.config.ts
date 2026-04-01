import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth configuration — no Node.js-only imports (no Prisma, no bcrypt).
 * Used by middleware.ts which runs in the Edge Runtime.
 * auth.ts extends this with the full Credentials provider.
 */
export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token["id"] = user.id!;
        token["role"] = (user as { role: string }).role;
        token["companyName"] = (user as { companyName?: string | null }).companyName;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token["id"] as string;
      session.user.role = token["role"] as string;
      session.user.companyName = token["companyName"] as string | null | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [],
};
