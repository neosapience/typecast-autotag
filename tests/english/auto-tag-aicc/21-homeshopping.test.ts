import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 21: Home Shopping Order and Returns
 *
 * Guides the customer through TV shopping orders, returns, and promotions.
 */
describe('AICC Scenario 21: Home Shopping Order and Returns', () => {
  it('converts home shopping order confirmation correctly', () => {
    const input =
      'ShopTV order confirmation service.\n\nYour order details:\n\nOrder number: HS-20240120-78945\nOrder channel: TV Home Shopping (channel 15)\nBroadcast date and time: 2024-01-20T10:30\n\nItems ordered:\n1st item: Premium Air Fryer (12 qt) - $149.00\n2nd item: Accessory set - $39.00\nFree gift: Silicone cooking tools set (3 pieces)\n\nPayment summary:\nItem subtotal: $188.00\nTV special discount: -$38.00\nRewards credit: -$5.00\nTotal charged: $145.00\nPayment method: credit card (3-month interest-free)\n\nShipping:\nEstimated delivery: 2024-01-23\nShipping: free\n\nTo confirm order, press 1.\nTo change shipping address, press 2.\nTo add another item, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('ten thirty AM');
    expect(result).toContain('one hundred and forty-nine dollars');
    expect(result).toContain('one hundred and forty-five dollars');
    expect(result).toContain('January');
    expect(result).toContain('press one');
  });

  it('converts return request announcement correctly', () => {
    const input =
      'Returns service.\n\nReturns are accepted within 7 days of receipt.\n\nReturn item:\nOrder number: HS-20240115-12345\nItem: Premium leather handbag\nItem price: $298.00\nDate received: 2024-01-17\n\nReturn deadline: 2024-01-24\nDays remaining: 4 days\n\nReturn shipping:\nChange of mind: $6.00 (round-trip shipping)\nDefective item: free\n\nEstimated refund: $292.00\nExpected refund date: 2024-01-28\nCredit card refunds may take an additional 2 to 5 business days.\n\nTo start return, press 1.\nTo request exchange, press 2.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('two hundred and ninety-eight dollars');
    expect(result).toContain('January');
    expect(result).toContain('six dollars');
    expect(result).toContain('two hundred and ninety-two dollars');
    expect(result).toContain('press zero');
  });

  it('converts promotional sale announcement correctly', () => {
    const input =
      'Flash sale announcement.\n\nOngoing time-limited sale:\nBroadcast window: 14:00 to 15:00 (time remaining: 25m30s)\n\nToday\'s featured item:\nItem: Premium Vacuum Cleaner Set\nOriginal price: $599.00\nSale price: $399.00 (33% off)\nAdditional discount: instant card discount $50.00\nFinal price: $349.00\n\nLimited quantity: 127 of 500 units remaining\nPurchase limit: 2 per customer\n\nFree gifts:\n1st gift: Extra filters, 5 pack ($50.00 value)\n2nd gift: Storage stand ($29.00 value)\n\nInterest-free installments: 12 months available\nMonthly payment: $29.08\n\nTo order now, press 1.\nFor other products, press 2.\nTo save to wishlist, press 3.';

    const result = autoTag(input);
    expect(result).toContain('two PM');
    expect(result).toContain('twenty-five minutes thirty seconds');
    expect(result).toContain('thirty-three percent');
    expect(result).toContain('three hundred and forty-nine dollars');
    expect(result).toContain('press one');
  });
});
