import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 27: Credit Card Services
 *
 * Guides the customer through transaction history, rewards, and installment changes.
 */
describe('AICC Scenario 27: Credit Card Services', () => {
  it('converts card transaction history announcement correctly', () => {
    const input =
      "Visa card account summary.\n\nCard details:\nCard number: ending in 7890\nCard name: Signature Rewards Card\nPayment date: 15th of each month\nThis month's balance due:\nPurchases: $1,250.00\nInstallments: $350.00 (3-month interest-free)\nTotal balance due: $1,600.00\nPayment due date: 2024-02-15\n\nRecent transactions:\n1st transaction: 2024-01-20 Starbucks, Downtown $5.50\n2nd transaction: 2024-01-19 Amazon purchase $89.00\n3rd transaction: 2024-01-18 CVS Pharmacy $12.30\n4th transaction: 2024-01-17 AMC movie theater $28.00\n5th transaction: 2024-01-15 PayPal credit load $100.00\n\nCredit limit summary:\nTotal credit limit: $10,000.00\nAmount used: $3,450.00\nAvailable credit: $6,550.00\nCash advance limit: $5,000.00\n\nFor detailed statement, press 1.\nFor payment date change, press 2.\nFor credit limit increase, press 3.\nTo return to previous menu, press the star key.";

    const result = autoTag(input);
    expect(result).toContain('ending in seven eight nine zero');
    expect(result).toContain('one thousand six hundred dollars');
    expect(result).toContain('February');
    expect(result).toContain('ten thousand dollars');
    expect(result).toContain('press one');
  });

  it('converts card rewards announcement correctly', () => {
    const input =
      "Card rewards service.\n\nVisa Signature Rewards summary:\n\nThis month's earned rewards:\nPoints earned: 15,600 points\nAvailable points: 128,450 points\nExpiring points: 5,200 points (by 2024-03-31)\n\nMonthly benefit usage:\nCoffee shop 10% discount: 3 of 5 uses (2 remaining)\nMovie theater $6.00 off: 1 of 2 uses (1 remaining)\nOnline shopping 5% back: $45.00 of $100.00 (remaining $55.00)\n\nSavings this month:\nCoffee shop: $1.65\nMovie theater: $6.00\nOnline rewards: 2,250 points\nTotal savings: $9.90 value\n\nAnnual rewards summary:\nTotal value earned: $450.00\nAnnual fee: $30.00\nNet benefit: $420.00\n\nTo redeem points, press 1.\nFor rewards details, press 2.\nFor promotions, press 3.\nTo return to previous menu, press the star key.";

    const result = autoTag(input);
    expect(result).toContain('fifteen thousand six hundred');
    expect(result).toContain('March');
    expect(result).toContain('ten percent');
    expect(result).toContain('nine dollars and ninety cents');
    expect(result).toContain('thirty dollars');
  });

  it('converts installment plan change announcement correctly', () => {
    const input =
      'Installment plan change service.\n\nEligible single-payment transactions:\n\n1st transaction:\nTransaction date: 2024-01-18\nMerchant: Samsung Electronics Direct\nAmount: $1,890.00\n\nAvailable installment options:\n3-month interest-free: $630.00/month\n6-month interest-free: $315.00/month\n12-month (5.9% APR): $166.43/month\n24-month (7.9% APR): $89.11/month\n\n2nd transaction:\nTransaction date: 2024-01-10\nMerchant: Best Buy\nAmount: $650.00\n\nAvailable installment options:\n3-month interest-free: $216.67/month\n6-month interest-free: $108.33/month\n12-month (5.9% APR): $57.30/month\n\nInstallment deadline: one day before payment due\n\nTo change plan for transaction 1, press 1.\nTo change plan for transaction 2, press 2.\nTo convert all to installments, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('one thousand eight hundred and ninety dollars');
    expect(result).toContain('six hundred and thirty dollars');
    expect(result).toContain('six hundred and fifty dollars');
    expect(result).toContain('press one');
  });
});
