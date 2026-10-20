export function convertInput(text: string, convert: (text: string) => string) {
  try {
    return { text: convert(text), error: false };
  } catch {
    return { text: '', error: true };
  }
}
