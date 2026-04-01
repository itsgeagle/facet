import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import {
  getOpenFeatures,
  getCommittedFeatures,
  getUserFeatures,
} from "@/lib/db/features";
import { getLeaderboard } from "@/lib/db/analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureList } from "@/components/feature-list";
import { FilterableFeatureList } from "@/components/filterable-feature-list";
import { Leaderboard } from "@/components/leaderboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { ProductTagBadge } from "@/components/product-tag-badge";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const [openFeatures, committedFeatures, myFeatures, leaderboard] = await Promise.all([
    getOpenFeatures(),
    getCommittedFeatures(),
    getUserFeatures(user.id),
    getLeaderboard(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-foreground">Features</h1>
      <Tabs defaultValue="open">
        <TabsList className="mb-6">
          <TabsTrigger value="open">
            Open for Funding
            {openFeatures.length > 0 && (
              <span className="ml-1.5 text-xs bg-primary/20 text-primary rounded-full px-1.5 py-0.5">
                {openFeatures.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="committed">Committed</TabsTrigger>
          <TabsTrigger value="mine">My Submissions</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="open">
          <FilterableFeatureList
            features={openFeatures}
            emptyMessage="No features open for funding yet."
            emptyDescription="Features submitted by your team will appear here once an admin approves them and sets a Carat cost."
            showSubmitCta
          />
        </TabsContent>

        <TabsContent value="committed">
          <FeatureList
            features={committedFeatures}
            emptyMessage="No committed features yet."
            emptyDescription="Features will move here once they've been fully funded by the community."
          />
        </TabsContent>

        <TabsContent value="mine">
          {myFeatures.length === 0 ? (
            <FeatureList
              features={[]}
              emptyMessage="You haven't submitted any features yet."
              emptyDescription="Submit a feature request and an admin will review it and set a Carat cost."
              showSubmitCta
            />
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myFeatures.map((feature) => (
                    <TableRow key={feature.id}>
                      <TableCell>
                        <Link
                          href={`/dashboard/features/${feature.id}`}
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {feature.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <ProductTagBadge tag={feature.productTag} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={feature.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(feature.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm text-muted-foreground">
              Top contributors ranked by total Carats spent on feature funding.
            </p>
            <Leaderboard entries={leaderboard} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
