import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 16: Education and Course Enrollment
 *
 * Guides the customer through course enrollment, progress, and exam schedules.
 */
describe('AICC Scenario 16: Education and Course Enrollment', () => {
  it('converts course enrollment announcement correctly', () => {
    const input =
      'SmartLearning course information service.\n\nCourses currently available for enrollment:\n\nCourse: Business English Communication Masterclass\nInstructor: Prof. Kim\nEnrollment period: 2024-02-01 through 2024-04-30 (3 months)\nClass schedule: Monday, Wednesday, Friday 19:00 to 21:00\n\nCourse details:\nTotal sessions: 36 sessions\nSession duration: 2 hours\nClass size: 15 students (currently enrolled: 8)\n\nTuition:\nList price: $1,200.00\nEarly enrollment discount: -$120.00 (10%)\nMultiple course discount: additional 5% off\nFinal tuition: $1,080.00\n\nPayment options:\nFull payment: $1,080.00\n3-month interest-free: $360.00 × 3 payments\n6-month installment: $185.00 × 6 payments\n\nTo enroll, press 1.\nFor other courses, press 2.\nTo schedule a consultation, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('February');
    expect(result).toContain('seven PM');
    expect(result).toContain('one thousand eighty dollars');
    expect(result).toContain('three hundred and sixty dollars');
    expect(result).toContain('press one');
  });

  it('converts course progress announcement correctly', () => {
    const input =
      'Course progress update.\n\nYou are enrolled in 2 courses.\n\n1st course: TOEFL Prep 900\nProgress: 65% (lesson 26 of 40)\nDays remaining: 45 days (until 2024-03-15)\nLast studied: 2024-01-14 (yesterday)\nAverage study time: 1h20m per day\n\n2nd course: Business Japanese\nProgress: 30% (lesson 9 of 30)\nDays remaining: 60 days (until 2024-03-30)\nLast studied: 2024-01-10 (5 days ago)\nAverage study time: 45m per day\n\nLearning highlights:\nTotal study time: 85 hours 32 minutes\nBadges earned: 7\nRanking: top 15%\n\nExtension options:\n1-month extension: $99.00 (30% off)\n2-month extension: $180.00 (40% off)\n\nFor course details, press the corresponding number.\nFor an extension, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('sixty-five percent');
    expect(result).toContain('March');
    expect(result).toContain('one hour twenty minutes');
    expect(result).toContain('fifteen percent');
    expect(result).toContain('ninety-nine dollars');
  });

  it('converts exam schedule announcement correctly', () => {
    const input =
      'Exam and certification information.\n\nYour registered exam details:\n\nExam: TOEFL iBT Session 95\nExam date: 2024-02-25T09:30\nExam location: University Center, Room 302\nCandidate number: 2024-02-1234567\n\nExam schedule:\nCheck-in deadline: 09:20\nListening section: 09:30 to 10:15 (45 minutes)\nReading section: 10:15 to 11:30 (75 minutes)\nTotal exam duration: 2 hours\n\nRequired items:\nGovernment-issued photo ID\nAdmit card (printed or mobile)\nNo. 2 pencil\n\nScore release:\nOnline: 2024-03-08T14:00\nMailed report: estimated 2024-03-15\n\nFor directions, press 1.\nTo reschedule, press 2.\nFor score inquiry, press 3.\nTo return to previous menu, press the star key.';

    const result = autoTag(input);
    expect(result).toContain('February');
    expect(result).toContain('nine thirty AM');
    expect(result).toContain('forty-five minutes');
    expect(result).toContain('two hours');
    expect(result).toContain('two PM');
  });
});
