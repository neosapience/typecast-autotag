import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 22: Electronics Sales and Service
 *
 * Guides the customer through purchase consultation, installation, and warranty registration.
 */
describe('AICC Scenario 22: Electronics Sales and Service', () => {
  it('converts electronics purchase consultation correctly', () => {
    const input =
      'Electronics customer service.\n\nProduct information for your inquiry:\n\nProduct: 4-Door French Door Refrigerator\nModel number: RF85B9121AP\nColor: White\n\nPricing:\nList price: $3,890.00\nOnline special: $3,490.00 (10% off)\nCard discount: $200.00\nFinal price: $3,290.00\n\nInstallation:\nBasic installation: free\nStairs surcharge: $50.00 for 2nd floor and above\nOld appliance removal: free (limit 1 unit)\n\nDelivery estimate: 3 to 5 days after order\nWarranty: 10 years (compressor)\n\nInterest-free installments:\n6 months: $548.00/month\n12 months: $274.00/month\n24 months: $137.00/month\n\nTo buy now, press 1.\nFor other models, press 2.\nTo schedule a store visit, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('three thousand eight hundred and ninety dollars');
    expect(result).toContain('ten percent');
    expect(result).toContain('fifty dollars');
    expect(result).toContain('five hundred and forty-eight dollars');
    expect(result).toContain('press one');
  });

  it('converts installation appointment announcement correctly', () => {
    const input =
      'Installation scheduling service.\n\nYour installation request:\n\nOrder number: EL-2024012056789\nProduct: Front-load washer 21 lbs\nModel number: WF21T6300KW\n\nAvailable installation windows:\n1st slot: 2024-01-25 (Thursday) 09:00 to 12:00\n2nd slot: 2024-01-25 (Thursday) 14:00 to 17:00\n3rd slot: 2024-01-26 (Friday) 09:00 to 12:00\n\nInstallation address: 123 Main Street, 15th floor, Unit 1502\nContact number: 555-123-4567\n\nPre-installation checklist:\nWater supply connection (supply hose within 2 meters)\nDrain connection (drain hose within 2 meters)\nClearance required: 28 in wide × 32 in deep × 44 in tall\n\nOld appliance removal: yes\nRemoval fee: free\n\nTo confirm appointment, press 1.\nTo change schedule, press 2.\nTo speak with an agent, press 0.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('nine AM');
    expect(result).toContain('fifteenth floor');
    expect(result).toContain('five five five');
    expect(result).toContain('press zero');
  });

  it('converts warranty registration announcement correctly', () => {
    const input =
      'Product warranty registration service.\n\nRegistered product:\n\nSerial number: SN-2024-A1B2C3D4\nProduct: 65-inch OLED TV\nModel number: OLED65C3PUA\nPurchase date: 2024-01-15\nPurchased at: Best Buy\n\nWarranty coverage:\nBasic warranty: 1 year (until 2025-01-14)\nPanel warranty: 3 years (until 2027-01-14)\nExtended warranty: not enrolled\n\nExtended warranty options:\n2-year extension: $89.00\n3-year extension: $129.00\n5-year extension: $199.00\n\nExtended warranty benefits:\nFull repair coverage (parts and labor)\nIn-home service at no charge\nReplacement unit if unrepairable\n\nTo add extended warranty, press 1.\nFor a replacement warranty card, press 2.\nFor service request, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('eighty-nine dollars');
    expect(result).toContain('one hundred and twenty-nine dollars');
    expect(result).toContain('one hundred and ninety-nine dollars');
    expect(result).toContain('press one');
  });
});
