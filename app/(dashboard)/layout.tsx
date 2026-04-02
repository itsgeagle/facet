import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getTotalPurchasedBalance } from "@/lib/db/purchase-actions";
import { Navbar } from "@/components/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const totalPurchasedBalance = await getTotalPurchasedBalance(user.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} totalPurchasedBalance={totalPurchasedBalance} />
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
