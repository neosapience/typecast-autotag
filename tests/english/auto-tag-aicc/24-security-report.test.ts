import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 24: Security and Reporting Services
 *
 * Guides the customer through card loss reports, fraud reports, and emergency dispatch.
 */
describe('AICC Scenario 24: Security and Reporting Services', () => {
  it('converts card loss report announcement correctly', () => {
    const input =
      'Credit card loss reporting center.\n\nEmergency card loss report received.\n\nReport details:\nReport number: LST-20240120-001234\nReport date and time: 2024-01-20T15:30\nCardholder: John Smith\n\nLost card information:\nIssuer: First National Bank\nCard number: ending in 5678\nCard type: Platinum Rewards Visa\nEstimated time of loss: 2024-01-20 14:00\n\nImmediate actions completed:\nCard blocked: completed (3:30 PM)\nOnline transactions blocked: completed\n\nLast transaction:\nTime: 14:05\nLocation: Starbucks, Downtown\nAmount: $5.50\n\nSuspicious transactions since loss:\nNone detected\n\nReplacement card:\nFee: $5.00\nDelivery time: 3 to 5 days\nDelivery options: mail or branch pickup\n\nTo order replacement card, press 1.\nTo cancel loss report, press 2.\nFor recent transactions, press 3.\nFor police report, press 4.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('three thirty PM');
    expect(result).toContain('ending in five six seven eight');
    expect(result).toContain('five dollars and fifty cents');
    expect(result).toContain('five dollars');
    expect(result).toContain('press zero');
  });

  it('converts fraud report announcement correctly', () => {
    const input =
      'Financial fraud reporting center.\n\nSuspected fraud report received.\n\nReport summary:\nReport date and time: 2024-01-20T16:45\nSuspected loss amount: $5,000.00\nIncident time: 2024-01-20 15:30\n\nImmediate actions taken:\nAccount hold requested: completed\nSuspect account: First National Bank 123-456-789012\nPolice report filed: case number CYB-2024-56789\n\nProtective measures:\nAll linked accounts under monitoring: active\nTemporary transfer limit: $500.00 per day\n\nNext steps:\nPolice station visit: recommended within 3 days\nFraud hotline: 1-800-555-1234 (9 AM to 6 PM)\nClaim deadline: within 30 days of report\n\nSuspicious activity detected:\n1st event: 3:32 PM OTP verification attempt 3 times\n2nd event: 3:45 PM transfer attempt (blocked)\n\nTo file additional report, press 1.\nFor account details, press 2.\nTo connect to police, press 3.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('four forty-five PM');
    expect(result).toContain('five thousand dollars');
    expect(result).toContain('five hundred dollars');
    expect(result).toContain('one eight zero zero five five five');
    expect(result).toContain('press zero');
  });

  it('converts emergency dispatch announcement correctly', () => {
    const input =
      'SecureGuard emergency dispatch service.\n\nAlert notification:\nAlert time: 2024-01-20T22:15\nAlert location: 45 Oak Street, Unit 1203, 12th floor\nAlert type: intrusion detected (front door sensor)\n\nDispatch status:\nDispatch requested: 10:15 PM\nDispatch started: 10:16 PM\nEstimated arrival: 10:25 PM (approximately 9 minutes)\nResponding officer: Officer Johnson (badge SC-2019-1234)\nContact: 555-555-1234\n\nSite assessment:\nCCTV review: in progress\nPrevious alerts: 2 times in last 30 days (both false alarms)\n\nRecommended actions:\nMove to a safe location\nPolice dispatch available (confirm to proceed)\nDo not enter premises before officer arrives\n\nTo dispatch police, press 1.\nTo cancel alert (password required), press 2.\nTo contact officer, press 3.\nFor live CCTV, press 4.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('ten fifteen PM');
    expect(result).toContain('twelfth floor');
    expect(result).toContain('nine minutes');
    expect(result).toContain('five five five');
    expect(result).toContain('press zero');
  });
});
