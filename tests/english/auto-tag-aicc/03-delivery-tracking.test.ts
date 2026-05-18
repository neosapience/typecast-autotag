import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 03: Order Tracking
 *
 * Guides the customer through checking the status of their shipments.
 */
describe('AICC Scenario 03: Order Tracking', () => {
  it('converts order status announcement correctly', () => {
    const input =
      'Order tracking service.\n\nYour recent orders:\n\n1st order: last 4 digits 5678\nItem: Premium 3-month subscription\nOrder date: 2024-01-10\nStatus: Delivered\nDelivery date: 2024-01-12T14:30\n\n2nd order: last 4 digits 9012\nItem: 5-pack voice bundle\nOrder date: 2024-01-14\nStatus: In transit\nEstimated arrival: 2024-01-16\n\nFor order details, press 1.\nTo track a different order, press 2.\nTo update delivery address, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('five six seven eight');
    expect(result).toContain('January');
    expect(result).toContain('two thirty PM');
    expect(result).toContain('press one');
    expect(result).toContain('press three');
  });

  it('converts delivery delay notification correctly', () => {
    const input =
      'We apologize for the inconvenience.\n\nYour order ending in 3456 has been delayed.\n\nOriginal estimated arrival: 2024-01-15\nRevised estimated arrival: 2024-01-18\n\nReason: High volume at our fulfillment center causing processing delays.\nEstimated delay: approximately 72 hours\n\nAs compensation, a $5.00 discount coupon has been issued.\nCoupon expires: 2024-02-15\n\nTo cancel this order, press 1.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('three four five six');
    expect(result).toContain('January');
    expect(result).toContain('February');
    expect(result).toContain('five dollars');
  });

  it('converts delivery confirmation correctly', () => {
    const input =
      'Delivery confirmation.\n\nYour order was delivered on 2024-01-15T11:23.\n\nDelivery information:\nRecipient: John Smith\nDelivery address: 123 Main Street, Springfield\nCarrier contact: 555-234-5678\n\nIf you received your order, press 1.\nIf you did not receive it, press 2.\nTo report damage or defects, press 3.\n\nReturns and exchanges are accepted within 7 days.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('eleven');
    expect(result).toContain('twenty-three AM');
    expect(result).toContain('five five five');
    expect(result).toContain('press one');
  });
});
