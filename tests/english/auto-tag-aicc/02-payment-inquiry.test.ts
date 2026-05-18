import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 02: Billing and Payment Inquiry
 *
 * Guides the customer through billing and payment inquiries.
 */
describe('AICC Scenario 02: Billing and Payment Inquiry', () => {
  it('converts billing amount announcement correctly', () => {
    const input =
      'Billing information.\n\nYour current balance due is $59.90.\nPayment due date is 2024-01-25.\n\nBilling breakdown:\nBase plan: $39.90\nAdd-on services: $15.00\nDiscount applied: -$5.00\nTotal including tax: $59.90\n\nTo set up auto-pay, press 1.\nTo pay by credit card, press 2.\nTo receive a billing summary by text, press 3.\nTo return to the previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('fifty-nine dollars and ninety cents');
    expect(result).toContain('January');
    expect(result).toContain('thirty-nine dollars and ninety cents');
    expect(result).toContain('press one');
    expect(result).toContain('press two');
  });

  it('converts past due notice correctly', () => {
    const input =
      'Past due notice.\n\nYou currently have 2 unpaid invoices.\n\n1st past due: December 2023 billing $45.00\nDue date: 2023-12-25 (30 days overdue)\n\n2nd past due: January 2024 billing $52.00\nDue date: 2024-01-25 (5 days overdue)\n\nTotal amount due: $97.00\nLate fee of $2.50 brings your total to $99.50.\n\nTo pay now, press 1.\nFor a payment plan, press 2.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('ninety-seven dollars');
    expect(result).toContain('ninety-nine dollars and fifty cents');
    expect(result).toContain('December');
    expect(result).toContain('January');
    expect(result).toContain('press zero');
  });

  it('converts payment confirmation correctly', () => {
    const input =
      'Your payment has been processed successfully.\n\nPayment details:\nAmount paid: $125.00\nPayment method: Credit card\nPayment date: 2024-01-15T14:32\nConfirmation number: 12345678\n\nTo receive a receipt, press 1.\nTo return to the main menu, press the star key.\n\nThank you for your payment.';

    const result = autoTag(input);
    expect(result).toContain('one hundred and twenty-five dollars');
    expect(result).toContain('January');
    expect(result).toContain('two thirty');
    expect(result).toContain('PM');
    expect(result).toContain('one two three four five six seven eight');
  });
});
