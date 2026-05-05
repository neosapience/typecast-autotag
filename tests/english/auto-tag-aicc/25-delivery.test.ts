import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 25: Delivery and Logistics
 *
 * Guides the customer through package tracking, pickup scheduling, and international shipping.
 */
describe('AICC Scenario 25: Delivery and Logistics', () => {
  it('converts package tracking announcement correctly', () => {
    const input =
      'FedEx package tracking service.\n\nTracking number: 123456789012\nSender: Amazon Fulfillment Center\nRecipient: John Smith\n\nDelivery status:\nCurrent status: out for delivery\nDelivery driver: Mike Johnson (555-111-2222)\n\nDelivery history:\n1st update: 2024-01-20 08:00 departed distribution center (Chicago, IL)\n2nd update: 2024-01-20 10:30 arrived at hub (Indianapolis, IN)\n3rd update: 2024-01-20 11:45 out for delivery (South Side station)\n\nEstimated delivery window: 13:00 to 15:00\nDelivery address: 123 Main Street, Unit 501, 5th floor\n\nDelivery notes:\nSMS notification upon delivery\nIf absent: left with building management\nWeight: 2.5 lbs\n\nTo call driver, press 1.\nTo change address, press 2.\nTo change delivery date, press 3.\nFor delivery instructions, press 4.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('five five five');
    expect(result).toContain('eight AM');
    expect(result).toContain('ten thirty AM');
    expect(result).toContain('one PM');
    expect(result).toContain('press one');
  });

  it('converts pickup scheduling announcement correctly', () => {
    const input =
      'Package pickup scheduling service.\n\nYour pickup request has been confirmed.\n\nConfirmation number: PU-2024012078945\nPickup date: 2024-01-21\nPickup window: 14:00 to 18:00\n\nPickup address:\nAddress: 200 Oak Avenue, Unit 302, 3rd floor\nContact: 555-333-4444\n\nShipment details:\nRecipient: Jane Doe\nDelivery address: 567 Beach Blvd, Miami, FL\nRecipient contact: 555-555-6666\n\nPackage information:\nBox size: medium (within 80 cm)\nEstimated weight: 3 kg\nContents: clothing\n\nShipping rates:\nBill recipient: $4.50 (recipient pays)\nPrepaid: $4.00 (pay now)\n\nTo pay now, press 1.\nFor recipient billing, press 2.\nTo cancel pickup, press 3.\nTo modify pickup, press 4.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('two PM');
    expect(result).toContain('third floor');
    expect(result).toContain('four dollars and fifty cents');
    expect(result).toContain('press one');
  });

  it('converts international shipping announcement correctly', () => {
    const input =
      'International shipment tracking service.\n\nTracking number: EMS123456789US\nOrigin: United States\nDestination: Japan (Tokyo)\n\nShipment status:\nCurrent status: customs clearance in progress\nEstimated delivery: 2024-01-28\n\nShipment history:\n1st update: 2024-01-15 09:00 accepted (JFK International Mail Center)\n2nd update: 2024-01-15 18:00 loaded on aircraft\n3rd update: 2024-01-16 05:00 arrived in Japan (Narita Airport)\n4th update: 2024-01-17 customs processing in progress\n\nItem details:\nContents: electronics\nDeclared value: $350.00\nWeight: 1.2 kg\n\nCustoms information:\nEstimated duty: $0.00 (within duty-free limit)\nProcessing time: 1 to 3 days\n\nLocal carrier: Japan Post\nLocal tracking: 9400111899223456789012\n\nFor tracking details, press 1.\nFor customs inquiry, press 2.\nFor delivery inquiry, press 3.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('nine AM');
    expect(result).toContain('three hundred and fifty dollars');
    expect(result).toContain('press zero');
    expect(result).toContain('press one');
  });
});
