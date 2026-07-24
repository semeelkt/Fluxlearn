"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  return (
    <section className="border-y rule bg-paper dark:bg-paper-dark">
      <div className="container py-20 flex flex-col items-center text-center max-w-xl mx-auto">
        <span className="issue-line mb-4">Correspondence</span>
        <h2 className="font-display text-[30px] italic font-medium mb-3">
          A quiet weekly note, worth reading.
        </h2>
        <p className="text-muted dark:text-muted-dark mb-8 leading-relaxed">
          One email a week — new articles, research, and a short editor&rsquo;s note. No noise, unsubscribe anytime.
        </p>
        {status === "idle" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStatus("sent");
            }}
            className="flex w-full gap-3"
          >
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 bg-transparent border-b rule pb-2 font-sans text-sm focus:outline-none focus:border-oxblood transition-colors placeholder:text-muted dark:placeholder:text-muted-dark"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark text-xs uppercase tracking-wide font-sans hover:bg-oxblood dark:hover:bg-oxblood-light transition-colors"
            >
              Subscribe
            </button>
          </form>
        ) : (
          <p className="font-sans text-sm text-oxblood">You&rsquo;re on the list. Welcome to Reliare.</p>
        )}
      </div>
    </section>
  );
}
