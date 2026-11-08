import { siteConfig } from "@/lib/content";
import { SocialIcon } from "./icons";

export function SocialLinks({ variant = "icons" }: { variant?: "icons" | "buttons" }) {
  return (
    <ul className={`flex flex-wrap ${variant === "buttons" ? "gap-3" : "gap-1"}`}>
      {siteConfig.social.map((s) => (
        <li key={s.platform}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${s.platform} (opens in a new tab)`}
            className={
              variant === "buttons"
                ? "btn btn-secondary"
                : "inline-flex h-11 w-11 items-center justify-center rounded-md text-ink hover:bg-wash"
            }
          >
            <SocialIcon platform={s.platform} />
            {variant === "buttons" && <span>{s.platform}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
