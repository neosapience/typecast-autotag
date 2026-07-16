import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 18: Real Estate and Rental
 *
 * Guides the customer through property listings, rent payments, and lease renewals.
 */
describe('AICC Scenario 18: Real Estate and Rental', () => {
  it('converts property listing announcement correctly', () => {
    const input =
      'Real estate listing service.\n\nProperty details for your inquiry:\n\nListing ID: R-2024-00567\nProperty type: Apartment (rental)\nLocation: 123 Oak Street, Austin, TX\n\nBuilding details:\nBuilding name: Oak Ridge Apartments\nUnit: Building 103, Unit 1502 (15th floor of 25 floors)\nBedrooms: 3\nBathrooms: 2\nAvailable from: 2024-03-01\n\nPricing:\nMonthly rent: $2,500.00\nSecurity deposit: $5,000.00 (2 months)\nMonthly utilities: approximately $250.00\n\nHighlights:\nSouth-facing, near transit (5 min walk), top school district\nRenovated 2023\n\nBroker fee: up to $3,400.00 (0.4 months)\n\nFor property details, press 1.\nTo schedule a viewing, press 2.\nFor similar listings, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('fifteenth floor');
    expect(result).toContain('March');
    expect(result).toContain('two thousand five hundred dollars');
    expect(result).toContain('five thousand dollars');
    expect(result).toContain('press one');
  });

  it('converts rent payment announcement correctly', () => {
    const input =
      "Rent payment notice.\n\nLease details:\nLease number: L-2023-04567\nProperty: 456 Elm Avenue, Suite 301, Chicago, IL\nLease term: 2023-06-01 through 2025-05-31 (2 years)\n\nMonthly rent breakdown:\nBase rent: $1,500.00\nUtilities: $150.00\nTotal monthly payment: $1,650.00\nDue date: 25th of each month\n\nThis month's payment status:\nStatus: unpaid\nDue date: 2024-01-25\nDays late: 5 days\nLate fee: $16.50 (1%)\nCurrent amount due: $1,666.50\n\nAnnual rent summary:\nTotal scheduled: $19,800.00\nPaid to date: $11,550.00 (7 payments)\nUnpaid: $1,650.00 (1 payment)\nRemaining: $6,600.00 (4 payments)\n\nTo pay now, press 1.\nFor auto-pay setup, press 2.\nFor payment history, press 3.\nTo return to previous menu, press the star key.";

    const result = autoTag(input);
    expect(result).toContain('June');
    expect(result).toContain('one thousand five hundred dollars');
    expect(result).toContain('one thousand six hundred and fifty dollars');
    expect(result).toContain('January');
    expect(result).toContain('press one');
  });

  it('converts lease expiration announcement correctly', () => {
    const input =
      'Lease expiration notice.\n\nLease details:\nLease number: L-2022-03456\nProperty: 789 Pine Road, Unit 502, Seattle, WA\nLease expiration: 2024-02-29\n\nRenewal information:\nNotice deadline: 2024-01-29 (D-14)\n\nRenewal terms:\nCurrent monthly rent: $1,800.00\nProposed monthly rent: $1,890.00 (5% increase)\n\nIf lease ends:\nSecurity deposit return: 2024-03-07 (7 days after expiration)\nRefund to registered bank account\n\nNon-renewal notice:\nRequired if owner will occupy unit\nNotice window: 6 months to 2 months before expiration\n\nTo renew lease, press 1.\nTo end lease, press 2.\nTo negotiate terms, press 3.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('February');
    expect(result).toContain('January');
    expect(result).toContain('one thousand eight hundred dollars');
    expect(result).toContain('five percent');
    expect(result).toContain('press zero');
  });
});
