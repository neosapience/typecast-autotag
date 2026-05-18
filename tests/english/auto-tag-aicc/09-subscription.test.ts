import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 09: Subscription Service
 *
 * Guides the customer through viewing and managing their subscription.
 */
describe('AICC Scenario 09: Subscription Service', () => {
  it('converts subscription overview announcement correctly', () => {
    const input =
      'Subscription service.\n\nYour current subscription:\n\nPlan: Premium Plan\nMonthly fee: $29.90\nSubscription start: 2023-06-15\nNext billing date: 2024-02-15\n\nPlan benefits:\n1st benefit: Unlimited voice access\n2nd benefit: Advanced editing features\n3rd benefit: Priority customer support\n4th benefit: 10,000 bonus points per month\n\nUsage this month:\nVoice generations: 150 items\nEditing sessions: 45 sessions\n\nTo change plan, press 1.\nTo update payment method, press 2.\nTo cancel subscription, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('twenty-nine dollars and ninety cents');
    expect(result).toContain('June');
    expect(result).toContain('February');
    expect(result).toContain('one hundred and fifty items');
    expect(result).toContain('press one');
  });

  it('converts plan upgrade announcement correctly', () => {
    const input =
      'Plan change information.\n\nCurrent plan: Basic Plan ($9.90/month)\nNew plan: Premium Plan ($29.90/month)\n\nAdditional charge today: $20.00\n(Prorated for remaining 15 days)\n\nChange effective: 2024-01-16T00:00\n\nPremium plan includes:\n1st addition: Unlimited voice generations (was 100/month)\n2nd addition: Advanced editing features\n3rd addition: Priority support (50% shorter wait times)\n\nProceed with plan change, press 1.\nView other plans, press 2.\nCancel, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('nine dollars and ninety cents');
    expect(result).toContain('twenty-nine dollars and ninety cents');
    expect(result).toContain('twenty dollars');
    expect(result).toContain('January');
    expect(result).toContain('fifty percent');
  });

  it('converts cancellation announcement correctly', () => {
    const input =
      'Subscription cancellation.\n\nYour subscription details:\nCurrent plan: Premium Plan\nMonthly fee: $29.90\nNext billing date: 2024-02-15\n\nCancellation details:\n1st note: You keep access through 2024-02-14\n2nd note: Your 25,000 reward points remain valid for 30 days\n3rd note: Reactivation restores your previous settings\n\nCancellation reversal window: 7 days after cancellation\n\nTo confirm cancellation, press 1.\nTo pause instead, press 2.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('twenty-nine dollars and ninety cents');
    expect(result).toContain('February');
    expect(result).toContain('press one');
    expect(result).toContain('thirty days');
    expect(result).toContain('press zero');
  });
});
