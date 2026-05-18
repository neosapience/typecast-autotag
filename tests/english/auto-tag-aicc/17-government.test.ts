import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 17: Government Services
 *
 * Guides the customer through document requests, tax payments, and parking citations.
 */
describe('AICC Scenario 17: Government Services', () => {
  it('converts document request announcement correctly', () => {
    const input =
      'City Hall public services.\n\nSelf-service kiosk information.\n\nDocuments available:\n1: Birth certificate (fee: $4.00)\n2: Marriage certificate (fee: $4.00)\n3: Death certificate (fee: $10.00)\n4: Certified copy of ID (fee: $10.00)\n5: Notarized document (fee: $6.00)\n\nKiosk locations:\nMain building 1st floor (08:00 to 21:00)\nAnnex basement (24 hours)\n\nIn-person service:\nHours: weekdays 09:00 to 18:00\nLunch break: 12:00 to 13:00\nEstimated wait: approximately 15 minutes (currently 8 in queue)\n\nOnline services:\nGov.gov available 24 hours\nProcessing time: immediate to 1 hour\n\nTo select a document, press the corresponding number.\nFor an appointment, press 6.\nTo speak with a representative, press 0.';

    const result = autoTag(input);
    expect(result).toContain('eight AM');
    expect(result).toContain('nine AM');
    expect(result).toContain('fifteen minutes');
    expect(result).toContain('press zero');
    expect(result).toContain('press six');
  });

  it('converts tax payment announcement correctly', () => {
    const input =
      'Property tax payment notice.\n\nYour outstanding tax balance:\n\n1st unpaid: Property tax (2023, 2nd installment)\nProperty: 123 Main Street, Unit 45\nAmount: $850.00\nDue date: 2023-09-30 (past due)\nPenalty: $25.50 (3%)\nCurrent amount due: $875.50\n\n2nd unpaid: Vehicle tax (2024, 1st installment)\nAmount: $290.00\nDue date: 2024-01-31\nPenalty: none\nCurrent amount due: $290.00\n\nTotal outstanding: $1,165.50\n\nPayment methods:\nBank transfer: First National Bank 123-456-789012\nCredit card: press 1 to proceed\nOnline: tax.gov\n\nInstallment options:\n3 months: $388.50 × 3 payments\n6 months: $194.25 × 6 payments\n\nTo pay now, press 1.\nFor installment plan, press 2.\nFor payment history, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('eight hundred and fifty dollars');
    expect(result).toContain('September');
    expect(result).toContain('three percent');
    expect(result).toContain('one thousand one hundred and sixty-five');
    expect(result).toContain('press one');
  });

  it('converts parking citation announcement correctly', () => {
    const input =
      'Parking violation notice.\n\nYour citation details:\n\nCitation number: 2024-PK-012345\nViolation date and time: 2024-01-10T14:35\nViolation location: 152 Main Street, Springfield\nViolation: parking in a no-parking zone\n\nFine information:\nBase fine: $40.00\nEarly payment discount: -$8.00 (20%)\nDiscounted amount: $32.00\nEarly payment deadline: 2024-01-25\n\nLate payment schedule:\n1 month overdue: $4.00 added\n2 months overdue: $8.00 added\n3 months overdue: $12.00 added and collections\n\nAppeal information:\nDeadline: within 60 days of citation\nHow to appeal: online or in person\n\nTo pay now, press 1.\nTo appeal, press 2.\nFor payment history, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('two thirty-five PM');
    expect(result).toContain('forty dollars');
    expect(result).toContain('twenty percent');
    expect(result).toContain('press one');
  });
});
