import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 11: Technical Support and Repair
 *
 * Guides the customer through technical support inquiries and repair requests.
 */
describe('AICC Scenario 11: Technical Support and Repair', () => {
  it('converts repair intake announcement correctly', () => {
    const input =
      'Technical support and repair service.\n\nWe found your device information.\n\nDevice: Smart Speaker Pro\nModel: serial number: TSP-2024-001\nPurchase date: 2023-06-15\nWarranty through: 2025-06-14 (517 days remaining)\n\nAvailable service options:\nOption 1: Covered repair (within warranty)\nOption 2: Out-of-warranty repair (estimated $35.00 to $80.00)\nOption 3: Device exchange (5 units in stock)\nOption 4: Refund (original price $199.00, subject to depreciation)\n\nIn-person service hours:\nWeekdays 10:00 to 18:00\nWeekends 10:00 to 14:00\n\nEstimated repair time: 3 to 7 days\nFree round-trip shipping for mail-in service\n\nPress the corresponding number to select a service.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('June');
    expect(result).toContain('ten AM');
    expect(result).toContain('six PM');
    expect(result).toContain('one hundred and ninety-nine dollars');
    expect(result).toContain('press zero');
  });

  it('converts remote support announcement correctly', () => {
    const input =
      'Remote support service.\n\nAvailable agents: 3\nEstimated connection time: approximately 2m30s\n\nRemote support hours: 09:00 to 21:00\nCurrent time: 14:30\n\nWhat you will need:\nActive internet connection\nEstimated session duration: 15 to 30 minutes\nYou will receive a 6-digit access code\n\nPast remote support sessions:\n1st session: 2024-01-10 Software update (resolved)\n2nd session: 2023-12-20 Network configuration (resolved)\n\nTo start remote support, press 1.\nTo schedule an in-person visit, press 2.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('press one');
    expect(result).toContain('nine AM');
    expect(result).toContain('nine PM');
    expect(result).toContain('two thirty PM');
    expect(result).toContain('January');
  });

  it('converts repair status announcement correctly', () => {
    const input =
      'Repair status update.\n\nCase number: 20240115-0042\nCase opened: 2024-01-15T09:30\nDevice: Wireless earbuds SE\n\nCurrent status: Repair in progress (step 3 of 5)\n\nProgress steps:\nStep 1: Intake complete (2024-01-15 09:30)\nStep 2: Device received (2024-01-16 14:00)\nStep 3: Under repair\nStep 4: Quality inspection (upcoming)\nStep 5: Return shipment (upcoming)\n\nEstimated completion: 2024-01-22\nEstimated ship date: 2024-01-23\n\nRepair cost: covered under warranty\nReplacement part: battery ($15.00 value, provided at no charge)\n\nTo set up notifications, press 1.\nFor text updates, press 2.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('nine thirty AM');
    expect(result).toContain('two PM');
    expect(result).toContain('fifteen dollars');
    expect(result).toContain('press one');
  });
});
