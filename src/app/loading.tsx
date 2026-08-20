import { BrandMark } from "@/components/brand/BrandMark";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="animate-pulse">
        <BrandMark size={40} className="opacity-60" />
      </div>
    </div>
  );
}
