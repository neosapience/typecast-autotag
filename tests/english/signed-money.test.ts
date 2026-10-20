import { autoTag, manualTag, extractAutoTags, english } from '../../src';

describe('signed currency amounts', () => {
  it.each([
    ['-$50', 'minus fifty dollars'],
    ['$-50', 'minus fifty dollars'],
    ['-50 USD', 'minus fifty dollars'],
    ['-£1', 'minus one pound'],
    ['-€0.01', 'minus one cent'],
    ['-¥50', 'minus fifty yen'],
    ['-₩50', 'minus fifty won'],
    ['-$1,234.56', 'minus one thousand two hundred and thirty-four dollars and fifty-six cents'],
    ['-$2.5 million', 'minus two point five million dollars'],
    ['-50 cents', 'minus fifty cents'],
  ])('reads the sign in %s through every entry point', (input, expected) => {
    expect(autoTag(input, { language: 'en' })).toBe(expected);
    expect(manualTag(`money(${input})`, { language: 'en' })).toBe(expected);
    expect(english.money(input)).toBe(expected);
    expect(extractAutoTags(input, { language: 'en' })).toEqual([
      { original: input, tagType: 'money', start: 0, end: input.length },
    ]);
  });

  it.each([
    ['costs 10-50 dollars', 'costs ten dollars to fifty dollars'],
    ['costs 5-$10 today', 'costs five dollars to ten dollars today'],
    ['5-€10', 'five euros to ten euros'],
    ['-10--5 euros', 'minus ten euros to minus five euros'],
    ['$5-10 dollars', 'five dollars to ten dollars'],
    ['1-2 million dollars', 'one million dollars to two million dollars'],
    ['$50-$100', 'fifty dollars to one hundred dollars'],
    ['-$50 to $100', 'minus fifty dollars to one hundred dollars'],
    ['-$100--$50', 'minus one hundred dollars to minus fifty dollars'],
    ['$-100~$-50', 'minus one hundred dollars to minus fifty dollars'],
  ])('distinguishes range separators from signs in %s', (input, expected) => {
    expect(autoTag(input, { language: 'en' })).toBe(expected);
  });

  it('preserves malformed signs in manual input', () => {
    expect(english.money('-$-50')).toBe('-$-50');
    expect(english.money('--50')).toBe('--50');
  });
});
