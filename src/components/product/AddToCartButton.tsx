"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";

export function AddToCartButton({ product, className }: { product: Product; className?: string }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  async function handleAdd() {
    const added = await addItem(product, quantity);
    if (added) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1600);
    }
  }

  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <QuantityStepper quantity={quantity} onChange={(q) => setQuantity(Math.max(1, q))} />
      <Button onClick={handleAdd} size="lg" className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          {justAdded ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Check size={16} strokeWidth={2.5} /> Added
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              Add to Bag
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
}
