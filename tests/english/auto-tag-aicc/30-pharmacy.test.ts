import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 30: Pharmacy and Health Consultation
 *
 * Guides the customer through prescription pickup, medication instructions, and health consultations.
 */
describe('AICC Scenario 30: Pharmacy and Health Consultation', () => {
  it('converts prescription pickup announcement correctly', () => {
    const input =
      'Wellness Pharmacy prescription service.\n\nYour prescription has been received.\n\nRx details:\nRx number: RX-20240120-4567\nReceived: 2024-01-20T10:30\nPrescribing hospital: General Hospital\n\nEstimated ready time:\nExpected ready: 11:15 (approximately 45 minutes)\nPickup window: 11:15 to 21:00\n\nPrescription summary:\nTotal medications: 4 items\nCopay: $8.50\n\nPickup options:\n1: In-store pickup (123 Main Street)\n2: Express delivery ($4.00, 30 minutes to 1 hour)\n3: Standard delivery (free, next-day delivery)\n\nStore hours:\nWeekday: 09:00 to 21:00\nSaturday: 09:00 to 18:00\nSunday and holidays: closed\n\nTo select pickup method, press the corresponding number.\nFor prescription status, press 4.\nTo speak with a pharmacist, press 0.';

    const result = autoTag(input);
    expect(result).toContain('ten thirty AM');
    expect(result).toContain('forty-five minutes');
    expect(result).toContain('eight dollars and fifty cents');
    expect(result).toContain('nine AM');
    expect(result).toContain('press zero');
  });

  it('converts medication instructions announcement correctly', () => {
    const input =
      'Medication instructions service.\n\nYour prescription medication guide:\n\nPrescription period: 2024-01-20 to 2024-01-26 (7 days supply)\n\nMedications:\n\n1st medication: Tylenol 500mg\nInstructions: 3 times daily, 30 minutes after meals\nDose: 1 tablet\nDosing times: 08:00, 13:00, 19:00\n\n2nd medication: Antibiotic 250mg\nInstructions: 2 times daily, morning and evening after meals\nDose: 1 tablet\nDosing times: 08:00, 19:00\nNote: separate from dairy products by 2 hours\n\n3rd medication: Antacid 20mg\nInstructions: 1 time daily, 30 minutes before breakfast\nDose: 1 tablet\nDosing time: 07:30\n\nSide effects:\nAvoid driving if drowsy or dizzy\nStop and call if allergic reaction occurs\n\nFor medication reminders, press 1.\nFor side effect consultation, press 2.\nFor pharmacist, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('eight AM');
    expect(result).toContain('seven PM');
    expect(result).toContain('two hours');
    expect(result).toContain('press one');
  });

  it('converts health consultation announcement correctly', () => {
    const input =
      'Health consultation service.\n\nAvailable consultation types:\n\n1: Medication consultation\nAvailable: 09:00 to 21:00\nEstimated wait: approximately 3 minutes\nFee: free\n\n2: Nutritional supplement consultation\nAvailable: 09:00 to 18:00\nEstimated wait: approximately 5 minutes\nFee: free\n\n3: Chronic condition management\nAvailable: 10:00 to 17:00 (by appointment)\nExpected session duration: 15 to 30 minutes\nFee: $5.00\n\nCurrent time: 14:30\nPharmacists on duty: 2\n\nFrequently asked questions:\nMissed dose: take immediately if within 1 hour\nCombining antihistamine with cold medicine: consultation needed\nPregnancy safety: consult doctor or pharmacist\n\nTo select a consultation, press the corresponding number.\nFor FAQ, press 4.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('nine AM');
    expect(result).toContain('three minutes');
    expect(result).toContain('five dollars');
    expect(result).toContain('two thirty PM');
    expect(result).toContain('thirty minutes');
  });
});
