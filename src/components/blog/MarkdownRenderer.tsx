import React from "react";
import Link from "next/link";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Split into blocks: code blocks or regular paragraphs
  const lines = content.trim().split("\n");
  const blocks: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";
  let listBuffer: string[] = [];
  let isNumberedList = false;

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return null;
    const items = listBuffer.map((item, idx) => (
      <li key={idx} className="leading-relaxed">
        {renderInline(item)}
      </li>
    ));
    const listEl = isNumberedList ? (
      <ol key={key} className="my-5 ml-6 list-decimal space-y-2 text-slate-700 font-body text-sm sm:text-base">
        {items}
      </ol>
    ) : (
      <ul key={key} className="my-5 ml-6 list-disc space-y-2 text-slate-700 font-body text-sm sm:text-base marker:text-[#245FD4]">
        {items}
      </ul>
    );
    listBuffer = [];
    isNumberedList = false;
    return listEl;
  };

  const renderInline = (text: string): React.ReactNode => {
    // Process bold, inline code, and links
    const parts: React.ReactNode[] = [];
    // Regular expression matching **bold**, `code`, [link](url)
    const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const token = match[0];
      if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={match.index} className="font-bold text-slate-900">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code
            key={match.index}
            className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-[#245FD4] border border-slate-200/80"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith("[")) {
        const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const linkText = linkMatch[1];
          const linkHref = linkMatch[2];
          const isExternal = linkHref.startsWith("http");
          parts.push(
            isExternal ? (
              <a
                key={match.index}
                href={linkHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#245FD4] underline underline-offset-2 hover:text-[#1746A2]"
              >
                {linkText}
              </a>
            ) : (
              <Link
                key={match.index}
                href={linkHref}
                className="font-semibold text-[#245FD4] underline underline-offset-2 hover:text-[#1746A2]"
              >
                {linkText}
              </Link>
            )
          );
        }
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check code fence
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        // Flush code block
        blocks.push(
          <div key={`code-${i}`} className="my-6 overflow-hidden rounded-2xl border border-slate-800 bg-[#0A1224] text-slate-100 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2 bg-[#060D1A] text-xs font-mono text-slate-400">
              <span>{codeLang || "code"}</span>
              <span className="text-[10px] text-slate-500">Read-Only</span>
            </div>
            <pre className="overflow-x-auto p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed text-slate-200">
              <code>{codeBuffer.join("\n")}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
        codeLang = "";
      } else {
        const flushed = flushList(`list-before-code-${i}`);
        if (flushed) blocks.push(flushed);
        inCodeBlock = true;
        codeLang = line.replace("```", "").trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // List item (bullet or numbered)
    const isBulletItem = line.startsWith("* ") || line.startsWith("- ");
    const isNumberItem = /^\d+\.\s/.test(line);

    if (isBulletItem || isNumberItem) {
      if (isNumberItem && !isNumberedList && listBuffer.length === 0) {
        isNumberedList = true;
      }
      const itemText = isBulletItem ? line.slice(2) : line.replace(/^\d+\.\s/, "");
      listBuffer.push(itemText);
      continue;
    } else if (listBuffer.length > 0 && line.length === 0) {
      const flushed = flushList(`list-${i}`);
      if (flushed) blocks.push(flushed);
      continue;
    }

    // Blank line
    if (!line) continue;

    // Horizontal Rule
    if (line === "---" || line === "***") {
      const flushed = flushList(`list-before-hr-${i}`);
      if (flushed) blocks.push(flushed);
      blocks.push(
        <hr key={`hr-${i}`} className="my-10 border-t border-slate-200/90" />
      );
      continue;
    }

    // Headings
    if (line.startsWith("# ")) {
      // Top H1: skip if rendered in hero, or render as page title
      continue;
    }

    if (line.startsWith("## ")) {
      const flushed = flushList(`list-before-h2-${i}`);
      if (flushed) blocks.push(flushed);
      blocks.push(
        <h2
          key={`h2-${i}`}
          className="mt-12 mb-4 font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-[#101B30]"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          {renderInline(line.slice(3))}
        </h2>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      const flushed = flushList(`list-before-h3-${i}`);
      if (flushed) blocks.push(flushed);
      blocks.push(
        <h3
          key={`h3-${i}`}
          className="mt-8 mb-3 font-heading text-xl sm:text-2xl font-medium tracking-tight text-[#101B30]"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          {renderInline(line.slice(4))}
        </h3>
      );
      continue;
    }

    // Paragraph
    const flushed = flushList(`list-before-p-${i}`);
    if (flushed) blocks.push(flushed);

    blocks.push(
      <p
        key={`p-${i}`}
        className="my-4 font-body text-base sm:text-[17px] leading-[1.8] text-[#334155]"
        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
      >
        {renderInline(line)}
      </p>
    );
  }

  // Final list flush
  const finalFlushed = flushList("list-final");
  if (finalFlushed) blocks.push(finalFlushed);

  return <div className="prose-clean max-w-none">{blocks}</div>;
}
