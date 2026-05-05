import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 10: Events and Promotions
 *
 * Informs the customer about ongoing events and promotional offers.
 */
describe('AICC Scenario 10: Events and Promotions', () => {
  it('converts active promotions announcement correctly', () => {
    const input =
      'Events and promotions.\n\nWe have 3 active promotions to share with you.\n\n1st promotion: New Year Special Sale\nDates: 2024-01-01 to 2024-01-31\nOffer: 20% off all items, up to $50.00 savings\n\n2nd promotion: Refer a Friend\nDates: 2024-01-15 to 2024-02-28\nOffer: Earn 5,000 points per referral, up to 50,000 points\n\n3rd promotion: App Review Bonus\nDates: Ongoing\nOffer: 1,000 points upon posting a review\n\nFor promotion details, press the corresponding number.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('twenty percent');
    expect(result).toContain('fifty dollars');
    expect(result).toContain('five thousand points');
    expect(result).toContain('one thousand points');
  });

  it('converts prize notification correctly', () => {
    const input =
      'Congratulations!\n\nYou have won a prize in our New Year Lucky Draw.\n\nPrize details:\nEvent: 2024 New Year Lucky Draw\nPrize tier: 2nd place\nPrize: $30.00 gift card\n\nYou were selected from 5,000 participants.\n\nRedemption details:\nExpires: 2024-02-28\nYour gift card code will be sent to 555-123-4567.\nExpected delivery: after 2024-01-20T10:00\n\nTo confirm your prize, press 1.\nFor other events, press 2.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('thirty dollars');
    expect(result).toContain('five five five');
    expect(result).toContain('February');
    expect(result).toContain('ten AM');
    expect(result).toContain('five five five');
  });

  it('converts promotion expiry notice correctly', () => {
    const input =
      'Promotion reminder.\n\nA promotion you enrolled in is ending soon.\n\nPromotion: Year-End Appreciation Event\nEnd date: 2024-01-31T23:59\nTime remaining: D-7\n\nYour current progress:\nPurchases: $180.00\nSpend $50.00 more to unlock VIP benefits\n\nVIP benefits:\n1st perk: Additional 10% discount (up to $30.00)\n2nd perk: 3 free shipping passes for next month\n3rd perk: 5,000 bonus points\n\nFor promotion details, press 1.\nFor VIP benefit details, press 2.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('eleven fifty-nine PM');
    expect(result).toContain('one hundred and eighty dollars');
    expect(result).toContain('fifty dollars');
    expect(result).toContain('ten percent');
  });
});
