/** URLs and code are data, not pronunciation candidates. Keep original offsets. */
export function protectedRanges(text: string): Array<{ start: number; end: number }> {
  const pattern = /```[\s\S]*?(?:```|$)|`[^`\n]*(?:`|$)|(?:https?:\/\/|www\.)[^\s<>`]+/gi;
  const ranges: Array<{ start: number; end: number }> = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    ranges.push({ start: match.index, end: match.index + match[0].length });
  }
  return ranges;
}

export function protectText(text: string, convert: (part: string) => string): string | null {
  const ranges = protectedRanges(text);
  if (!ranges.length) return null;
  let result = '';
  let cursor = 0;
  for (const { start, end } of ranges) {
    result += convert(text.slice(cursor, start)) + text.slice(start, end);
    cursor = end;
  }
  return result + convert(text.slice(cursor));
}

export function extractOutsideProtected<T extends { start: number; end: number }>(
  text: string,
  extract: (part: string) => T[]
): T[] | null {
  const ranges = protectedRanges(text);
  if (!ranges.length) return null;
  const result: T[] = [];
  let cursor = 0;
  for (const range of [...ranges, { start: text.length, end: text.length }]) {
    for (const match of extract(text.slice(cursor, range.start))) {
      result.push({ ...match, start: match.start + cursor, end: match.end + cursor });
    }
    cursor = range.end;
  }
  return result;
}
