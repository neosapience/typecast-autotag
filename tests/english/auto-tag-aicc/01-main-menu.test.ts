import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 01: Main Menu
 *
 * Tests the main menu announcement that customers hear when they first call the support line.
 */
describe('AICC Scenario 01: Main Menu', () => {
  it('converts main menu announcement correctly', () => {
    const input =
      'Thank you for calling. This call may be recorded for quality assurance.\n\nFor billing and payment, press 1.\nFor order tracking, press 2.\nFor cancellations and refunds, press 3.\nFor account information, press 4.\nFor points and coupons, press 5.\nFor events and promotions, press 6.\nFor other inquiries, press 7.\nTo speak with an agent, press 0.\n\nEstimated wait time is approximately 5m30s.\nFor self-service options, press 8.\n\nOur support hours are 09:00 to 18:00,\nlunch break is 12:00 to 13:00.\n\nTo repeat this menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('press one');
    expect(result).toContain('press zero');
    expect(result).toContain('press eight');
    expect(result).toContain('nine AM');
    expect(result).toContain('six PM');
    expect(result).toContain('twelve PM');
  });

  it('converts emergency notification correctly', () => {
    const input =
      'Thank you for calling.\nScheduled maintenance will run from 2024-01-15T22:00 to 2024-01-16T06:00.\nSome services may be unavailable during this time.\n\nFor urgent inquiries, please call 1-800-555-1234.\nWe apologize for the inconvenience.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('ten PM');
    expect(result).toContain('six AM');
    expect(result).toContain('one eight zero zero');
  });

  it('converts holiday hours announcement correctly', () => {
    const input =
      'Thank you for calling. We are currently closed.\n\nOur regular hours are Monday through Friday, 09:00 to 18:00.\nWe are closed on weekends and public holidays.\n\nHoliday closure notice:\nClosed from 2024-02-09 to 2024-02-12,\nResuming normal operations on 2024-02-13.\n\nFor urgent matters, please use our online chat.\nThank you.';

    const result = autoTag(input);
    expect(result).toContain('nine AM');
    expect(result).toContain('six PM');
    expect(result).toContain('February');
    expect(result).toContain('twenty twenty-four');
  });
});
