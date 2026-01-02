import { autoFlight } from '../../../src/english/auto-tag';

describe('autoTag - flight (flight number auto-tagging)', () => {
  describe('airline codes', () => {
    it('converts KE flights (Korean Air)', () => {
      expect(autoFlight('KE123')).toContain('K E');
      expect(autoFlight('KE123')).toContain('one two three');
    });

    it('converts AA flights (American Airlines)', () => {
      expect(autoFlight('AA456')).toContain('A A');
      expect(autoFlight('AA456')).toContain('four five six');
    });

    it('converts BA flights (British Airways)', () => {
      expect(autoFlight('BA789')).toContain('B A');
    });
  });

  describe('flight label', () => {
    it('converts flight: XX123', () => {
      const result = autoFlight('flight: KE001');
      expect(result).toContain('flight:');
      expect(result).toContain('K E');
    });

    it('converts departing XX123', () => {
      const result = autoFlight('departing: AA100');
      expect(result).toContain('departing:');
      expect(result).toContain('A A');
    });
  });

  describe('flights in context', () => {
    it('converts flights in sentences', () => {
      const result = autoFlight('Boarding KE301 at gate 5');
      expect(result).toContain('K E');
      expect(result).toContain('three zero one');
    });
  });

  describe('multiple flights', () => {
    it('converts all flights', () => {
      const result = autoFlight('KE123 and AA456');
      expect(result).toContain('K E');
      expect(result).toContain('A A');
    });
  });
});
