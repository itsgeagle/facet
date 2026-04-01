"use client";

import { useState } from "react";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { resetUserPassword } from "@/lib/db/user-actions";
import { Button } from "@/components/ui/button";

interface ResetPasswordButtonProps {
  userId: string;
  userEmail: string;
}

export function ResetPasswordButton({ userId, userEmail }: ResetPasswordButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setLoading(true);
    const result = await resetUserPassword(userId);
    if (!result.success) {
      toast.error(result.error);
    } else {
      toast.success(`Password reset email sent to ${userEmail}`);
    }
    setLoading(false);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleReset}
      disabled={loading}
      className="text-muted-foreground hover:text-foreground"
      title="Send password reset email"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <KeyRound className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}
