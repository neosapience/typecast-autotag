import { autoTag } from '../../../src/english/auto-tag';

/**
 * AICC Scenario 08: Agent Connection
 *
 * Guides the customer through the process of connecting with a live agent.
 */
describe('AICC Scenario 08: Agent Connection', () => {
  it('converts hold queue announcement correctly', () => {
    const input =
      'Agent connection service.\n\nYou are now in the queue.\nYour position: 5th in queue\nEstimated wait time: approximately 3m20s\n\nThis call may be recorded for quality purposes.\n\nWhile you wait, you can:\nCheck your balance, press 1.\nView recent transactions, press 2.\nBrowse FAQs, press 3.\n\nTo continue holding for an agent, please stay on the line.\n\nCurrent time: 14:32\nAgent hours: 09:00 to 18:00';

    const result = autoTag(input);
    expect(result).toContain('press one');
    expect(result).toContain('press two');
    expect(result).toContain('two thirty-two PM');
    expect(result).toContain('six PM');
    expect(result).toContain('nine AM');
  });

  it('converts callback offer announcement correctly', () => {
    const input =
      'Callback service available.\n\nCurrent wait times are longer than usual.\nAgents currently assisting: 25 customers\nEstimated wait: approximately 15 minutes\n\nWe can call you back instead.\nEstimated callback time: 30 minutes to 1 hour\n\nYour callback number: 555-123-4567\n(This is the number on file. To change it, press 2.)\n\nTo request a callback, press 1.\nTo update callback number, press 2.\nTo continue holding, press 3.';

    const result = autoTag(input);
    expect(result).toContain('thirty minutes');
    expect(result).toContain('fifteen minutes');
    expect(result).toContain('five five five');
    expect(result).toContain('press one');
    expect(result).toContain('press two');
  });

  it('converts post-call survey announcement correctly', () => {
    const input =
      'Your call has ended.\n\nCall summary:\nCall date: 2024-01-15T14:45\nCall duration: 12m30s\nAgent: Agent Kim (ID: 12345)\n\nA call summary will be sent to 555-123-4567.\n\nWould you like to complete a brief satisfaction survey? You will receive 500 points.\n1 - Very dissatisfied\n2 - Dissatisfied\n3 - Neutral\n4 - Satisfied\n5 - Very satisfied\n\nPress the corresponding number to rate your experience.\nTo skip the survey, press the star key.\n\nThank you for calling.';

    const result = autoTag(input);
    expect(result).toContain('January');
    expect(result).toContain('two forty-five PM');
    expect(result).toContain('twelve minutes thirty seconds');
    expect(result).toContain('five five five');
    expect(result).toContain('five hundred points');
  });
});
