import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 05: Account Information
 *
 * Guides the customer through viewing and updating their account details.
 */
describe('AICC Scenario 05: Account Information', () => {
  it('converts account lookup announcement correctly', () => {
    const input =
      'Account information service.\n\nYour identity has been verified.\n\nAccount details:\nMembership tier: Gold\nMember since: 2022-03-15\nPhone on file: 555-123-4567\nEmail on file: user@example.com\n\nRewards balance: 15,500 points\nPoints to be credited this month: 2,000 points\nPoints expiration: 2024-12-31\n\nTo update phone number, press 1.\nTo change password, press 2.\nTo update email, press 3.\nTo close account, press 4.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('March');
    expect(result).toContain('five five five');
    expect(result).toContain('fifteen thousand five hundred points');
    expect(result).toContain('two thousand points');
    expect(result).toContain('press one');
  });

  it('converts phone update confirmation correctly', () => {
    const input =
      'Your phone number has been updated.\n\nPrevious number: 555-123-4567\nNew number: 555-876-4321\n\nChange date: 2024-01-15T16:45\n\nA verification text has been sent to your new number.\nIf you did not receive it, please try again in 5 minutes.\n\nA confirmation email has also been sent.\n\nTo confirm, press 1.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('five five five');
    expect(result).toContain('January');
    expect(result).toContain('four forty-five PM');
    expect(result).toContain('five minutes');
    expect(result).toContain('press one');
  });

  it('converts membership tier announcement correctly', () => {
    const input =
      'Membership tier information.\n\nYour current tier is Gold.\nYou need $50.00 more in purchases to reach Platinum.\n\nYour current tier benefits:\n1st benefit: 5% discount on all purchases\n2nd benefit: Free shipping\n3rd benefit: Birthday coupon worth $10.00\n4th benefit: Double rewards points\n\nPurchases this month: $150.00\nAnnual purchases to date: $850.00\n\nPlatinum tier requires $1,000.00 in annual purchases.\n\nFor tier details, press 1.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('fifty dollars');
    expect(result).toContain('five percent');
    expect(result).toContain('ten dollars');
    expect(result).toContain('one hundred and fifty dollars');
    expect(result).toContain('press one');
  });
});
