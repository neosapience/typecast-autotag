import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 13: Hospital Appointment
 *
 * Guides the patient through hospital appointment scheduling and results.
 */
describe('AICC Scenario 13: Hospital Appointment', () => {
  it('converts appointment confirmation correctly', () => {
    const input =
      'General Hospital appointment service.\n\nYour appointment details:\n\nConfirmation: H2024-01150023\nAppointment: 2024-01-20T10:30\nDepartment: Internal Medicine\nPhysician: Dr. Kim\nRoom: Main building, 3rd floor, Room 2\n\nExpected wait: approximately 15 minutes\nCheck-in deadline: 30 minutes before appointment\n\nWhat to bring:\nGovernment-issued photo ID, Insurance card\nNew patients: allow 10 minutes for intake forms\n\nParking:\nFloors B2 to B4 available\nFirst hour free, then $1.00 per 30 minutes\nFree parking up to 3 hours with appointment receipt\n\nTo reschedule, press 1.\nTo cancel, press 2.\nFor directions, press 3.\nTo repeat, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('ten thirty AM');
    expect(result).toContain('third floor');
    expect(result).toContain('fifteen minutes');
    expect(result).toContain('press one');
  });

  it('converts health screening appointment correctly', () => {
    const input =
      'Health screening center.\n\nAvailable screening appointments:\n\n1st available: 2024-01-25 (Thursday) 08:00\n2nd available: 2024-01-26 (Friday) 08:00\n3rd available: 2024-01-29 (Monday) 08:00\n\nSelected package: Premium Comprehensive Screening\nTests included: 40 standard + 15 specialized\nDuration: approximately 3 to 4 hours\nCost: $850.00 (with insurance coverage: $350.00)\n\nPreparation instructions:\nFast for 8 hours before appointment\nBegin fasting the evening before at 9:00 PM\n\nResults delivery:\nOnline: 5 to 7 days after screening\nBy mail: 10 to 14 days after screening\n\nTo select a date, press the corresponding number.\nTo view other dates, press 4.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('eight AM');
    expect(result).toContain('eight hundred and fifty dollars');
    expect(result).toContain('three hundred and fifty dollars');
    expect(result).toContain('nine PM');
  });

  it('converts visit summary announcement correctly', () => {
    const input =
      'Visit complete.\n\nVisit summary:\nDate: 2024-01-15T14:30\nPhysician: Dr. Park (Orthopedics)\nReason for visit: Lower back pain, office visit\n\nPrescription:\nPrescription number: RX-20240115-1234\nValid through: 2024-01-18 (3 days)\nFillable at any pharmacy\n\nBilling summary:\nTotal charges: $45.00\nInsurance covered: -$36.00\nYour responsibility: $9.00\nPayment processed: 2024-01-15 15:02\n\nFollow-up recommendation:\nSuggested return: in 2 weeks\nEarliest available: 2024-01-29 onward\n\nTo receive prescription by text, press 1.\nTo get a receipt, press 2.\nTo book follow-up, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('two thirty PM');
    expect(result).toContain('forty-five dollars');
    expect(result).toContain('nine dollars');
    expect(result).toContain('three oh two PM');
  });
});
