import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/**
 * RE-Quest wordmark. logo-white.png has large transparent padding,
 * so we scale it inside a clipped frame to fill the navbar height.
 */
export function BrandLogo({
  className,
  priority,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative block h-12 w-44 overflow-hidden sm:h-14 sm:w-56",
        className,
      )}
    >
      <Image
        src="/brand/re-quest/logo-white.png"
        alt="RE-Quest"
        width={2917}
        height={2084}
        className="absolute left-1/2 top-1/2 h-[280%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
        priority={priority}
      />
    </span>
  );
}
