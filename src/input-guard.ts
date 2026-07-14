export const MAX_INPUT_LENGTH = 10000;

export function assertInputWithinLimit(text: string, functionName: string): void {
  if (text.length > MAX_INPUT_LENGTH) {
    throw new RangeError(
      `${functionName} input exceeds ${MAX_INPUT_LENGTH} characters. ` +
        'Split long text before calling typecast-autotag.'
    );
  }
}
