import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 29: Fitness Center Membership Services
 *
 * Guides the customer through membership inquiry, personal training, and renewals.
 */
describe('AICC Scenario 29: Fitness Center Membership Services', () => {
  it('converts membership inquiry announcement correctly', () => {
    const input =
      'Planet Fitness membership service.\n\nMember details:\nMember number: FIT-2023-12345\nMember name: John Smith\nHome club: Downtown location\n\nMembership status:\nMembership type: 12-month All-Access pass\nStart date: 2023-07-01\nExpiration date: 2024-06-30\nDays remaining: 162 days\nAccess hours:\nWeekday: 06:00 to 23:00\nWeekend: 08:00 to 20:00\nClosed: last Sunday of each month\n\nAdd-on services:\nLocker: 12-month locker rental (locker A-125)\nWorkout gear: free daily rental (once per day)\nTowel: complimentary\n\nPersonal training sessions remaining: 8 of 20\nAssigned trainer: Coach Park (555-222-3333)\n\nTo renew membership, press 1.\nTo book personal training, press 2.\nTo freeze membership, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('June');
    expect(result).toContain('six AM');
    expect(result).toContain('eight PM');
    expect(result).toContain('five five five');
    expect(result).toContain('press one');
  });

  it('converts personal training booking announcement correctly', () => {
    const input =
      'Personal training booking service.\n\nAvailable sessions:\nAssigned trainer: Coach Park\nSpecialties: weight training, fitness\n\nAvailable times this week:\n1st slot: 2024-01-22 (Monday) 10:00 to 11:00\n2nd slot: 2024-01-22 (Monday) 14:00 to 15:00\n3rd slot: 2024-01-23 (Tuesday) 09:00 to 10:00\n4th slot: 2024-01-24 (Wednesday) 16:00 to 17:00\n5th slot: 2024-01-25 (Thursday) 11:00 to 12:00\n\nSession balance:\nRemaining: 8 sessions\nUsed: 12 sessions\nNext session will deduct 1 session\n\nReminders:\nApp notification: 1 hour before session\nText reminder: same day at 08:00\n\nCancellation policy:\nSame-day cancellation: 1 session deducted\nNext-day cancellation: free\n\nTo select a time, press the corresponding number.\nFor next week\'s schedule, press 6.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('ten AM');
    expect(result).toContain('two PM');
    expect(result).toContain('eight AM');
    expect(result).toContain('press zero');
  });

  it('converts membership renewal announcement correctly', () => {
    const input =
      'Membership renewal options.\n\nCurrent membership:\nExpiration date: 2024-06-30\nDays remaining: 162 days\n\nRenewal plans:\n\n1st plan: 3-month renewal\nList price: $270.00\nMember price: $243.00 (10% off)\nMonthly equivalent: $81.00\n\n2nd plan: 6-month renewal\nList price: $480.00\nMember price: $408.00 (15% off)\nMonthly equivalent: $68.00\n\n3rd plan: 12-month renewal\nList price: $840.00\nMember price: $672.00 (20% off)\nMonthly equivalent: $56.00\nFree gift: 2 personal training sessions\n\nPayment:\nLump sum or interest-free installments (3 to 12 months)\n\nRenewal bonuses:\n1 month free locker\nGroup fitness classes included\n\nFor plan 1, press 1.\nFor plan 2, press 2.\nFor plan 3, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('June');
    expect(result).toContain('two hundred and forty-three dollars');
    expect(result).toContain('ten percent');
    expect(result).toContain('six hundred and seventy-two dollars');
    expect(result).toContain('twenty percent');
  });
});
