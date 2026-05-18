import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 06: Rewards and Coupons
 *
 * Guides the customer through checking rewards balances and available coupons.
 */
describe('AICC Scenario 06: Rewards and Coupons', () => {
  it('converts rewards balance announcement correctly', () => {
    const input =
      'Rewards balance service.\n\nYour rewards summary:\n\nTotal rewards balance: 25,800 points\nAvailable to redeem: 23,300 points\nPoints expiring within 7 days: 2,500 points\n\nRecent rewards activity:\n1st entry: 2024-01-10 purchase reward 3,000 points\n2nd entry: 2024-01-12 event reward 1,500 points\n3rd entry: 2024-01-14 daily check-in 500 points\n\nTo view redemption history, press 1.\nTo view earning history, press 2.\nFor expiring points details, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('twenty-five thousand eight hundred points');
    expect(result).toContain('two thousand five hundred points');
    expect(result).toContain('January');
    expect(result).toContain('three thousand points');
    expect(result).toContain('press one');
  });

  it('converts coupon summary announcement correctly', () => {
    const input =
      'Coupon service.\n\nYou have 5 coupons available.\n\n1st coupon: Welcome discount\nDiscount amount: $10.00\nExpires: 2024-02-28\nMinimum purchase: $50.00\n\n2nd coupon: Birthday coupon\nDiscount rate: 15%\nExpires: 2024-01-31\nMaximum discount: $30.00\n\n3rd coupon: First purchase thank-you\nDiscount amount: $5.00\nExpires: 2024-03-15\n\nFor coupon usage instructions, press 1.\nTo register a coupon code, press 2.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('press two');
    expect(result).toContain('ten dollars');
    expect(result).toContain('fifteen percent');
    expect(result).toContain('February');
    expect(result).toContain('press one');
  });

  it('converts rewards redemption announcement correctly', () => {
    const input =
      'Rewards redemption.\n\nCurrent balance: 50,000 points\nRedeemable cash value: $45.00\n(Redemption rate: $0.90 per 1,000 points)\n\nRedemption fee: 5,000 points\n\nProcessing takes 2 to 3 business days after submission.\nBank account on file: ending in 5678\n\nTo redeem all points, press 1.\nTo redeem partial amount, press 2.\nTo update bank account, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('fifty thousand points');
    expect(result).toContain('forty-five dollars');
    expect(result).toContain('five six seven eight');
    expect(result).toContain('press one');
  });
});
