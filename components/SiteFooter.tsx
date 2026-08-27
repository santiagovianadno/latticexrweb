"use client";

import { GitHubLink } from "@/components/GitHubLink";
import { useSiteCopy } from "@/components/LocaleProvider";
import { CONTACT_EMAIL, ADVISOR_NAME } from "@/lib/site-copy";

export function SiteFooter() {
  const { footer } = useSiteCopy();

  return (
    <footer className="relative z-10 border-t border-border bg-background px-6 py-10 text-center">
      <div className="mb-6 flex justify-center">
        <GitHubLink variant="footer" />
      </div>
      <p className="text-sm text-muted">{footer.line}</p>
      <p className="mt-2 text-xs text-muted">
        {footer.advisorLabel}: {ADVISOR_NAME}
      </p>
      <p className="mt-3 text-sm">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-accent underline-offset-4 hover:underline"
        >
          {footer.contactLabel}: {CONTACT_EMAIL}
        </a>
      </p>
    </footer>
  );
}
