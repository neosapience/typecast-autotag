import { protectText } from './utils/protected-text';
import { assertInputWithinLimit } from './input-guard';

export function combineTags(
  text: string,
  autoTag: (text: string) => string,
  manualTag: (text: string) => string,
  extractTags: (text: string) => Array<{ start: number; end: number }>
): string {
  if (!text) return text;
  assertInputWithinLimit(text, 'autoTagWithManual');
  const protectedResult = protectText(text, (part) =>
    combineTags(part, autoTag, manualTag, extractTags)
  );
  if (protectedResult !== null) return protectedResult;
  let result = '';
  let cursor = 0;
  // Preserve explicit readings and keep each automatic pass within the original input limit.
  for (const tag of extractTags(text)) {
    result += autoTag(text.slice(cursor, tag.start));
    result += manualTag(text.slice(tag.start, tag.end));
    cursor = tag.end;
  }
  return result + autoTag(text.slice(cursor));
}
