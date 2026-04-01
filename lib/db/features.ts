"use server";

import { prisma } from "@/lib/db/prisma";
import { FeatureStatus } from "@/lib/types";
import type { FeatureWithAuthor } from "@/lib/types";

const authorSelect = {
  id: true,
  email: true,
  companyName: true,
} as const;

export async function getOpenFeatures(): Promise<FeatureWithAuthor[]> {
  return prisma.featureRequest.findMany({
    where: { status: FeatureStatus.OPEN },
    include: { author: { select: authorSelect } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCommittedFeatures(): Promise<FeatureWithAuthor[]> {
  return prisma.featureRequest.findMany({
    where: {
      status: {
        in: [
          FeatureStatus.COMMITTED,
          FeatureStatus.IN_PROGRESS,
          FeatureStatus.SHIPPED,
        ],
      },
    },
    include: { author: { select: authorSelect } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserFeatures(userId: string): Promise<FeatureWithAuthor[]> {
  return prisma.featureRequest.findMany({
    where: { authorId: userId },
    include: { author: { select: authorSelect } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFeatureById(id: string) {
  return prisma.featureRequest.findUnique({
    where: { id },
    include: {
      author: { select: authorSelect },
      contributions: {
        include: { user: { select: authorSelect } },
        orderBy: { amount: "desc" },
      },
    },
  });
}

export async function getPendingFeatures(): Promise<FeatureWithAuthor[]> {
  return prisma.featureRequest.findMany({
    where: { status: FeatureStatus.PENDING },
    include: { author: { select: authorSelect } },
    orderBy: { createdAt: "asc" },
  });
}

export async function getActiveAdminFeatures(): Promise<FeatureWithAuthor[]> {
  return prisma.featureRequest.findMany({
    where: {
      status: { in: [FeatureStatus.COMMITTED, FeatureStatus.IN_PROGRESS] },
    },
    include: { author: { select: authorSelect } },
    orderBy: { updatedAt: "desc" },
  });
}
