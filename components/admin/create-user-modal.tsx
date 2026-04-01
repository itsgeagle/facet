"use client";

import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { createUser } from "@/lib/db/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export function CreateUserModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    companyName: "",
    monthlyAllowance: "10",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleCreate() {
    setLoading(true);
    const result = await createUser({
      email: form.email,
      password: form.password,
      companyName: form.companyName || undefined,
      monthlyAllowance: parseInt(form.monthlyAllowance, 10) || 10,
    });

    if (!result.success) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success("User created successfully");
    setOpen(false);
    setForm({ email: "", password: "", companyName: "", monthlyAllowance: "10" });
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Create User
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="user@managediamonds.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Temporary Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name (optional)</Label>
            <Input
              id="companyName"
              name="companyName"
              placeholder="Acme Corp"
              value={form.companyName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyAllowance">Monthly Allowance (Carats)</Label>
            <Input
              id="monthlyAllowance"
              name="monthlyAllowance"
              type="number"
              min={0}
              value={form.monthlyAllowance}
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={handleCreate} disabled={loading || !form.email || !form.password}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
