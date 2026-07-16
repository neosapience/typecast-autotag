import { autoTag, extractAutoTags, SUPPORTED_TTS_LANGUAGES } from '../src';
import fixtureData from './fixtures/aicc-detailed-scenarios.json';

type Fixture = {
  generatedFrom: string;
  scenarioIds: string[];
  scenarios: Record<string, string[]>;
  expectedTagSequences: Record<string, string[]>;
  expectedOutputDigits: Record<string, string[]>;
};

const fixture = fixtureData as Fixture;
const cases = SUPPORTED_TTS_LANGUAGES.flatMap((language) =>
  fixture.scenarios[language].map((input, index) => ({
    language,
    scenario: fixture.scenarioIds[index],
    input,
    expectedTagSequence: fixture.expectedTagSequences[language][index],
    expectedOutputDigits: fixture.expectedOutputDigits[language][index],
  }))
);

describe('multilingual detailed AICC scenarios', () => {
  it('contains all 32 Korean AICC domains for every official TTS language', () => {
    expect(fixture.scenarioIds).toHaveLength(32);
    expect(new Set(fixture.scenarioIds).size).toBe(32);
    expect(Object.keys(fixture.scenarios).sort()).toEqual([...SUPPORTED_TTS_LANGUAGES].sort());
    expect(Object.keys(fixture.expectedTagSequences).sort()).toEqual(
      [...SUPPORTED_TTS_LANGUAGES].sort()
    );
    expect(Object.keys(fixture.expectedOutputDigits).sort()).toEqual(
      [...SUPPORTED_TTS_LANGUAGES].sort()
    );

    for (const language of SUPPORTED_TTS_LANGUAGES) {
      expect(fixture.scenarios[language]).toHaveLength(32);
      expect(fixture.expectedTagSequences[language]).toHaveLength(32);
      expect(fixture.expectedOutputDigits[language]).toHaveLength(32);
      expect(fixture.scenarios[language].every((input) => input.trim().length > 0)).toBe(true);
      expect(fixture.expectedTagSequences[language].every((sequence) => sequence.length > 0)).toBe(
        true
      );
    }
  });

  it.each(cases)(
    '$language/$scenario processes without corrupting content',
    ({ language, input, expectedTagSequence, expectedOutputDigits }) => {
      const matches = extractAutoTags(input, { language });
      const output = autoTag(input, { language });

      expect(matches.map(({ tagType }) => tagType).join('|')).toBe(expectedTagSequence);
      expect(output).not.toBe(input);
      expect(output).not.toMatch(/(?:undefined|NaN|\[object Object\])/);
      expect((output.match(/\p{Nd}+/gu) ?? []).join('|')).toBe(expectedOutputDigits);

      let previousEnd = 0;
      for (const match of matches) {
        expect(match.start).toBeGreaterThanOrEqual(previousEnd);
        expect(match.end).toBeGreaterThan(match.start);
        expect(input.slice(match.start, match.end)).toBe(match.original);
        previousEnd = match.end;
      }
    }
  );
});
