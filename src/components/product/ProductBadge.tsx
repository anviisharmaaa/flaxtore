import { Badge } from "@/components/ui/Badge";

export function ProductBadge({ badge }: { badge?: string }) {
  if (!badge) return null;
  return <Badge tone="accent">{badge}</Badge>;
}
