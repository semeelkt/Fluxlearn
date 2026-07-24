"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  Table as TableIcon,
  Code,
  Languages,
} from "lucide-react";

export function TiptapEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Begin writing your article…" }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "article-body min-h-[400px] focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = window.prompt("Link URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const insertArabic = () => {
    editor.chain().focus().insertContent('<span dir="rtl" class="arabic">النص هنا</span> ').run();
  };

  const Btn = ({
    onClick,
    active,
    label,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`p-2 rounded-sm hover:bg-oxblood/10 transition-colors ${
        active ? "text-oxblood bg-oxblood/10" : "text-ink/70 dark:text-ink-dark/70"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border rule">
      <div className="flex flex-wrap items-center gap-1 border-b rule px-2 py-2 bg-hairline/10">
        <Btn label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} strokeWidth={1.75} />
        </Btn>
        <Btn label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} strokeWidth={1.75} />
        </Btn>
        <Btn label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} strokeWidth={1.75} />
        </Btn>
        <Btn label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={16} strokeWidth={1.75} />
        </Btn>
        <Btn label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} strokeWidth={1.75} />
        </Btn>
        <Btn label="Bullet List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} strokeWidth={1.75} />
        </Btn>
        <Btn label="Numbered List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} strokeWidth={1.75} />
        </Btn>
        <Btn label="Code Block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code size={16} strokeWidth={1.75} />
        </Btn>
        <Btn label="Link" onClick={addLink}>
          <Link2 size={16} strokeWidth={1.75} />
        </Btn>
        <Btn label="Image" onClick={addImage}>
          <ImageIcon size={16} strokeWidth={1.75} />
        </Btn>
        <Btn
          label="Table"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          <TableIcon size={16} strokeWidth={1.75} />
        </Btn>
        <Btn label="Insert Arabic Text" onClick={insertArabic}>
          <Languages size={16} strokeWidth={1.75} />
        </Btn>
      </div>
      <div className="px-6 py-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
