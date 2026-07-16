import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 14: Airline Reservation
 *
 * Guides the customer through flight booking confirmation and mileage inquiry.
 */
describe('AICC Scenario 14: Airline Reservation', () => {
  it('converts flight booking confirmation correctly', () => {
    const input =
      "SkyAir reservation confirmation service.\n\nYour reservation details:\n\nConfirmation number: SKY-2024011567\nBooking date: 2024-01-10\n\nFlight information:\nFlight: AA301\nDeparture: 2024-02-15T08:30\nFrom: Los Angeles International Airport, Terminal 2\nTo: Chicago O'Hare International Airport\nFlight time: approximately 2h30m\n\nSeat information:\nSeat number: 23A (window seat)\nCabin class: Economy\nBaggage: 1 checked bag (50 lbs), 1 carry-on\n\nFare information:\nBase fare: $450.00\nFuel surcharge: $85.00\nAirport fee: $28.00\nTotal charge: $563.00\n\nCheck-in information:\nOnline check-in: available 48 hours before departure\nAirport check-in: recommended 3 hours before departure\nBoarding cutoff: 40 minutes before departure\n\nTo change itinerary, press 1.\nTo change seat, press 2.\nFor additional services, press 3.\nTo return to previous menu, press the star key.";

    const result = autoTag(input);
    expect(result).toContain('A A');
    expect(result).toContain('two hours thirty minutes');
    expect(result).toContain('twenty-three');
    expect(result).toContain('four hundred and fifty dollars');
    expect(result).toContain('press one');
  });

  it('converts flight delay announcement correctly', () => {
    const input =
      'Flight status update.\n\nYour flight has been delayed.\n\nOriginal departure time: 2024-01-20T14:00\nRevised departure time: 2024-01-20T16:30\nDelay: 2h30m\n\nReason: Delayed inbound aircraft due to weather\n\nCompensation:\nMeal voucher: $15.00 (valid at airport restaurants)\nLounge access: complimentary (3rd floor business lounge)\n\nRevised arrival times:\nOriginal arrival: 16:30\nRevised arrival: 19:00\n\nRebooking options:\nFull refund available (no cancellation fee)\nRebook on another flight\n\nTo request a refund, press 1.\nTo find another flight, press 2.\nFor compensation info, press 3.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('two PM');
    expect(result).toContain('four thirty PM');
    expect(result).toContain('two hours thirty minutes');
    expect(result).toContain('fifteen dollars');
    expect(result).toContain('third floor');
  });

  it('converts mileage inquiry announcement correctly', () => {
    const input =
      'Mileage inquiry service.\n\nYour mileage balance:\n\nTotal miles: 45,800 miles\nAvailable miles: 43,300 miles\nExpiring miles: 2,500 miles (by 2024-06-30)\n\nRecent mileage activity:\n1st entry: 2024-01-05 LAX to ORD flight 1,200 miles\n2nd entry: 2023-12-20 NRT to LAX flight 2,500 miles\n3rd entry: 2023-12-15 LAX to NRT flight 2,500 miles\n\nAward ticket options:\nDomestic: from 10,000 miles (one-way)\nCaribbean: from 25,000 miles (one-way)\nEurope: from 30,000 miles (one-way)\n\nMembership status:\nCurrent tier: Gold\nMiles to next tier: 4,200 miles needed\nTier expiration: 2024-12-31\n\nTo redeem miles, press 1.\nFor activity details, press 2.\nFor tier benefits, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('forty-five thousand');
    expect(result).toContain('two thousand five hundred');
    expect(result).toContain('ten thousand');
    expect(result).toContain('press one');
  });
});
