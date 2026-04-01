import type { User } from "@/lib/types";
import { Role } from "@/lib/types";
import { EditAllowanceModal } from "@/components/admin/edit-allowance-modal";
import { ResetPasswordButton } from "@/components/admin/reset-password-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserManagementTableProps {
  users: User[];
}

export function UserManagementTable({ users }: UserManagementTableProps) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Allowance</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium text-foreground text-sm">{user.email}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {user.companyName ?? "—"}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    user.role === Role.ADMIN
                      ? "bg-purple-600 text-purple-100"
                      : "bg-slate-700 text-slate-200"
                  }`}
                >
                  {user.role}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {user.monthlyAllowance} Carats
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {user.currentBalance} Carats
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <ResetPasswordButton userId={user.id} userEmail={user.email} />
                  <EditAllowanceModal
                    userId={user.id}
                    currentAllowance={user.monthlyAllowance}
                    userEmail={user.email}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
