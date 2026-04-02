"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitFeature } from "@/lib/db/feature-actions";
import type { ProductTag } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TiptapEditor = dynamic(
  () => import("@/components/tiptap-editor").then((m) => m.TiptapEditor),
  { ssr: false, loading: () => <div className="h-[240px] rounded-lg border border-border bg-card animate-pulse" /> }
);

interface SubmitFeatureFormProps {
  tags: ProductTag[];
}

export function SubmitFeatureForm({ tags }: SubmitFeatureFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [productTagId, setProductTagId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productTagId) {
      toast.error("Please select a product");
      return;
    }
    if (!description || description === "{}") {
      toast.error("Please enter a description");
      return;
    }

    setLoading(true);

    const result = await submitFeature({ title, productTagId, description });

    if (!result.success) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success("Feature submitted for review");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Describe the feature in a few words"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={3}
          maxLength={200}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productTag">Product</Label>
        <Select value={productTagId} onValueChange={(v) => setProductTagId(v ?? "")}>
          <SelectTrigger id="productTag">
            <SelectValue>
              {(value: string | null) =>
                value ? (tags.find((t) => t.id === value)?.label ?? value) : "Select a product..."
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id}>
                {tag.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <TiptapEditor
          onUpdate={setDescription}
          placeholder="Describe the feature in detail..."
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          "Submit Feature"
        )}
      </Button>
    </form>
  );
}
