import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 26: Utility Services
 *
 * Guides the customer through electricity and gas bills, usage, and outage reporting.
 */
describe('AICC Scenario 26: Utility Services', () => {
  it('converts electricity bill announcement correctly', () => {
    const input =
      "City Power electricity billing service.\n\nAccount number: 12-34-5678-9012\nService address: 123 Main Street, 5th floor\n\nJanuary 2024 electric bill:\n\nBilling period: 2024-01-01 to 2024-01-31\nThis month's usage: 450 kWh\nPrevious month's usage: 380 kWh\nChange: +70 kWh (18% increase)\n\nCharges:\nBase charge: $1.60\nUsage charge: $72.45\nEnvironmental fee: $3.15\nFuel adjustment: $2.25\nTax: $7.95\nPublic goods fee: $0.80\nTotal billed: $88.20\n\nPayment due: 2024-02-15\nLate payment fee: 0.03% per day\n\nEnergy saving tip:\n15% higher than same period last year\nConsider reducing standby power use\n\nTo pay now, press 1.\nFor usage details, press 2.\nTo set up auto-pay, press 3.\nTo return to previous menu, press the star key.";

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('eighteen percent');
    expect(result).toContain('eighty-eight dollars and twenty cents');
    expect(result).toContain('February');
    expect(result).toContain('fifteen percent');
  });

  it('converts gas bill announcement correctly', () => {
    const input =
      "City Gas billing service.\n\nAccount number: GS-2024-123456\nService address: 456 Oak Avenue, 12th floor\n\nJanuary 2024 gas bill:\n\nMeter read date: 2024-01-25\nThis month's usage: 85 therms\nPrevious month's usage: 62 therms\nChange: +23 therms (37% increase)\n\nCharges:\nBase charge: $1.05\nUsage charge: $93.42\nTax: $9.45\nTotal billed: $103.92\n\nHeating usage increase notice:\nAverage temperature last 7 days: -5.3 degrees\nRecommended thermostat setting: 20 to 22 degrees\n\nMonthly usage trend:\nOctober: $27.50\nNovember: $52.78\nDecember: $68.12\nJanuary: $103.92\n\nTo pay now, press 1.\nFor usage details, press 2.\nFor energy saving tips, press 3.\nFor meter reading, press 4.\nTo return to previous menu, press the star key.";

    const result = autoTag(input);
    expect(result).toContain('twelfth floor');
    expect(result).toContain('January');
    expect(result).toContain('thirty-seven percent');
    expect(result).toContain('one hundred and three dollars and ninety-two cents');
    expect(result).toContain('press one');
  });

  it('converts power outage report announcement correctly', () => {
    const input =
      'Power outage reporting center.\n\nYour outage report has been received.\n\nReport details:\nReport number: PWR-20240120-5678\nReport time: 2024-01-20T19:30\nReport type: power outage\n\nOutage details:\nAddress: 300 Olympic Boulevard, Apt 101, Unit 1502, 12th floor\nOutage started: approximately 7:15 PM\nArea affected: entire building (approximately 120 units)\n\nResponse status:\nRepair crew dispatched: complete (7:35 PM)\nEstimated crew arrival: approximately 15 minutes (7:50 PM)\nEstimated restoration: 1 to 2 hours\n\nEmergency contacts:\nRepair supervisor: Kim Electric (555-999-8888)\nEmergency line: 123 (24 hours)\n\nSafety tips during outage:\nKeep refrigerator door closed\nAvoid using elevators\nUse flashlights or emergency lighting\n\nFor status updates, press 1.\nTo contact repair crew, press 2.\nTo report another issue, press 3.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('seven thirty PM');
    expect(result).toContain('twelfth floor');
    expect(result).toContain('fifteen minutes');
    expect(result).toContain('one to two hours');
    expect(result).toContain('press zero');
  });
});
