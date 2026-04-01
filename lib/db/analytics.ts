import { prisma } from "@/lib/db/prisma";
import { FeatureStatus } from "@/lib/types";

export interface LeaderboardEntry {
  userId: string;
  companyName: string | null;
  email: string;
  totalCarats: number;
  contributionCount: number;
}

export interface AdminStats {
  featureCountByStatus: Record<string, number>;
  totalCaratsInCirculation: number;
  totalCaratsFundedThisMonth: number;
  totalFeatures: number;
  totalUsers: number;
}

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const results = await prisma.contribution.groupBy({
    by: ["userId"],
    _sum: { amount: true },
    _count: { id: true },
    orderBy: { _sum: { amount: "desc" } },
    take: limit,
  });

  if (results.length === 0) return [];

  const userIds = results.map((r) => r.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, email: true, companyName: true },
  });

  const userMap = new Map(users.map((u) => [u.id, u]));

  return results.map((r) => {
    const user = userMap.get(r.userId);
    return {
      userId: r.userId,
      email: user?.email ?? "Unknown",
      companyName: user?.companyName ?? null,
      totalCarats: r._sum.amount ?? 0,
      contributionCount: r._count.id,
    };
  });
}

export async function getAdminStats(): Promise<AdminStats> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [featureCounts, totalUsers, totalBalance, monthlyFunded] = await Promise.all([
    prisma.featureRequest.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.user.count(),
    prisma.user.aggregate({ _sum: { currentBalance: true } }),
    prisma.contribution.aggregate({
      where: { createdAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
  ]);

  const featureCountByStatus: Record<string, number> = {};
  let totalFeatures = 0;
  for (const s of Object.values(FeatureStatus)) {
    featureCountByStatus[s] = 0;
  }
  for (const row of featureCounts) {
    featureCountByStatus[row.status] = row._count.id;
    totalFeatures += row._count.id;
  }

  return {
    featureCountByStatus,
    totalCaratsInCirculation: totalBalance._sum.currentBalance ?? 0,
    totalCaratsFundedThisMonth: monthlyFunded._sum.amount ?? 0,
    totalFeatures,
    totalUsers,
  };
}
