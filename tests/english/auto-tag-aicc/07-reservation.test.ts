import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 07: Reservation Management
 *
 * Guides the customer through viewing and modifying service reservations.
 */
describe('AICC Scenario 07: Reservation Management', () => {
  it('converts reservation confirmation correctly', () => {
    const input =
      'Reservation lookup service.\n\nYour reservation details:\n\nConfirmation number: 20240115001\nAppointment: 2024-01-20T14:00\nService: Premium consultation (60 minutes)\nAssigned specialist: Dr. Kim\n\nLocation: Downtown Center, 3rd floor\nAddress: 123 Main Street, Suite 300\nPhone: 555-123-4567\n\nYou will receive a reminder text 30 minutes before your appointment.\n\nTo modify your reservation, press 1.\nTo cancel, press 2.\nTo hear the details again, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('two PM');
    expect(result).toContain('sixty minutes');
    expect(result).toContain('third floor');
    expect(result).toContain('five five five');
  });

  it('converts reservation change confirmation correctly', () => {
    const input =
      'Your reservation has been updated.\n\nPrevious appointment:\nDate: 2024-01-20\nTime: 14:00\n\nNew appointment:\nDate: 2024-01-22\nTime: 10:30\n\nChange fee: waived\nSame-day cancellation fee: $10.00\n\nA confirmation text has been sent to 555-123-4567.\n\nTo confirm, press 1.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('two PM');
    expect(result).toContain('ten thirty AM');
    expect(result).toContain('ten dollars');
    expect(result).toContain('five five five');
  });

  it('converts waitlist notification correctly', () => {
    const input =
      'Waitlist notice.\n\nThe time slot you requested is fully booked.\n\nRequested time: 2024-01-20T14:00\nCurrent waitlist position: 3rd\n\nEstimated wait: approximately 2h30m\nYou will be notified if a spot opens up.\n\nNotification will be sent to 555-123-4567.\n\nTo join the waitlist, press 1.\nTo view other available times, press 2.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('two PM');
    expect(result).toContain('press one');
    expect(result).toContain('two hours thirty minutes');
    expect(result).toContain('five five five');
  });
});
