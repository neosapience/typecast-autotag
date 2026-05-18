import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 23: Telecom Billing and Service
 *
 * Guides the customer through bill inquiry, plan changes, and international roaming.
 */
describe('AICC Scenario 23: Telecom Billing and Service', () => {
  it('converts billing inquiry announcement correctly', () => {
    const input =
      'AT&T billing inquiry service.\n\nYour current month\'s bill summary:\n\nLine number: 555-987-6543\nPlan: 5G Premier Plus\nBilling month: January 2024\n\nCharges breakdown:\nBase plan: $89.00\nVoice calls: $0.00 (unlimited)\nText messages: $0.00 (unlimited)\nData: $0.00 (unlimited)\nAdd-on services: $4.40\nContent subscriptions: $15.90\n\nDiscounts:\nFamily bundle discount: -$10.00\nLoyalty discount: -$5.00\nPartner card discount: -$10.00\n\nTotal billed: $84.30\nPayment due: 2024-02-10\nAuto-pay date: 2024-02-25\n\nData usage:\nUsed: 45.7 GB / unlimited\nVoice: 320 minutes / unlimited\n\nTo resend statement, press 1.\nTo change plan, press 2.\nFor payment options, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('five five five');
    expect(result).toContain('eighty-nine dollars');
    expect(result).toContain('February');
    expect(result).toContain('press one');
    expect(result).toContain('press three');
  });

  it('converts plan change announcement correctly', () => {
    const input =
      'Plan change options.\n\nCurrent plan: 5G Standard\nMonthly price: $69.00\nData: 12 GB + throttled after\n\nRecommended plans:\n\n1st recommendation: 5G Slim\nMonthly price: $55.00 (saves $14.00/month)\nData: 6 GB + throttled after\nCalls and texts: unlimited\n\n2nd recommendation: 5G Premier\nMonthly price: $79.00 ($10.00 more/month)\nData: unlimited\nCalls and texts: unlimited\nStreaming perk: Netflix Premium included\n\n3rd recommendation: 5G Light\nMonthly price: $45.00 (saves $24.00/month)\nData: 3 GB + throttled after\nCalls: 100 minutes, texts: 100\n\nPlan change takes effect: 1st of next month\nEarly termination fee: none\n\nTo switch to plan 1, press 1.\nTo switch to plan 2, press 2.\nTo switch to plan 3, press 3.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('sixty-nine dollars');
    expect(result).toContain('fifty-five dollars');
    expect(result).toContain('seventy-nine dollars');
    expect(result).toContain('forty-five dollars');
    expect(result).toContain('press zero');
  });

  it('converts international roaming announcement correctly', () => {
    const input =
      'International roaming service.\n\nUpcoming travel destination: Japan\nTravel dates: 2024-02-01 to 2024-02-07 (7 days)\n\nRecommended options:\n\n1st option: International data roaming\n2 GB per day: $11.00/day\n7-day total: $77.00\nCalls: free incoming, $0.30/minute outgoing\n\n2nd option: Pocket Wi-Fi rental\nUnlimited data: $9.90/day\n7-day total: $69.30\nPickup: LAX Terminal 2, Counter A\n\n3rd option: Local SIM card\n10 GB data: $35.00 (7 days)\nCalls: uses local number\nDelivery: airport or mail (2 to 3 days)\n\nWith your current plan roaming auto-enabled:\nData: $15.00/day (1 GB)\nCalls: free incoming, $0.50/minute outgoing\n\nTo add option 1, press 1.\nTo add option 2, press 2.\nTo add option 3, press 3.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('February');
    expect(result).toContain('eleven dollars');
    expect(result).toContain('seventy-seven dollars');
    expect(result).toContain('sixty-nine dollars and thirty cents');
    expect(result).toContain('press zero');
  });
});
