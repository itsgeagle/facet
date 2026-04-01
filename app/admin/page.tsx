import { getPendingFeatures, getActiveAdminFeatures, getAllFeatures } from "@/lib/db/features";
import { getUsers } from "@/lib/db/users";
import { getAdminStats } from "@/lib/db/analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModerationQueue } from "@/components/admin/moderation-queue";
import { AllFeaturesTable } from "@/components/admin/all-features-table";
import { UserManagementTable } from "@/components/admin/user-management-table";
import { CreateUserModal } from "@/components/admin/create-user-modal";
import { StatsBar } from "@/components/admin/stats-bar";

export default async function AdminPage() {
  const [pendingFeatures, activeFeatures, allFeatures, users, stats] = await Promise.all([
    getPendingFeatures(),
    getActiveAdminFeatures(),
    getAllFeatures(),
    getUsers(),
    getAdminStats(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-foreground">Admin Panel</h1>
      <StatsBar stats={stats} />
      <Tabs defaultValue="moderation">
        <TabsList className="mb-6">
          <TabsTrigger value="moderation">
            Moderation Queue
            {pendingFeatures.length > 0 && (
              <span className="ml-1.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-full px-1.5 py-0.5">
                {pendingFeatures.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="features">All Features</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="moderation">
          <ModerationQueue
            pendingFeatures={pendingFeatures}
            activeFeatures={activeFeatures}
          />
        </TabsContent>

        <TabsContent value="features">
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-foreground">
              All Features ({allFeatures.length})
            </h2>
            <AllFeaturesTable features={allFeatures} />
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                All Users ({users.length})
              </h2>
              <CreateUserModal />
            </div>
            <UserManagementTable users={users} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
