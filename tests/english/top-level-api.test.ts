import {
  autoTag,
  manualTag,
  autoTagWithManual,
  extractAutoTags,
  getSupportedLanguages,
  getSupportedAutoTags,
  english,
} from '../../src/index';

/**
 * Public top-level API surface checks (TASK-12482)
 *
 * Until this PR the package-level `autoTag(text, { language: 'en' })` would
 * throw "Unsupported language: en" — the English module was implemented but
 * never registered in src/index.ts. These tests pin the English entry point
 * so we don't regress that wiring as new languages are added.
 */
describe('top-level API: English language module exposure', () => {
  it('lists English alongside Korean', () => {
    const langs = getSupportedLanguages();
    expect(langs).toContain('ko');
    expect(langs).toContain('en');
  });

  it('routes autoTag with { language: "en" } through the English module', () => {
    const out = autoTag('Call me at 555-123-4567.', { language: 'en' });
    // The exact phone phrasing is owned by the English phone handler; we just
    // pin "english got invoked, conversion happened" rather than the literal
    // spacing so refinements to phone formatting don't ripple here.
    expect(out).not.toBe('Call me at 555-123-4567.');
    expect(out).toContain('five five five');
  });

  it('routes money through the English handler', () => {
    expect(autoTag('Total: $1,234.56.', { language: 'en' })).toContain('dollars');
  });

  it('routes datetime/time through the English handler', () => {
    expect(autoTag('Meeting at 2:30 PM.', { language: 'en' })).toContain('two thirty PM');
  });

  it('exposes English manualTag', () => {
    // English manualTag should at minimum strip the name() wrapper.
    const out = manualTag('Hello, name(John).', { language: 'en' });
    expect(out).not.toContain('name(');
    expect(out).toContain('John');
  });

  it('exposes autoTagWithManual for English', () => {
    const out = autoTagWithManual('Order digits(1234) total $50.', { language: 'en' });
    expect(out).not.toContain('digits(');
    expect(out).toContain('dollars');
  });

  it('exposes extractAutoTags for English', () => {
    const tags = extractAutoTags('Call 555-123-4567 about $500.', { language: 'en' });
    expect(tags.length).toBeGreaterThan(0);
    const types = tags.map((t) => t.tagType);
    expect(types).toEqual(expect.arrayContaining(['phone']));
  });

  it('exposes getSupportedAutoTags for English', () => {
    const tags = getSupportedAutoTags('en');
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);
  });

  it('re-exports the English namespace for direct access', () => {
    expect(typeof english.autoTag).toBe('function');
    const out = english.autoTag('Wait 30 to 45 minutes.');
    expect(out).toContain('thirty to forty-five minutes');
  });

  it('keeps Korean as the default language', () => {
    const out = autoTag('전화번호는 010-1234-5678입니다.');
    // Korean is still the no-options default; we just check that the call did
    // not bail with "Unsupported language".
    expect(out).not.toBe('전화번호는 010-1234-5678입니다.');
  });
});
