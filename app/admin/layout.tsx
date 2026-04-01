import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Role } from "@/lib/types";
import { Navbar } from "@/components/navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) redirect("/login");
  if (user.role !== Role.ADMIN) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
