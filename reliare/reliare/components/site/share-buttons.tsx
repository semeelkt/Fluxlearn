"use client";

import { Twitter, Linkedin, Link2, Facebook } from "lucide-react";
import { useState } from "react";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="flex items-center gap-4 text-muted dark:text-muted-dark">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-oxblood transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter size={17} strokeWidth={1.5} />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-oxblood transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook size={17} strokeWidth={1.5} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-oxblood transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={17} strokeWidth={1.5} />
      </a>
      <button onClick={copyLink} className="hover:text-oxblood transition-colors" aria-label="Copy link">
        <Link2 size={17} strokeWidth={1.5} />
      </button>
      {copied && <span className="text-xs font-sans text-oxblood">Copied</span>}
    </div>
  );
}
