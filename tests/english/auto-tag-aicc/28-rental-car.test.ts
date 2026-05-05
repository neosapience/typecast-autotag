import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 28: Rental Car Reservation and Return
 *
 * Guides the customer through rental confirmation, vehicle return, and incident reporting.
 */
describe('AICC Scenario 28: Rental Car Reservation and Return', () => {
  it('converts rental car reservation confirmation correctly', () => {
    const input =
      'Enterprise rental car reservation service.\n\nReservation details:\nReservation number: LR-2024012012345\nRenter: John Smith\nContact: 555-123-4567\n\nVehicle details:\nVehicle: Toyota Camry\nFuel type: gasoline\nPassenger capacity: 5\n\nRental schedule:\nPickup: 2024-02-01T10:00\nReturn: 2024-02-03T18:00\nRental period: 2 days (56 hours)\n\nPickup location: LAX Airport\nReturn location: LAX Airport (same location)\n\nRate details:\nBase rate: $156.00 ($52.00/day)\nLoss damage waiver: $45.00 ($15.00/day)\nGPS navigation: complimentary\nTotal charged: $201.00\n\nIncludes:\nMileage: unlimited\nFuel policy: full-to-full return\n\nTo confirm reservation, press 1.\nTo change vehicle, press 2.\nTo add options, press 3.\nTo cancel reservation, press 4.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('five five five');
    expect(result).toContain('February');
    expect(result).toContain('ten AM');
    expect(result).toContain('two hundred and one dollars');
    expect(result).toContain('press one');
  });

  it('converts vehicle return announcement correctly', () => {
    const input =
      'Vehicle return instructions.\n\nReservation number: LR-2024012012345\nScheduled return: 2024-02-03T18:00\nCurrent time: 2024-02-03T17:30\nTime remaining: 30 minutes\n\nReturn location: LAX Airport\nAddress: 2 Airport Road, Rental Car Center, Building B\nPhone: 310-123-4567\n\nPre-return checklist:\nFuel status: full tank required (currently at 1/4 tank)\nEstimated gas cost: approximately $45.00\nNearest gas station: 500 meters ahead\n\nInspection checklist:\nExterior damage check\nInterior cleanliness\nPersonal belongings\n\nExtension rates:\n1-hour extension: $6.50\n3-hour extension: $18.00\n1-day extension: $52.00 + loss damage waiver $15.00\n\nTo extend rental, press 1.\nFor return directions, press 2.\nTo confirm return, press 3.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('February');
    expect(result).toContain('six PM');
    expect(result).toContain('thirty minutes');
    expect(result).toContain('forty-five dollars');
    expect(result).toContain('six dollars and fifty cents');
  });

  it('converts rental car incident report correctly', () => {
    const input =
      'Incident report service.\n\nYour incident report has been received.\n\nReport details:\nReport number: ACC-20240203-7890\nReport time: 2024-02-03T14:25\n\nIncident details:\nIncident type: minor collision\nLocation: Pacific Coast Highway, Malibu, CA\nApproximate time: 2:20 PM\nDamage: right side mirror broken\n\nInsurance coverage check:\nLoss damage waiver: active (deductible: $50.00)\nLiability: active (unlimited)\n\nRoadside assistance:\nService requested: complete\nEstimated arrival: 30 to 45 minutes\nRoadside contact: 555-888-9999\n\nNext steps:\nPolice report: not required for single-vehicle incidents\nIncident form: required for insurance processing\nReplacement vehicle: available (within 2 hours)\n\nTo request replacement vehicle, press 1.\nFor insurance guidance, press 2.\nFor assistance status, press 3.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('February');
    expect(result).toContain('two twenty-five PM');
    expect(result).toContain('fifty dollars');
    expect(result).toContain('forty-five minutes');
    expect(result).toContain('press zero');
  });
});
