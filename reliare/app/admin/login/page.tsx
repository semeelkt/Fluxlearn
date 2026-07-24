"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Incorrect password.");
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="font-display text-3xl text-center mb-2">Reliare</div>
        <p className="issue-line text-center mb-10">Administrator Access</p>

        <label className="flex flex-col gap-2 mb-6">
          <span className="text-xs font-sans uppercase tracking-wide text-muted dark:text-muted-dark">
            Password
          </span>
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent border-b-2 border-ink dark:border-ink-dark pb-2 focus:outline-none focus:border-oxblood transition-colors"
          />
        </label>

        {error && <p className="text-sm text-oxblood mb-4">{error}</p>}

        <button
          disabled={loading}
          type="submit"
          className="w-full py-3 bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark text-xs uppercase tracking-wide font-sans hover:bg-oxblood transition-colors disabled:opacity-50"
        >
          {loading ? "Verifying…" : "Sign In"}
        </button>
      </form>
    </main>
  );
}
