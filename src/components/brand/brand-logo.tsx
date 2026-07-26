import Image from "next/image";
import { cn } from "@/lib/utils/cn";

const LOGO_SRC = {
  white: "/brand/re-quest/logo-white.png",
  navy: "/brand/re-quest/logo-navy.png",
} as const;

/**
 * RE-Quest wordmark. Source files include large transparent padding,
 * so we scale inside a clipped frame to fill the navbar height.
 * Do not stretch, recolor, or add effects to the logo.
 */
export function BrandLogo({
  className,
  priority,
  variant = "white",
}: {
  className?: string;
  priority?: boolean;
  /** Use navy on light surfaces; white on dark chrome. */
  variant?: keyof typeof LOGO_SRC;
}) {
  return (
    <span
      className={cn(
        "relative block h-12 w-44 overflow-hidden sm:h-14 sm:w-56",
        className,
      )}
    >
      <Image
        src={LOGO_SRC[variant]}
        alt="RE-Quest"
        width={2917}
        height={2084}
        className="absolute left-1/2 top-1/2 h-[280%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
        priority={priority}
      />
    </span>
  );
}
