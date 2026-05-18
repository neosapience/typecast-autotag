import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 15: Hotel Reservation
 *
 * Guides the customer through hotel room booking, upgrades, and membership.
 */
describe('AICC Scenario 15: Hotel Reservation', () => {
  it('converts room reservation confirmation correctly', () => {
    const input =
      'Grand Hotel reservation confirmation service.\n\nYour reservation details:\n\nConfirmation number: GH-20240115-0089\nGuest name: John Smith\n\nStay details:\nCheck-in: 2024-02-10T15:00\nCheck-out: 2024-02-12T11:00\nLength of stay: 2 nights\n\nRoom details:\nRoom type: Deluxe Double\nRoom number: 1205 (12th floor)\nRoom size: 35 sq ft\nBed: 1 king-size bed\nMax occupancy: 2 guests\n\nRate details:\nRoom rate: $250.00 × 2 nights = $500.00\nBreakfast: $35.00 × 2 guests × 2 days = $140.00\nTax and service charge: $64.00 (10%)\nTotal charge: $704.00\n\nAmenities:\nPool: 6th floor (07:00 to 22:00)\nFitness center: 5th floor (06:00 to 23:00)\nBusiness center: 2nd floor (24 hours)\n\nTo modify reservation, press 1.\nFor special requests, press 2.\nFor cancellation and refund, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('February');
    expect(result).toContain('three PM');
    expect(result).toContain('twelfth floor');
    expect(result).toContain('two hundred and fifty dollars');
    expect(result).toContain('press one');
  });

  it('converts room upgrade announcement correctly', () => {
    const input =
      'Room upgrade options.\n\nCurrent reservation: Standard Twin\nNightly rate: $180.00\n\nUpgrade options available:\n\nOption 1: Deluxe Twin\nAdditional charge: $40.00 per night (total $80.00 extra)\nPerks: City view, complimentary minibar\n\nOption 2: Premier Suite\nAdditional charge: $120.00 per night (total $240.00 extra)\nPerks: Ocean view, lounge access, breakfast included\n\nOption 3: Royal Suite\nAdditional charge: $280.00 per night (total $560.00 extra)\nPerks: Panoramic view, private lounge, airport transfer\n\nTo select an upgrade, press the corresponding number.\nTo keep current room, press 4.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('one hundred and eighty dollars');
    expect(result).toContain('forty dollars');
    expect(result).toContain('eighty dollars');
    expect(result).toContain('two hundred and eighty dollars');
    expect(result).toContain('press four');
  });

  it('converts hotel membership announcement correctly', () => {
    const input =
      'Membership points service.\n\nYour membership status:\n\nTier: Platinum\nMember number: M-2019-056789\nMember since: 2019-06-20\n\nPoints balance:\nTotal points: 128,500 points\nAvailable points: 125,000 points\nExpiring this month: 3,500 points\n\nRecent activity:\n1st entry: 2024-01-05 New York stay 12,000 points\n2nd entry: 2023-12-28 Boston stay 8,500 points\n3rd entry: 2023-12-15 Chicago dining 2,200 points\n\nPoints redemption guide:\nRoom booking: 10,000 points = $10.00\nDining: from 5,000 points\nSpa: from 20,000 points\n\nTo reach Diamond tier:\nNights required: 15 more nights\nDeadline: 2024-12-31\n\nTo redeem points, press 1.\nFor activity history, press 2.\nFor tier benefits, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('June');
    expect(result).toContain('one hundred and twenty-eight thousand');
    expect(result).toContain('three thousand five hundred');
    expect(result).toContain('ten thousand');
    expect(result).toContain('press one');
  });
});
