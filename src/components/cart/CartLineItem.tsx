import { X } from "lucide-react";
import Image from "next/image";
import type { CartLine } from "@/types/commerce";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatPrice } from "@/lib/utils/currency";

export function CartLineItem({
  line,
  onUpdateQuantity,
  onRemove,
}: {
  line: CartLine;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-4 py-5">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-cream">
        {line.image ? (
          <Image src={line.image} alt="" fill sizes="80px" className="object-cover" />
        ) : (
          <PlaceholderImage accent={line.accent} />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-ink">{line.name}</p>
            <p className="text-xs text-ink-muted">
              {line.flavour} · {line.weight}
            </p>
          </div>
          <button
            type="button"
            aria-label={`Remove ${line.name} from cart`}
            onClick={onRemove}
            className="text-ink-faint transition-colors hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <QuantityStepper size="sm" quantity={line.quantity} onChange={onUpdateQuantity} />
          <span className="text-sm font-semibold text-ink">
            {formatPrice(line.price * line.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
