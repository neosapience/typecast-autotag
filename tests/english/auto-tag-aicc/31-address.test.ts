import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 31: Address and Location Information
 *
 * Note: English does not have a dedicated `address` tag equivalent to the Korean one
 * (which converts 동/호/층 number patterns). Instead, this file exercises the `floor`,
 * `roomNumber`, and `serial` tags that are functionally relevant to address-related content
 * in the English auto-tag system.
 */
describe('AICC Scenario 31: Address and Location Information', () => {
  it('converts building floor and unit announcement correctly', () => {
    const input =
      'Package delivery notification.\n\nYour package is scheduled for delivery today.\n\nDelivery details:\nTracking number: PKG-2024-AB1234\nBuilding: Riverside Towers\nDelivery address: 3rd floor, Unit 302\nAlternate: 12th floor, Unit 1205\nBack entrance: 1st floor lobby\n\nDelivery window: 2024-01-20T13:00 to 15:00\n\nIf not home:\n1st option: leave at 3rd floor mail room\n2nd option: leave with building manager (1st floor, Unit 101)\n3rd option: redeliver next business day\n\nPackage weight: 5 lbs\nRequires signature: yes\n\nTo confirm delivery, press 1.\nFor alternate address, press 2.\nTo reschedule, press 3.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('third floor');
    expect(result).toContain('twelfth floor');
    expect(result).toContain('first floor');
    expect(result).toContain('January');
    expect(result).toContain('press zero');
  });

  it('converts office building directory announcement correctly', () => {
    const input =
      'Building directory service.\n\nWelcome to the Commerce Center.\n\nFloor directory:\n1st floor: Lobby, Security, Mail room\n2nd floor: Retail shops and cafe\n3rd floor: Medical offices\n5th floor: Law offices\n10th floor: Corporate suites\n15th floor: Executive conference center\n20th floor: Penthouse event space\n\nBuilding services hours:\nSecurity desk: 24 hours\nManagement office: 08:00 to 18:00\nParking validation: 2nd floor\n\nLocator: serial number is 1234\nBuilding ID: serial number: DEF-5678-90\n\nFor emergency, dial 911.\nFor building management, press 1.\nFor parking, press 2.\nFor directory assistance, press 3.';

    const result = autoTag(input);
    expect(result).toContain('first floor');
    expect(result).toContain('second floor');
    expect(result).toContain('tenth floor');
    expect(result).toContain('twentieth floor');
    expect(result).toContain('press one');
  });

  it('converts address verification announcement correctly', () => {
    const input =
      'Address verification service.\n\nWe found the following address on file:\n\n123 Maple Avenue\nApartment on 4th floor, Unit 401\nSpringfield, IL 62701\n\nSerial number: SN-2024-XY9876\nUnit reference: 5th floor suite\nBuilding entrance: ground floor, door 1\n\nIs this address correct?\nLast updated: 2024-01-15T09:00\n\nIf this is correct, press 1.\nTo update your address, press 2.\nFor delivery instructions, press 3.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('fourth floor');
    expect(result).toContain('press one');
    expect(result).toContain('January');
    expect(result).toContain('nine AM');
    expect(result).toContain('press one');
  });

  describe('floor tag tests', () => {
    it('converts ordinal floor numbers correctly', () => {
      const inputs = [
        { input: '1st floor lobby', expect: 'first floor' },
        { input: '2nd floor offices', expect: 'second floor' },
        { input: '3rd floor suites', expect: 'third floor' },
        { input: '5th floor', expect: 'fifth floor' },
        { input: '10th floor', expect: 'tenth floor' },
        { input: '15th floor', expect: 'fifteenth floor' },
      ];

      for (const tc of inputs) {
        const result = autoTag(tc.input);
        expect(result).toContain(tc.expect);
      }
    });
  });

  describe('serial tag tests', () => {
    it('converts serial numbers digit by digit', () => {
      const input = 'serial number: ABC-1234-56';
      const result = autoTag(input);
      expect(result).toContain('one two three four');
    });

    it('converts product serial number correctly', () => {
      const input = 'product serial: XYZ-9876-54321';
      const result = autoTag(input);
      expect(result).toContain('nine eight seven six');
    });
  });
});
