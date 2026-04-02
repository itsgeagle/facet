"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductTagBadge } from "@/components/product-tag-badge";
import {
  createProductTag,
  updateProductTag,
  deleteProductTag,
  updateTagSortOrder,
} from "@/lib/db/tags";
import type { ProductTag } from "@/lib/types";
import { cn } from "@/lib/utils";

const COLOR_OPTIONS = [
  { label: "Slate",  value: "bg-slate-600 text-slate-100" },
  { label: "Gray",   value: "bg-gray-600 text-gray-100" },
  { label: "Red",    value: "bg-red-600 text-red-100" },
  { label: "Orange", value: "bg-orange-600 text-orange-100" },
  { label: "Amber",  value: "bg-amber-600 text-amber-100" },
  { label: "Green",  value: "bg-green-600 text-green-100" },
  { label: "Teal",   value: "bg-teal-600 text-teal-100" },
  { label: "Cyan",   value: "bg-cyan-600 text-cyan-100" },
  { label: "Blue",   value: "bg-blue-600 text-blue-100" },
  { label: "Indigo", value: "bg-indigo-600 text-indigo-100" },
  { label: "Purple", value: "bg-purple-600 text-purple-100" },
  { label: "Pink",   value: "bg-pink-600 text-pink-100" },
];

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface TagFormState {
  label: string;
  value: string;
  color: string;
  description: string;
  isActive: boolean;
}

const DEFAULT_FORM: TagFormState = {
  label: "",
  value: "",
  color: "bg-blue-600 text-blue-100",
  description: "",
  isActive: true,
};

function tagToForm(tag: ProductTag): TagFormState {
  return {
    label: tag.label,
    value: tag.value,
    color: tag.color,
    description: tag.description ?? "",
    isActive: tag.isActive,
  };
}

interface TagDialogProps {
  tag?: ProductTag;
  trigger: React.ReactElement;
  onSaved: (tag: ProductTag) => void;
}

function TagDialog({ tag, trigger, onSaved }: TagDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<TagFormState>(tag ? tagToForm(tag) : DEFAULT_FORM);
  const [loading, setLoading] = useState(false);

  function handleOpenChange(v: boolean) {
    if (!v && !tag) setForm(DEFAULT_FORM);
    setOpen(v);
  }

  function handleLabelBlur() {
    if (!tag && !form.value) {
      setForm((f) => ({ ...f, value: slugify(f.label) }));
    }
  }

  async function handleSave() {
    if (!form.label.trim() || !form.value.trim()) {
      toast.error("Label and value are required");
      return;
    }
    setLoading(true);
    const result = tag
      ? await updateProductTag(tag.id, form)
      : await createProductTag(form);

    if (!result.success) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success(tag ? "Tag updated" : "Tag created");
    onSaved(result.data!);
    setOpen(false);
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tag ? "Edit Tag" : "Add Tag"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="tag-label">Label</Label>
            <Input
              id="tag-label"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              onBlur={handleLabelBlur}
              placeholder="e.g. White Diamonds"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-value">Value (slug, must be unique)</Label>
            <Input
              id="tag-value"
              value={form.value}
              onChange={(e) =>
                setForm((f) => ({ ...f, value: e.target.value.toLowerCase().replace(/\s+/g, "-") }))
              }
              placeholder="e.g. white-diamonds"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  title={opt.label}
                  className={cn(
                    "h-7 rounded-md transition-all",
                    opt.value,
                    form.color === opt.value
                      ? "ring-2 ring-white ring-offset-2 ring-offset-background scale-110"
                      : "opacity-60 hover:opacity-100"
                  )}
                  onClick={() => setForm((f) => ({ ...f, color: opt.value }))}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">Preview:</span>
              <ProductTagBadge tag={{ label: form.label || "Sample", color: form.color }} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-description">Description (optional)</Label>
            <Textarea
              id="tag-description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Shown on the feature submission form..."
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
              className={cn(
                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none",
                form.isActive ? "bg-primary" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform",
                  form.isActive ? "translate-x-4" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteDialogProps {
  tag: ProductTag;
  onDeleted: (id: string) => void;
}

function DeleteDialog({ tag, onDeleted }: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const result = await deleteProductTag(tag.id);
    if (!result.success) {
      toast.error(result.error);
      setLoading(false);
      return;
    }
    toast.success("Tag deleted");
    onDeleted(tag.id);
    setOpen(false);
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Tag</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground py-2">
          Delete <span className="font-medium text-foreground">{tag.label}</span>? This cannot be undone.
        </p>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface SortableRowProps {
  tag: ProductTag;
  featureCount: number;
  onSaved: (tag: ProductTag) => void;
  onDeleted: (id: string) => void;
}

function SortableRow({ tag, featureCount, onSaved, onDeleted }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tag.id,
  });

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <TableCell className="w-8">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell>
        <ProductTagBadge tag={tag} />
      </TableCell>
      <TableCell className="text-muted-foreground text-sm font-mono">{tag.value}</TableCell>
      <TableCell>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            tag.isActive
              ? "bg-emerald-600/20 text-emerald-400"
              : "bg-muted text-muted-foreground"
          )}
        >
          {tag.isActive ? "Active" : "Inactive"}
        </span>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">{featureCount}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <TagDialog
            tag={tag}
            trigger={
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            }
            onSaved={onSaved}
          />
          {featureCount === 0 && <DeleteDialog tag={tag} onDeleted={onDeleted} />}
        </div>
      </TableCell>
    </TableRow>
  );
}

interface ProductTagsTabProps {
  initialTags: ProductTag[];
  featureCounts: Record<string, number>;
}

export function ProductTagsTab({ initialTags, featureCounts }: ProductTagsTabProps) {
  const [tags, setTags] = useState(initialTags);
  const [savingOrder, setSavingOrder] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tags.findIndex((t) => t.id === active.id);
    const newIndex = tags.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(tags, oldIndex, newIndex);
    setTags(reordered);

    setSavingOrder(true);
    const result = await updateTagSortOrder(reordered.map((t) => t.id));
    if (!result.success) toast.error("Failed to save order");
    setSavingOrder(false);
  }

  function handleSaved(updated: ProductTag) {
    setTags((prev) => {
      const idx = prev.findIndex((t) => t.id === updated.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [...prev, updated];
    });
  }

  function handleDeleted(id: string) {
    setTags((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Product Tags ({tags.length})
          {savingOrder && (
            <span className="ml-2 text-xs text-muted-foreground font-normal">Saving order…</span>
          )}
        </h2>
        <TagDialog
          trigger={
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Tag
            </Button>
          }
          onSaved={handleSaved}
        />
      </div>

      {tags.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">No product tags yet.</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Label</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={tags.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {tags.map((tag) => (
                    <SortableRow
                      key={tag.id}
                      tag={tag}
                      featureCount={featureCounts[tag.id] ?? 0}
                      onSaved={handleSaved}
                      onDeleted={handleDeleted}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </div>
      )}
    </div>
  );
}
