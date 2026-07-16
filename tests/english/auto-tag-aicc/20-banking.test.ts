import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 20: Banking and Financial Services
 *
 * Guides the customer through account balance inquiries, loan details, and credit card info.
 */
describe('AICC Scenario 20: Banking and Financial Services', () => {
  it('converts account balance inquiry correctly', () => {
    const input =
      'First National Bank account inquiry service.\n\nYour account summary:\n\n1st account: Checking account\nAccount number: 123-45-678901\nBalance: $3,450.00\nLast transaction: 2024-01-15 (today)\n\n2nd account: Certificate of deposit\nAccount number: 123-45-678902\nDeposited amount: $50,000.00\nMaturity date: 2024-06-30\nAPY: 3.5% annually\nEstimated interest at maturity: $875.00\n\n3rd account: Savings account\nAccount number: 123-45-678903\nCurrent balance: $6,000.00 (12 of 24 payments made)\nMonthly contribution: $500.00\nMaturity date: 2025-01-15\nAPY: 4.2% annually\n\nTotal assets:\nTotal deposits: $59,450.00\nOutstanding loans: $0.00\nNet worth: $59,450.00\n\nFor account details, press the corresponding number.\nFor transfer services, press 4.\nTo speak with a representative, press 0.';

    const result = autoTag(input);
    expect(result).toContain('three thousand four hundred and fifty dollars');
    expect(result).toContain('fifty thousand dollars');
    expect(result).toContain('June');
    expect(result).toContain('five hundred dollars');
    expect(result).toContain('press zero');
  });

  it('converts loan repayment announcement correctly', () => {
    const input =
      "Loan repayment information.\n\nLoan details:\nLoan number: L-2022-0123456\nLoan type: home mortgage\nOrigination date: 2022-06-01\nOriginal amount: $300,000.00\n\nRepayment status:\nPayment type: fully amortizing\nOutstanding balance: $285,000.00\nLoan term: 30 years (360 months)\nMonths elapsed: 19 months\n\nRate information:\nCurrent rate: 4.25% APR (variable)\nIndex rate: 3.50%\nMargin: 0.75%\nNext rate adjustment: 2024-06-01\n\nThis month's payment:\nDue date: 2024-01-25\nPrincipal: $450.00\nInterest: $1,010.00\nTotal payment: $1,460.00\nAuto-pay account: First National Bank ending in 8901\n\nEarly payoff:\nPrepayment fee: 1.2% of amount paid (until 2024-06-01)\nFee-free amount: 10% of principal per year\n\nFor payment history, press 1.\nFor early payoff, press 2.\nFor rate consultation, press 3.\nTo return to previous menu, press the star key.";

    const result = autoTag(input);
    expect(result).toContain('three hundred thousand dollars');
    expect(result).toContain('June');
    expect(result).toContain('one thousand four hundred and sixty dollars');
    expect(result).toContain('ending in eight nine zero one');
    expect(result).toContain('press one');
  });

  it('converts credit card announcement correctly', () => {
    const input =
      "Credit card account information.\n\nCard details:\nCard number: ending in 5678\nCard type: Platinum Rewards Card\nIssued: 2023-03-15\nExpires: 2028-03\n\nThis month's activity:\nPayment due date: 2024-01-25\nBalance due: $2,850.00\nPurchases: $1,500.00\nInstallments: $1,350.00 (2 plans at 3 months, 1 plan at 6 months)\n\nCredit limit summary:\nTotal credit limit: $10,000.00\nAmount used: $4,200.00\nAvailable credit: $5,800.00\nCash advance limit: $5,000.00\n\nRewards points:\nCurrent balance: 45,800 points\nPoints earned this month: 2,850 points (0.1%)\nRedemption value: $45.00\n\nFor statement details, press 1.\nTo redeem points, press 2.\nTo change payment plan, press 3.\nTo report lost card, press 4.\nTo return to previous menu, press the star key.";

    const result = autoTag(input);
    expect(result).toContain('ending in five six seven eight');
    expect(result).toContain('March');
    expect(result).toContain('two thousand eight hundred and fifty dollars');
    expect(result).toContain('ten thousand dollars');
    expect(result).toContain('press one');
  });
});
