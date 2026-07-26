import Link from "next/link";
import { BookOpen, Network, Route } from "lucide-react";
import { Container } from "@/components/ui/container";

const OUTCOMES = [
  {
    title: "Reusable materials",
    body: "Download templates and checklists you can apply immediately.",
    Icon: BookOpen,
    tone: "bg-sea-foam text-accent",
  },
  {
    title: "Structured guidance",
    body: "Clear development paths without classroom theatrics.",
    Icon: Route,
    tone: "bg-lichen/60 text-primary",
  },
  {
    title: "Professional network",
    body: "Partners and specialists ready to support your growth.",
    Icon: Network,
    tone: "bg-accent/10 text-accent",
  },
] as const;

type HomePracticalOutcomesProps = {
  academySlug: string;
};

/**
 * Editorial practical-outcomes section — fewer borders, more whitespace.
 */
export function HomePracticalOutcomes({
  academySlug,
}: HomePracticalOutcomesProps) {
  return (
    <section className="bg-surface">
      <Container className="space-y-10 py-section-mobile sm:py-section-tablet lg:py-section-desktop">
        <div className="max-w-2xl space-y-3">
          <h2 className="font-display text-3xl font-medium tracking-tight text-primary md:text-4xl">
            Learning you can put to work.
          </h2>
          <p className="text-lg leading-relaxed text-muted">
            Templates, checklists, guides, scripts, and downloadable materials
            designed for real situations.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {OUTCOMES.map(({ title, body, Icon, tone }) => (
            <article
              key={title}
              className="rounded-xl bg-sea-foam/70 p-7 shadow-sm ring-1 ring-border/50 transition-shadow hover:shadow-lg"
            >
              <span
                className={`inline-flex size-11 items-center justify-center rounded-lg ${tone}`}
              >
                <Icon className="size-5" strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-xl font-medium text-primary">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </article>
          ))}
        </div>

        <Link
          href={`/academy/${academySlug}/resources`}
          className="inline-flex text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Browse practical materials
        </Link>
      </Container>
    </section>
  );
}
