import { autoTag } from '../../../src/english/auto-tag';

/**
 * Integration tests
 *
 * Tests real-world usage scenarios.
 */
describe('autoTag integration tests', () => {
  describe('real-world scenarios', () => {
    it('order confirmation message', () => {
      const text = 'Order complete. Total: $49.99, Contact: 555-123-4567';
      const result = autoTag(text);

      expect(result).toContain('forty-nine');
      expect(result).toContain('five five five');
    });

    it('schedule notification message', () => {
      const text = 'Next meeting scheduled for 2024-01-15T14:30.';
      const result = autoTag(text);

      expect(result).toContain('January');
      expect(result).toContain('two thirty PM');
    });

    it('customer info message', () => {
      const text = 'Birthdate: 19940616, Contact: 555-987-6543';
      const result = autoTag(text);

      expect(result).toContain('June');
      expect(result).toContain('five five five');
    });

    it('payment notification message', () => {
      const text = 'Total payment of $1,500.00 has been processed.';
      const result = autoTag(text);

      expect(result).toContain('one thousand five hundred dollars');
    });

    it('wait time notification', () => {
      const text = 'Estimated wait time is about 15 minutes.';
      const result = autoTag(text);

      expect(result).toContain('fifteen minutes');
    });

    it('ranking notification', () => {
      const text = 'Current rank: 1st place, Score: 95 points';
      const result = autoTag(text);

      expect(result).toContain('first place');
      expect(result).toContain('ninety-five points');
    });

    it('quantity notification', () => {
      const text = 'Cart contains 5 items.';
      const result = autoTag(text);

      expect(result).toContain('five items');
    });
  });

  describe('complex sentences', () => {
    it('sentence with mixed pattern types', () => {
      const text =
        'Customer (born 1990), reservation 2024-01-15T10:00 confirmed. Amount: $500, Contact: 555-123-4567';
      const result = autoTag(text);

      expect(result).toContain('January'); // datetime
      expect(result).toContain('five hundred dollars'); // money
      expect(result).toContain('five five five'); // phone
    });

    it('long paragraph', () => {
      const text = `
        Hello, customer.
        Your appointment on 2024-01-15T14:30 is ready.
        Total is $1,250 for 3 items.
        Contact 555-123-4567 for questions.
        Thank you.
      `;
      const result = autoTag(text);

      expect(result).toContain('January');
      expect(result).toContain('one thousand');
      expect(result).toContain('three items');
      expect(result).toContain('five five five');
    });
  });

  describe('edge cases', () => {
    it('consecutive patterns', () => {
      const text = '555-123-4567 / 555-876-5432';
      const result = autoTag(text, { enabledTags: ['phone'] });

      expect(result).toContain('five five five');
      expect(result).toContain('eight seven six');
    });

    it('overlapping patterns (priority)', () => {
      // datetime should take priority over date + time
      const text = '2024-01-15T14:30';
      const result = autoTag(text);

      // Should be processed as datetime all at once
      expect(result).toContain('two thirty PM'); // time included
    });

    it('preserves text between patterns', () => {
      const text = 'Phone: 555-123-4567, Fax: 555-234-5678';
      const result = autoTag(text, { enabledTags: ['phone'] });

      expect(result).toContain(', Fax: ');
    });
  });

  describe('special character handling', () => {
    it('patterns in parentheses', () => {
      const text = 'Contact(555-123-4567) for info';
      const result = autoTag(text, { enabledTags: ['phone'] });

      expect(result).toContain('five five five');
    });

    it('patterns in quotes', () => {
      const text = '"$50" has been charged';
      const result = autoTag(text, { enabledTags: ['money'] });

      expect(result).toBe('"fifty dollars" has been charged');
    });

    it('text with special symbols', () => {
      const text = '★ Special ★ $9.99!';
      const result = autoTag(text, { enabledTags: ['money'] });

      // Money with cents uses "N dollars and N cents" format
      expect(result).toContain('nine dollars');
      expect(result).toContain('ninety-nine cents');
    });
  });

  describe('unicode handling', () => {
    it('text with emojis', () => {
      const text = '🎉 Congratulations! $100 won! 🎊';
      const result = autoTag(text, { enabledTags: ['money'] });

      expect(result).toBe('🎉 Congratulations! one hundred dollars won! 🎊');
    });
  });
});
