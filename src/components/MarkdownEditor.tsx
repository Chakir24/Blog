'use client';

import { useRef } from 'react';
import { Bold, Italic, Link2, List } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function MarkdownEditor({ value, onChange, placeholder, rows = 4, className = '' }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = (before: string, after: string, emptyPlaceholder?: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = ta.value;
    const selected = text.slice(start, end);
    const replacement = selected
      ? `${before}${selected}${after}`
      : `${before}${emptyPlaceholder ?? ''}${after}`;
    const newValue = text.slice(0, start) + replacement + text.slice(end);
    onChange(newValue);
    ta.focus();
    const newCursor = start + before.length + (selected ? selected.length : (emptyPlaceholder ?? '').length);
    ta.setSelectionRange(newCursor, newCursor);
  };

  const insertLink = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = ta.value;
    const selected = text.slice(start, end);
    const linkText = selected || 'lien';
    const url = prompt('URL du lien :', 'https://');
    if (url === null) return;
    const replacement = `[${linkText}](${url})`;
    const newValue = text.slice(0, start) + replacement + text.slice(end);
    onChange(newValue);
    ta.focus();
    ta.setSelectionRange(start + replacement.length, start + replacement.length);
  };

  const insertList = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const text = ta.value;
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const newValue = text.slice(0, lineStart) + '- ' + text.slice(lineStart);
    onChange(newValue);
    ta.focus();
    ta.setSelectionRange(lineStart + 2, lineStart + 2);
  };

  return (
    <div className={`rounded-xl border border-[var(--card-border)] bg-[var(--background)] overflow-hidden ${className}`}>
      <div className="flex items-center gap-1 border-b border-[var(--card-border)] bg-[var(--glass)] px-2 py-1.5">
        <button
          type="button"
          onClick={() => wrapSelection('**', '**', 'gras')}
          className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--accent)]/20 hover:text-[var(--accent)]"
          title="Gras"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => wrapSelection('*', '*', 'italique')}
          className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--accent)]/20 hover:text-[var(--accent)]"
          title="Italique"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={insertLink}
          className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--accent)]/20 hover:text-[var(--accent)]"
          title="Lien"
        >
          <Link2 size={16} />
        </button>
        <button
          type="button"
          onClick={insertList}
          className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--accent)]/20 hover:text-[var(--accent)]"
          title="Liste"
        >
          <List size={16} />
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y border-0 bg-transparent px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-0"
      />
    </div>
  );
}
