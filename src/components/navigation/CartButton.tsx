"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { IconButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export function CartButton({ tone = "ink" }: { tone?: "ink" | "ivory" }) {
  const { itemCount, toggleCart } = useCart();

  return (
    <IconButton
      label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
      onClick={toggleCart}
      className={cn("relative", tone === "ivory" && "text-ivory hover:bg-ivory/10")}
    >
      <ShoppingBag size={20} strokeWidth={1.75} />
      {itemCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-ivory">
          {itemCount}
        </span>
      ) : null}
    </IconButton>
  );
}
