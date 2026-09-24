"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
  type LucideIcon,
} from "lucide-react";

type ToolbarItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  active?: (editor: Editor) => boolean;
  disabled?: (editor: Editor) => boolean;
  run: (editor: Editor) => void;
};

const toolbarItems: ToolbarItem[] = [
  {
    id: "bold",
    label: "Bold",
    icon: Bold,
    active: (e) => e.isActive("bold"),
    run: (e) => e.chain().focus().toggleBold().run(),
  },
  {
    id: "italic",
    label: "Italic",
    icon: Italic,
    active: (e) => e.isActive("italic"),
    run: (e) => e.chain().focus().toggleItalic().run(),
  },
  {
    id: "strike",
    label: "Strikethrough",
    icon: Strikethrough,
    active: (e) => e.isActive("strike"),
    run: (e) => e.chain().focus().toggleStrike().run(),
  },
  {
    id: "h1",
    label: "Heading 1",
    icon: Heading1,
    active: (e) => e.isActive("heading", { level: 1 }),
    run: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    id: "h2",
    label: "Heading 2",
    icon: Heading2,
    active: (e) => e.isActive("heading", { level: 2 }),
    run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    id: "bullet",
    label: "Bullet list",
    icon: List,
    active: (e) => e.isActive("bulletList"),
    run: (e) => e.chain().focus().toggleBulletList().run(),
  },
  {
    id: "ordered",
    label: "Ordered list",
    icon: ListOrdered,
    active: (e) => e.isActive("orderedList"),
    run: (e) => e.chain().focus().toggleOrderedList().run(),
  },
  {
    id: "quote",
    label: "Blockquote",
    icon: Quote,
    active: (e) => e.isActive("blockquote"),
    run: (e) => e.chain().focus().toggleBlockquote().run(),
  },
  {
    id: "code",
    label: "Code block",
    icon: Code2,
    active: (e) => e.isActive("codeBlock"),
    run: (e) => e.chain().focus().toggleCodeBlock().run(),
  },
  {
    id: "undo",
    label: "Undo",
    icon: Undo2,
    disabled: (e) => !e.can().undo(),
    run: (e) => e.chain().focus().undo().run(),
  },
  {
    id: "redo",
    label: "Redo",
    icon: Redo2,
    disabled: (e) => !e.can().redo(),
    run: (e) => e.chain().focus().redo().run(),
  },
];

type BlogEditorProps = {
  initialContent?: string;
  onChange: (html: string) => void;
};

export default function BlogEditor({ initialContent = "", onChange }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing…",
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-300 text-sm text-zinc-500 dark:border-zinc-700">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="admin-editor overflow-hidden rounded-xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-black">
      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-zinc-100 p-2 dark:border-zinc-800 dark:bg-zinc-900">
        {toolbarItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active ? item.active(editor) : false;
          const isDisabled = item.disabled ? item.disabled(editor) : false;
          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              disabled={isDisabled}
              onClick={() => item.run(editor)}
              className={`rounded-lg p-2 transition disabled:cursor-not-allowed disabled:opacity-40 ${
                isActive
                  ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              }`}
            >
              <Icon size={17} />
            </button>
          );
        })}
      </div>
      <EditorContent editor={editor} className="min-h-64 px-4 py-3" />
    </div>
  );
}