import {
  BookOpen,
  Compass,
  GraduationCap,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/cn";

const VALUE_ITEMS = [
  {
    label: "Practical programs",
    Icon: GraduationCap,
  },
  {
    label: "Career guidance",
    Icon: Compass,
  },
  {
    label: "Professional resources",
    Icon: BookOpen,
  },
  {
    label: "Partner network",
    Icon: Users,
  },
] as const;

type HomeValueStripProps = {
  className?: string;
};

/**
 * Restrained value strip below the hero. Supported product areas only (no CEU claim).
 */
export function HomeValueStrip({ className }: HomeValueStripProps) {
  return (
    <section
      className={cn("relative z-20 -mt-8 sm:-mt-10", className)}
      aria-label="Platform highlights"
    >
      <Container>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/80 bg-border/60 shadow-lg sm:grid-cols-4">
          {VALUE_ITEMS.map(({ label, Icon }) => (
            <li
              key={label}
              className="flex items-center gap-3 bg-surface px-4 py-4 sm:px-5 sm:py-5"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sea-foam text-accent">
                <Icon className="size-4" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="text-sm font-medium leading-snug text-primary">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
