"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  content?: string;
  onUpdate: (json: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onUpdate, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content ? (JSON.parse(content) as object) : undefined,
    onUpdate({ editor }) {
      onUpdate(JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] px-4 py-3 text-sm text-foreground focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  const toolbarBtn = (active: boolean) =>
    cn(
      "p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
      active && "bg-muted text-foreground"
    );

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-0.5 border-b border-border px-2 py-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toolbarBtn(editor.isActive("bold"))}
          title="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={toolbarBtn(editor.isActive("italic"))}
          title="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={toolbarBtn(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={toolbarBtn(editor.isActive("heading", { level: 3 }))}
          title="Heading 3"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toolbarBtn(editor.isActive("bulletList"))}
          title="Bullet list"
        >
          <List className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toolbarBtn(editor.isActive("orderedList"))}
          title="Ordered list"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
      </div>

      {!editor.getText() && placeholder && !editor.isFocused && (
        <p className="absolute pointer-events-none px-4 py-3 text-sm text-muted-foreground">
          {placeholder}
        </p>
      )}

      <EditorContent
        editor={editor}
        className="prose prose-invert prose-sm max-w-none [&_.tiptap]:min-h-[200px]"
      />
    </div>
  );
}
