import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 12: Insurance Services
 *
 * Provides insurance policy inquiries and claims guidance.
 */
describe('AICC Scenario 12: Insurance Services', () => {
  it('converts policy overview announcement correctly', () => {
    const input =
      'Insurance policy service.\n\nYour policy summary:\n\nPolicy number: 2023-INS-045678\nProduct: Comprehensive Health Plus\nEffective date: 2023-03-01\nExpiration date: 2033-02-28\n\nPremium information:\nMonthly premium: $89.00\nPayment method: Auto-pay on the 15th of each month\nNext payment date: 2024-02-15\nTotal premiums paid: $979.00 (11 payments)\n\nCoverage highlights:\n1st benefit: Hospitalization ($50.00 per day, up to 180 days)\n2nd benefit: Surgery ($500.00 to $3,000.00 per procedure)\n3rd benefit: Critical illness diagnosis ($30,000.00)\n\nTo file a claim, press 1.\nTo update policy, press 2.\nFor payment history, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('eighty-nine dollars');
    expect(result).toContain('February');
    expect(result).toContain('fifty dollars');
    expect(result).toContain('thirty thousand dollars');
    expect(result).toContain('press one');
  });

  it('converts insurance claim announcement correctly', () => {
    const input =
      'Insurance claim service.\n\nEligible claims based on your recent healthcare visits:\n\n1st visit: 2024-01-10 Primary care office visit\n2nd visit: 2024-01-08 Prescription at your pharmacy\n\nEstimated reimbursement:\nOffice visit: $35.00 (80% reimbursement: $28.00)\nPrescription: $12.50 (80% reimbursement: $10.00)\nTotal estimated payout: $38.00\n\nRequired documents:\nItemized receipt, Explanation of Benefits\n\nAuto-document collection available: Yes\nEstimated processing: 3 to 5 business days\n\nFor automatic claim, press 1.\nFor manual submission, press 2.\nFor claim history, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('thirty-five dollars');
    expect(result).toContain('eighty percent');
    expect(result).toContain('thirty-eight dollars');
    expect(result).toContain('press one');
  });

  it('converts premium past due notice correctly', () => {
    const input =
      'Premium payment notice.\n\nYou have unpaid premiums.\n\nUnpaid premiums:\n1st missed: December 2023 premium $89.00\n2nd missed: January 2024 premium $89.00\nTotal due: $178.00\n\nPayment deadline: 2024-01-31\nFailure to pay may result in policy lapse.\n\nPayment options:\nBank transfer account: 123-456-789012\nCredit card: press 1 to proceed\n\nNo late fees apply (within grace period).\nInstallment options: 2 to 6 payments\n\nTo pay now, press 1.\nFor installment plan, press 2.\nFor payment extension, press 3.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('eighty-nine dollars');
    expect(result).toContain('one hundred and seventy-eight dollars');
    expect(result).toContain('January');
    expect(result).toContain('press zero');
    expect(result).toContain('press one');
  });
});
