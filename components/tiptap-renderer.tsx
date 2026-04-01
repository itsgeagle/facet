import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/react";

interface TiptapRendererProps {
  content: string;
  className?: string;
}

export function TiptapRenderer({ content, className }: TiptapRendererProps) {
  let html = "";
  try {
    const json = JSON.parse(content) as JSONContent;
    html = generateHTML(json, [StarterKit]);
  } catch {
    html = `<p>${content}</p>`;
  }

  return (
    <div
      className={`prose prose-invert prose-sm max-w-none ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
