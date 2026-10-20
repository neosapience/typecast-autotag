type PreparedPattern = RegExp & {
  numericMatcher?: { regex: RegExp; endsInDigit: RegExp; continuesNumber: RegExp };
};

/** Scan only at numeric boundaries instead of retrying at every digit of a long number. */
export function patternMatches(
  text: string,
  pattern: PreparedPattern
): Array<{ original: string; start: number }> {
  let compiled = pattern.numericMatcher;
  if (!compiled) {
    const digits = pattern.unicode ? '\\p{Nd}' : '\\d';
    const punctuation = pattern.unicode ? ".,٬٫'’\\u00a0\\u202f" : '.,';
    compiled = {
      regex: new RegExp(
        `(^|[^${digits}${punctuation}]|(?:^|[^${digits}])[${punctuation}])(?!,)(${pattern.source})`,
        pattern.flags
      ),
      endsInDigit: new RegExp(`[${digits}]$`, pattern.unicode ? 'u' : ''),
      continuesNumber: new RegExp(
        `^(?:[${digits}]|[${punctuation}][${digits}])`,
        pattern.unicode ? 'u' : ''
      ),
    };
    pattern.numericMatcher = compiled;
  }
  const { regex, endsInDigit, continuesNumber } = compiled;
  regex.lastIndex = 0;
  const matches: Array<{ original: string; start: number }> = [];
  let end = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const original = match[2] ?? '';
    const start = match.index + (match[1]?.length ?? 0);
    if (original && start >= end) {
      end = start + original.length;
      if (!endsInDigit.test(original) || !continuesNumber.test(text.slice(end, end + 2))) {
        matches.push({ original, start });
      }
    }
    // Reuse up to two boundary characters without returning overlapping matches.
    const next =
      match.index + (pattern.unicode && (text.codePointAt(match.index) ?? 0) > 0xffff ? 2 : 1);
    regex.lastIndex = Math.max(next, end - 2);
  }
  return matches;
}
