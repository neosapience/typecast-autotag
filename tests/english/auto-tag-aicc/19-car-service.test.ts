import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 19: Auto Service and Repair
 *
 * Guides the customer through scheduled maintenance, repair status, and insurance claims.
 */
describe('AICC Scenario 19: Auto Service and Repair', () => {
  it('converts scheduled maintenance announcement correctly', () => {
    const input =
      'Auto service appointment service.\n\nYour vehicle information:\n\nVehicle: 2022 Toyota Camry\nRegistration date: 2022-03-15\nOdometer: 35,000 miles (last logged: 2024-01-10)\n\nMaintenance reminder:\nNext service due: 40,000 miles or 2024-03-15\nRecommended services: oil change, brake inspection\n\nAvailable appointments:\n1st slot: 2024-01-20 (Saturday) 10:00\n2nd slot: 2024-01-22 (Monday) 14:00\n3rd slot: 2024-01-25 (Thursday) 09:00\n\nEstimated costs:\nOil change: $85.00\nAir filter replacement: $25.00\nInspection labor: complimentary (under warranty)\nEstimated total: $110.00\n\nEstimated service time: approximately 1h30m to 2 hours\n\nTo select a time, press the corresponding number.\nFor other dates, press 4.\nFor cost details, press 5.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('March');
    expect(result).toContain('ten AM');
    expect(result).toContain('eighty-five dollars');
    expect(result).toContain('one hundred and ten dollars');
    expect(result).toContain('one hour thirty minutes');
  });

  it('converts repair status announcement correctly', () => {
    const input =
      'Repair status update.\n\nWork order details:\nOrder number: CS-2024-01-0089\nDate received: 2024-01-15T09:30\n\nRepair items:\n1st item: Front bumper replacement (accident repair)\n2nd item: Right headlight replacement\n3rd item: Front fender bodywork and paint\n\nCurrent status: painting in progress (70% complete)\n\nEstimated completion: 2024-01-18T17:00\nEstimated pickup: 2024-01-19 (after quality inspection)\n\nRepair costs:\nParts: $850.00\nLabor: $450.00\nPaint: $380.00\nTotal repair cost: $1,680.00\nInsurance deductible: $200.00\n\nCurtesy transportation:\nComplimentary (within 10 miles)\nAvailable hours: 09:00 to 18:00\n\nFor progress photos, press 1.\nFor cost details, press 2.\nTo schedule pickup, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('nine thirty AM');
    expect(result).toContain('seventy percent');
    expect(result).toContain('five PM');
    expect(result).toContain('press one');
  });

  it('converts insurance repair announcement correctly', () => {
    const input =
      'Insurance repair service.\n\nClaim information:\nIncident date: 2024-01-14T16:45\nIncident type: single-vehicle collision\nFault: 100% policyholder\n\nInsurance details:\nCarrier: State Farm\nPolicy number: 2023-AUTO-567890\nDeductible: $200.00\n\nRepair estimate:\nTotal repair cost: $2,350.00\nInsurance coverage: $2,150.00\nYour responsibility: $200.00\n\nRepair timeline:\nInsurance approval: expected 2024-01-16\nRepair start: 1 to 2 days after approval\nEstimated completion: 5 to 7 days after start\n\nRental car coverage:\nCoverage period: up to 14 days\nDaily limit: $50.00\n\nTo file claim, press 1.\nTo approve repairs, press 2.\nTo reserve rental car, press 3.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('four forty-five PM');
    expect(result).toContain('two thousand three hundred and fifty dollars');
    expect(result).toContain('fifty dollars');
    expect(result).toContain('press zero');
  });
});
