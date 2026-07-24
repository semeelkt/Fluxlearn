"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Upload, Trash2, Search, FileText } from "lucide-react";

type MediaItem = { id: string; filename: string; url: string; type: string; folder?: string; size?: number };

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const res = await fetch("/api/admin/media");
    const data = await res.json();
    setItems(data.media ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    setError("");
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Upload failed.");
      }
    }
    setUploading(false);
    load();
  };

  const rename = async (item: MediaItem) => {
    const name = window.prompt("New filename", item.filename);
    if (!name) return;
    await fetch(`/api/admin/media/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: name }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    load();
  };

  const filtered = items.filter((i) => i.filename.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="issue-line">Assets</span>
          <h1 className="font-display text-3xl font-medium mt-2">Media Library</h1>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-5 py-2.5 bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark text-xs uppercase tracking-wide font-sans hover:bg-oxblood transition-colors disabled:opacity-50"
        >
          <Upload size={14} /> {uploading ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
      </div>

      {error && <p className="text-sm text-oxblood mb-6">{error}</p>}

      <div className="flex items-center gap-3 border-b rule pb-3 mb-8 max-w-sm">
        <Search size={16} className="text-muted dark:text-muted-dark" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files…"
          className="bg-transparent text-sm focus:outline-none flex-1"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="group">
            <div className="relative aspect-square bg-hairline/20 overflow-hidden border rule mb-2">
              {item.type === "image" ? (
                <Image src={item.url} alt={item.filename} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText size={28} className="text-muted dark:text-muted-dark" />
                </div>
              )}
              <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => rename(item)} className="text-paper text-xs underline">Rename</button>
                <button onClick={() => remove(item.id)} className="text-paper"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="text-xs truncate font-sans text-muted dark:text-muted-dark">{item.filename}</div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted dark:text-muted-dark mt-6">No files yet. Upload images or PDFs to use across articles and research papers.</p>
      )}
    </div>
  );
}
