/**
 * Layer A — PDF text normalization
 * Join broken lines, normalize whitespace, preserve "label: value" patterns.
 * Makes regex extraction more reliable when PDF text is split across lines.
 */

export interface NormalizedLine {
  /** Merged text for this logical line */
  text: string;
  /** Original start index in raw text (for debugging) */
  start: number;
  /** Original end index in raw text (for debugging) */
  end: number;
}

export interface NormalizedResult {
  /** Single string: normalized text (joined lines, clean whitespace) */
  text: string;
  /** Original positions per logical line, if requested */
  lines: NormalizedLine[];
  /** Raw length before normalization */
  rawLength: number;
}

const LABEL_VALUE_PATTERN = /^[\s]*([A-Za-z][A-Za-z0-9\s\-\.]*?)\s*[:=]\s*[\s]*/;

/**
 * Heuristic: is this line likely a continuation of the previous?
 * - Current line doesn't look like a new block (no "Label:" at start)
 * - Previous line didn't end with sentence-ending punctuation
 * - Or current line starts with lowercase / digit / common continuation
 */
function isLikelyContinuation(
  line: string,
  prevLine: string,
  nextLine: string | undefined
): boolean {
  const t = line.trim();
  const prev = prevLine.trim();
  if (!t) return true; // empty = continuation for merging
  // Already looks like "Label: value" → don't merge with previous
  if (LABEL_VALUE_PATTERN.test(t) && prev && !LABEL_VALUE_PATTERN.test(prev)) return false;
  // Previous ends with . ? ! or : (often label) → next might be value
  if (/[.?!]\s*$/.test(prev) || (prev.endsWith(":") && t.length > 2)) return false;
  // Current starts with uppercase and looks like a new label
  if (/^[A-Z][a-z]+\s*[:=]/.test(t)) return false;
  // Number at start of line often starts a new row (table)
  if (/^\d+[\s,.]/.test(t)) return false;
  return true;
}

/**
 * Normalize raw PDF text:
 * 1. Join broken lines (continuation heuristic)
 * 2. Normalize whitespace (collapse, trim)
 * 3. Preserve "label: value" by not breaking on newline between label and value
 */
export function normalizePdfText(raw: string, keepPositions = false): NormalizedResult {
  if (!raw || typeof raw !== "string") {
    return { text: "", lines: [], rawLength: 0 };
  }

  const rawLength = raw.length;
  const lines = raw.split(/\r?\n/).map((l) => l.trimEnd());
  const merged: NormalizedLine[] = [];
  let i = 0;
  let currentStart = 0;
  const positions: number[] = []; // start index of each original line
  let pos = 0;
  for (const line of lines) {
    positions.push(pos);
    pos += line.length + 1; // +1 for newline
  }

  while (i < lines.length) {
    let logical = lines[i];
    let lineStart = positions[i] ?? 0;
    let lineEnd = lineStart + logical.length;

    i += 1;
    while (i < lines.length && isLikelyContinuation(lines[i], logical, lines[i + 1])) {
      const next = lines[i];
      const nextStart = positions[i] ?? lineEnd;
      logical = logical + " " + next.trim();
      lineEnd = nextStart + next.length;
      i += 1;
    }

    merged.push({
      text: logical.trim(),
      start: lineStart,
      end: lineEnd,
    });
  }

  // Build single normalized string: join logical lines with newline, then collapse internal whitespace
  const single = merged
    .map((l) => l.text.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");

  // Optional: one more pass to collapse multiple newlines into one and trim
  const text = single.replace(/\n{2,}/g, "\n").trim();

  return {
    text,
    lines: keepPositions ? merged : [],
    rawLength,
  };
}
