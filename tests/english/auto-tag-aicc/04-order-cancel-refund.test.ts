import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 04: Order Cancellation and Refund
 *
 * Guides the customer through cancelling an order or requesting a refund.
 */
describe('AICC Scenario 04: Order Cancellation and Refund', () => {
  it('converts cancellation eligibility announcement correctly', () => {
    const input =
      'Order cancellation.\n\nOrder details for order ending in 7890:\nOrder date: 2024-01-14T09:15\nAmount charged: $89.00\nItem: Annual subscription, 1 unit\n\nThis order is eligible for cancellation.\nA full refund of $89.00 will be issued.\n\nCredit card refunds typically process within 3 to 5 business days.\nBank transfer refunds typically process within 1 to 2 business days.\n\nTo proceed with cancellation, press 1.\nTo keep your order, press 2.';

    const result = autoTag(input);
    expect(result).toContain('seven eight nine zero');
    expect(result).toContain('January');
    expect(result).toContain('nine fifteen AM');
    expect(result).toContain('eighty-nine dollars');
    expect(result).toContain('press one');
  });

  it('converts refund processing announcement correctly', () => {
    const input =
      'Refund status update.\n\nYour refund request has been received.\n\nRefund details:\nRefund request date: 2024-01-15\nRefund amount: $125.50\nRefund method: Credit card\n\nExpected refund date: 2024-01-20\nAdditional processing by your card issuer may take 3 to 7 days.\n\nYou will receive refund status updates by text.\nNotification number: 555-987-6543\n\nTo confirm, press 1.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('one hundred and twenty-five dollars and fifty cents');
    expect(result).toContain('January');
    expect(result).toContain('five five five');
    expect(result).toContain('press one');
  });

  it('converts partial refund announcement correctly', () => {
    const input =
      'Partial refund information.\n\nTotal order amount: $250.00\nDelivered items: 3 items ($150.00)\nItems to be refunded: 2 items ($100.00)\n\nRefundable amount: $95.00\n(Return shipping fee of $5.00 deducted)\n\n1st refund item: Voice pack A - $50.00\n2nd refund item: Voice pack B - $50.00\n\nEstimated processing time: 3 to 5 business days\n\nTo proceed with partial refund, press 1.\nTo cancel, press 2.';

    const result = autoTag(input);
    expect(result).toContain('two hundred and fifty dollars');
    expect(result).toContain('ninety-five dollars');
    expect(result).toContain('fifty dollars');
    expect(result).toContain('press one');
    expect(result).toContain('press two');
  });
});
