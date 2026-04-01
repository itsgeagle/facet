import Link from "next/link";
import type { FeatureWithAuthor } from "@/lib/types";
import { ProductTagBadge } from "@/components/product-tag-badge";
import { StatusBadge } from "@/components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AllFeaturesTableProps {
  features: FeatureWithAuthor[];
}

export function AllFeaturesTable({ features }: AllFeaturesTableProps) {
  if (features.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-6 text-center">No features submitted yet.</p>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Funding</TableHead>
            <TableHead>Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((f) => (
            <TableRow key={f.id}>
              <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                <Link
                  href={`/dashboard/features/${f.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {f.title}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {f.author.companyName ?? f.author.email}
              </TableCell>
              <TableCell>
                <ProductTagBadge tag={f.productTag} />
              </TableCell>
              <TableCell>
                <StatusBadge status={f.status} />
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {f.caratCost != null
                  ? `${f.totalFunded} / ${f.caratCost} Carats`
                  : "—"}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(f.createdAt).toLocaleDateString("en-US", {
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
  );
}
