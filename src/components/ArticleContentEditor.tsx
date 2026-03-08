'use client';

import { useRef, useState } from 'react';
import {
  Bold,
  Italic,
  ImagePlus,
  Link2,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Code,
  Strikethrough,
  Underline,
  Type,
} from 'lucide-react';

const FONT_OPTIONS = [
  { value: 'var(--font-syne), system-ui, sans-serif', label: 'Syne' },
  { value: 'var(--font-instrument-serif), Georgia, serif', label: 'Instrument Serif' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
  { value: '"Times New Roman", Times, serif', label: 'Times' },
  { value: 'monospace', label: 'Monospace' },
  { value: 'cursive', label: 'Cursive' },
];

interface ArticleContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  showImageUpload?: boolean;
  required?: boolean;
}

export function ArticleContentEditor({
  value,
  onChange,
  placeholder,
  rows = 15,
  disabled = false,
  showImageUpload = true,
  required = true,
}: ArticleContentEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showFontMenu, setShowFontMenu] = useState(false);

  const insertAtCursor = (text: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newValue = value.slice(0, start) + text + value.slice(end);
    onChange(newValue);
    ta.focus();
    const newCursor = start + text.length;
    ta.setSelectionRange(newCursor, newCursor);
  };

  const wrapSelection = (before: string, after: string, emptyPlaceholder?: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = value;
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

  const insertAtLineStart = (prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newValue = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(newValue);
    ta.focus();
    ta.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
  };

  const applyFont = (fontFamily: string) => {
    setShowFontMenu(false);
    wrapSelection(
      `<span style="font-family: ${fontFamily}">`,
      '</span>',
      'texte'
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/articles/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur upload');
      const alt = prompt("Description de l'image (optionnel) :", file.name.replace(/\.[^.]+$/, ''));
      const markdown = `![${alt ?? ''}](${data.url})`;
      insertAtCursor(markdown);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de l'upload");
    }
  };

  const insertLink = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const linkText = selected || 'lien';
    const url = prompt('URL du lien :', 'https://');
    if (url === null) return;
    const replacement = `[${linkText}](${url})`;
    const newValue = value.slice(0, start) + replacement + value.slice(end);
    onChange(newValue);
    ta.focus();
    ta.setSelectionRange(start + replacement.length, start + replacement.length);
  };

  const insertList = () => insertAtLineStart('- ');
  const insertOrderedList = () => insertAtLineStart('1. ');
  const insertBlockquote = () => insertAtLineStart('> ');
  const insertHeading2 = () => insertAtLineStart('## ');
  const insertHeading3 = () => insertAtLineStart('### ');
  const insertCode = () => wrapSelection('`', '`', 'code');
  const insertCodeBlock = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const block = selected ? `\n\`\`\`\n${selected}\n\`\`\`\n` : '\n```\n\n```\n';
    const newValue = value.slice(0, start) + block + value.slice(end);
    onChange(newValue);
    ta.focus();
    ta.setSelectionRange(start + (selected ? 5 : 6), start + (selected ? 5 + selected.length : 6));
  };

  const btnClass = 'rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--accent)]/20 hover:text-[var(--accent)] disabled:opacity-50 disabled:pointer-events-none';

  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-[var(--card-border)] bg-[var(--glass)] px-2 py-1.5">
        {/* Police */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFontMenu((v) => !v)}
            disabled={disabled}
            className={`flex items-center gap-1 ${btnClass}`}
            title="Changer la police"
          >
            <Type size={16} />
            <span className="hidden text-xs sm:inline">Police</span>
          </button>
          {showFontMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowFontMenu(false)} aria-hidden />
              <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] rounded-xl border border-[var(--card-border)] bg-[var(--card)] py-1 shadow-xl">
                {FONT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => applyFont(opt.value)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--accent)]/20"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="mx-1 h-4 w-px bg-[var(--card-border)]" />
        {/* Formatage texte */}
        <button type="button" onClick={() => wrapSelection('**', '**', 'gras')} disabled={disabled} className={btnClass} title="Gras">
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => wrapSelection('*', '*', 'italique')} disabled={disabled} className={btnClass} title="Italique">
          <Italic size={16} />
        </button>
        <button type="button" onClick={() => wrapSelection('~~', '~~', 'barré')} disabled={disabled} className={btnClass} title="Barré">
          <Strikethrough size={16} />
        </button>
        <button type="button" onClick={() => wrapSelection('<u>', '</u>', 'souligné')} disabled={disabled} className={btnClass} title="Souligné">
          <Underline size={16} />
        </button>
        <button type="button" onClick={insertLink} disabled={disabled} className={btnClass} title="Lien">
          <Link2 size={16} />
        </button>
        <div className="mx-1 h-4 w-px bg-[var(--card-border)]" />
        {/* Titres et blocs */}
        <button type="button" onClick={insertHeading2} disabled={disabled} className={btnClass} title="Titre 2">
          <Heading2 size={16} />
        </button>
        <button type="button" onClick={insertHeading3} disabled={disabled} className={btnClass} title="Titre 3">
          <Heading3 size={16} />
        </button>
        <button type="button" onClick={insertBlockquote} disabled={disabled} className={btnClass} title="Citation">
          <Quote size={16} />
        </button>
        <button type="button" onClick={insertCode} disabled={disabled} className={btnClass} title="Code inline">
          <Code size={16} />
        </button>
        <button type="button" onClick={insertCodeBlock} disabled={disabled} className={btnClass} title="Bloc de code">
          <span className="font-mono text-xs">{"</>"}</span>
        </button>
        <div className="mx-1 h-4 w-px bg-[var(--card-border)]" />
        {/* Listes */}
        <button type="button" onClick={insertList} disabled={disabled} className={btnClass} title="Liste à puces">
          <List size={16} />
        </button>
        <button type="button" onClick={insertOrderedList} disabled={disabled} className={btnClass} title="Liste numérotée">
          <ListOrdered size={16} />
        </button>
        {showImageUpload && (
          <>
            <div className="mx-1 h-4 w-px bg-[var(--card-border)]" />
            <label className={`flex cursor-pointer items-center gap-1 ${btnClass}`}>
              <ImagePlus size={16} />
              <span className="text-sm">Image</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={disabled}
                className="hidden"
              />
            </label>
          </>
        )}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        className="w-full resize-y border-0 bg-transparent px-4 py-3 font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-0 disabled:opacity-50"
      />
    </div>
  );
}
