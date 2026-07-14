import {
  autoTag,
  autoTagWithManual,
  extractAutoTags,
  SUPPORTED_AUTO_TAGS,
} from '../../../src/english/auto-tag';

describe('autoTag core functionality', () => {
  describe('basic behavior', () => {
    it('returns empty string as-is', () => {
      expect(autoTag('')).toBe('');
    });

    it('returns falsy values like null/undefined as-is', () => {
      expect(autoTag(null as unknown as string)).toBe(null);
      expect(autoTag(undefined as unknown as string)).toBe(undefined);
    });

    it('returns original when no taggable patterns found', () => {
      expect(autoTag('Hello there')).toBe('Hello there');
      expect(autoTag('Good morning')).toBe('Good morning');
    });
  });

  describe('enabledTags option', () => {
    it('can enable only specific tags', () => {
      const text = 'Call: 555-123-4567, Amount: $50';

      // phone only enabled
      const phoneResult = autoTag(text, { enabledTags: ['phone'] });
      expect(phoneResult).toContain('five five five');
      expect(phoneResult).toContain('$50');

      // money only enabled
      const moneyResult = autoTag(text, { enabledTags: ['money'] });
      expect(moneyResult).toContain('555-123-4567');
      expect(moneyResult).toContain('fifty dollars');
    });

    it('can enable multiple tags', () => {
      const text = 'Call: 555-123-4567, Amount: $50';
      const result = autoTag(text, { enabledTags: ['phone', 'money'] });

      expect(result).toContain('five five five');
      expect(result).toContain('fifty dollars');
    });

    it('converts nothing with empty array', () => {
      const text = 'Call: 555-123-4567';
      expect(autoTag(text, { enabledTags: [] })).toBe(text);
    });
  });

  describe('overlapping match prevention', () => {
    it('prioritizes longer matches over shorter ones', () => {
      // datetime should take priority over date + time
      const text = '2024-01-15T14:30';
      const result = autoTag(text);

      // Should be processed as datetime all at once
      expect(result).toContain('January');
      expect(result).toContain('fifteen');
    });

    it('processes sequentially matched patterns', () => {
      const text = '555-123-4567 for $50 deposit';
      const result = autoTag(text, { enabledTags: ['phone', 'money'] });

      expect(result).toContain('five five five');
      expect(result).toContain('fifty dollars');
    });
  });

  describe('complex sentence handling', () => {
    it('handles sentences with multiple tag types', () => {
      const text = '2024-01-15T14:30 call 555-123-4567 for $500 payment';
      const result = autoTag(text);

      expect(result).toContain('January');
      expect(result).toContain('five five five');
      expect(result).toContain('five hundred dollars');
    });

    it('handles multiple occurrences of same tag type', () => {
      const text = 'Phone1: 555-111-2222, Phone2: 555-333-4444';
      const result = autoTag(text, { enabledTags: ['phone'] });

      expect(result).toContain('one one one');
      expect(result).toContain('three three three');
    });
  });

  describe('punctuation and notation edge cases', () => {
    it('handles labels, scores, hashtags, and Roman numerals', () => {
      expect(autoTag('No. 8 is available')).toBe('Number eight is available');
      expect(autoTag('The match ended 4:2')).toBe('The match ended four to two');
      expect(autoTag('#BuildTogether starts today')).toBe('hashtag Build Together starts today');
      expect(autoTag('Part IX starts here')).toBe('Part nine starts here');
    });

    it('handles decimal weights and en-dash page ranges without partial matches', () => {
      expect(autoTag('The parcel weighs 2,345.67 grams')).toBe(
        'The parcel weighs two thousand three hundred and forty-five point six seven grams'
      );
      expect(autoTag('Review pages 8–12 before class')).toBe(
        'Review pages eight to twelve before class'
      );
    });

    it('distinguishes contextual scores from clock times', () => {
      expect(autoTag('Final score was 2:10.')).toBe('Final score was two to ten.');
      expect(autoTag('Meet at 2:10.')).toBe('Meet at two ten AM.');
    });

    it('distinguishes temperature ranges from standalone negative values', () => {
      expect(autoTag('Range: -5°C to 10°C')).toBe(
        'Range: minus five degrees Celsius to ten degrees Celsius'
      );
      expect(autoTag('Low: -5°C')).toBe('Low: minus five degrees Celsius');
    });

    it('matches only explicit range separators', () => {
      expect(autoTag('Latency: 10t20ms.')).toBe('Latency: 10t20ms.');
      expect(autoTag('Bandwidth: 100Mbps t 200Mbps.')).toBe(
        'Bandwidth: one hundred megabits per second t two hundred megabits per second.'
      );
      expect(autoTag('Wait 10 to 20ms.')).toBe('Wait ten to twenty milliseconds.');
    });

    it('applies manual tags through the direct language API', () => {
      const result = autoTagWithManual('Hello name(Alex Lee), the balance is money(€25).');
      expect(result).not.toContain('name(');
      expect(result).not.toContain('money(');
      expect(result).toContain('Alex Lee');
      expect(result).toContain('twenty-five euros');
    });
  });
});

describe('extractAutoTags', () => {
  it('extracts recognized tag information from text', () => {
    const text = 'Phone number is 555-123-4567.';
    const result = extractAutoTags(text, { enabledTags: ['phone'] });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      original: '555-123-4567',
      tagType: 'phone',
    });
  });

  it('extracts multiple tags', () => {
    const text = 'Call: 555-123-4567, Amount: $50';
    const result = extractAutoTags(text, { enabledTags: ['phone', 'money'] });

    expect(result).toHaveLength(2);
    expect(result[0]?.tagType).toBe('phone');
    expect(result[1]?.tagType).toBe('money');
  });

  it('returns empty array for empty string', () => {
    expect(extractAutoTags('')).toEqual([]);
  });

  it('returns empty array when no tags found', () => {
    expect(extractAutoTags('Hello there')).toEqual([]);
  });
});

describe('SUPPORTED_AUTO_TAGS', () => {
  it('contains all supported tags', () => {
    expect(SUPPORTED_AUTO_TAGS).toContain('phone');
    expect(SUPPORTED_AUTO_TAGS).toContain('datetime');
    expect(SUPPORTED_AUTO_TAGS).toContain('time');
    expect(SUPPORTED_AUTO_TAGS).toContain('date');
    expect(SUPPORTED_AUTO_TAGS).toContain('money');
    expect(SUPPORTED_AUTO_TAGS).toContain('year');
    expect(SUPPORTED_AUTO_TAGS).toContain('month');
    expect(SUPPORTED_AUTO_TAGS).toContain('day');
    expect(SUPPORTED_AUTO_TAGS).toContain('order');
    expect(SUPPORTED_AUTO_TAGS).toContain('point');
    expect(SUPPORTED_AUTO_TAGS).toContain('piece');
    expect(SUPPORTED_AUTO_TAGS).toContain('minsec');
  });
});
