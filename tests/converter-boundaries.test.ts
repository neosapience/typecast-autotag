import {
  fraction as koreanFraction,
  fractionWithContext as koreanFractionWithContext,
} from '../src/korean/tags/fraction';
import { inch as koreanInch } from '../src/korean/tags/inch';
import { volume as koreanVolume } from '../src/korean/tags/volume';
import { dataCapacity as koreanDataCapacity } from '../src/korean/tags/data-capacity';
import { distanceWithContext as koreanDistanceWithContext } from '../src/korean/tags/distance';
import { yearMonth as koreanYearMonth } from '../src/korean/tags/date';
import { korean as ko, english as en } from '../src';
import {
  digitToEnglish,
  digitToPhoneEnglish,
  digitToPhoneticEnglish,
  numberToEnglish,
  numberToOrdinal,
  getOrdinalSuffix,
  hourToEnglish,
  hourToEnglish24,
  formatOrdinal,
} from '../src/english/utils/number-to-english';

describe('measurement boundaries', () => {
  const measurements = [
    [en.inch, 'in', 'inches', 'zero', 'one', 'point'],
    [en.distance, 'm', 'meters', 'zero', 'one', 'point'],
    [en.weight, 'kg', 'kilograms', 'zero', 'one', 'point'],
    [en.volume, 'ml', 'milliliters', 'zero', 'one', 'point'],
    [en.mile, 'miles', 'miles', 'zero', 'one', 'point'],
    [en.area, 'm²', 'square meters', 'zero', 'one', 'point'],
    [en.dataCapacity, 'GB', 'gigabytes', 'zero', 'one', 'point'],
    [koreanInch, 'in', '인치', '영', '일', '쩜'],
    [ko.distance, 'm', '미터', '영', '일', '쩜'],
    [ko.weight, 'kg', '킬로그램', '영', '일', '쩜'],
    [koreanVolume, 'ml', '밀리리터', '영', '일', '쩜'],
    [ko.mile, 'miles', '마일', '영', '일', '쩜'],
    [ko.area, 'm²', '제곱미터', '영', '일', '쩜'],
    [koreanDataCapacity, 'GB', '기가바이트', '영', '일', '쩜'],
  ] as const;

  it.each(measurements)(
    '%p handles zero, decimals, spacing, and invalid input',
    (convert, unit, spoken, zero, one, point) => {
      expect(convert(`0${unit}`)).toBe(`${zero} ${spoken}`);
      expect(convert(`0.1${unit}`)).toBe(`${zero} ${point} ${one} ${spoken}`);
      expect(convert(`1.0${unit}`, { includeSpace: false })).toBe(
        `${one} ${point} ${zero}${spoken}`
      );
      for (const input of ['', ' ', 'invalid']) expect(convert(input)).toBe(input);
    }
  );

  it.each([
    ['1in', 'one inch'],
    ['2in', 'two inches'],
    ['1,000in', 'one thousand inches'],
    ['0.5inches', 'zero point five inches'],
    ['55"', 'fifty-five inches'],
  ])('reads inches: %s', (input, expected) => expect(en.inch(input)).toBe(expected));

  it.each([
    ['500m ahead', 'five hundred meters ahead'],
    ['about 1km', 'about one kilometer'],
    ['1.5ft away', 'one point five feet away'],
    ['5m', 'five meters'],
    ['invalid', 'invalid'],
  ])('preserves English distance context: %s', (input, expected) =>
    expect(en.distanceWithContext(input)).toBe(expected)
  );

  it.each([
    ['0m 전방', '영 미터 전방'],
    ['0.5m 전방', '영 쩜 오 미터 전방'],
    ['1.5m 앞', '일 쩜 오 미터 앞'],
    ['5km', '오 킬로미터'],
    ['invalid', 'invalid'],
    ['', ''],
    [',m 전방', ',m 전방'],
  ])('preserves Korean distance context: %s', (input, expected) =>
    expect(koreanDistanceWithContext(input)).toBe(expected)
  );

  it.each([
    ['1205', 'twelve oh five'],
    ['302', 'three oh two'],
    ['315', 'three fifteen'],
    ['12', 'one two'],
    ['invalid', 'invalid'],
    ['', ''],
    [' ', ' '],
  ])('reads grouped rooms: %s', (input, expected) =>
    expect(en.roomNumber(input, { style: 'grouped' })).toBe(expected)
  );

  it.each([
    ['1/2', 'one half'],
    ['3/2', 'three halves'],
    ['1/4', 'one quarter'],
    ['3/4', 'three quarters'],
    ['1/8', 'one eighth'],
    ['2/3', 'two thirds'],
    ['1/0', '1/0'],
    ['invalid', 'invalid'],
    ['', ''],
  ])('reads fractions: %s', (input, expected) => expect(en.fraction(input)).toBe(expected));

  it('supports slash fractions and attached context', () => {
    expect(en.fraction('1/4', { style: 'slash' })).toBe('one over four');
    expect(en.fractionWithContext('3/4 full')).toBe('three quarters full');
    expect(en.fractionWithContext('1/4')).toBe('one quarter');
    expect(en.fractionWithContext('')).toBe('');
  });
});

describe('duration normalization and alternate formats', () => {
  it.each([
    ['0h', '영 시간'],
    ['100h', '백 시간'],
    ['0m', '영 분'],
    ['0s', '영 초'],
    ['.5s', '영 쩜 오 초'],
    ['1.s', '일 초'],
    ['1.2.3s', '1.2.3 초'],
    ['90s', '일 분 삼십 초'],
    ['60m', '한 시간 영 분'],
    ['3600', '한 시간 영 초'],
    ['0h~100h', '영 시간에서 백 시간'],
    ['0m~1m', '영 분에서 일 분'],
    ['0s~.5s', '영 초에서 영 쩜 오 초'],
    ['60~90', '일 분 영 초에서 일 분 삼십 초'],
    ['invalid', 'invalid'],
    ['invalid~invalid', 'invalid~invalid'],
  ])('normalizes Korean duration %s', (input, expected) =>
    expect(ko.minsec(input, { normalize: true })).toBe(expected)
  );

  it('preserves a duration range with prefix and suffix', () => {
    expect(ko.minsec('90s~120s', { normalize: true, prefix: '약 ', suffix: ' 소요' })).toBe(
      '약 일 분 삼십 초에서 이 분 영 초 소요'
    );
  });

  it.each([
    ['1시간1분1초', 'one hour one minute one second'],
    ['2시간2분2초', 'two hours two minutes two seconds'],
    ['1시간1초', 'one hour one second'],
    ['0시간0분0초', '0시간0분0초'],
    ['1분1초', 'one minute one second'],
    ['2분2초', 'two minutes two seconds'],
    ['0분', '0분'],
    ['1초', 'one second'],
    ['0초', '0초'],
    ['1hr1min1sec', 'one hour one minute one second'],
    ['2hr2min2sec', 'two hours two minutes two seconds'],
    ['1hr1sec', 'one hour one second'],
    ['0hr0min0sec', '0hr0min0sec'],
    ['1min1sec', 'one minute one second'],
    ['2min2sec', 'two minutes two seconds'],
    ['0min', '0min'],
    ['1sec', 'one second'],
    ['0sec', '0sec'],
    ['0h0m0s', '0h0m0s'],
  ])('reads alternate English duration %s', (input, expected) =>
    expect(en.minsec(input)).toBe(expected)
  );
});

describe('calendar boundaries', () => {
  it.each([
    ['2024년6월16일', 'June sixteenth, twenty twenty-four'],
    ['2024년6월', 'June twenty twenty-four'],
    ['2024년', 'twenty twenty-four'],
    ['6월16일', 'June sixteenth'],
  ])('supports documented English date input %s', (input, expected) =>
    expect(en.date(input)).toBe(expected)
  );

  it.each([en.date, ko.date])('preserves invalid month names and calendar dates', (convert) => {
    for (const input of [
      'Unknown 16 2024',
      '16 Unknown 2024',
      'Unknown 2024',
      '2024-13-01',
      '2023-02-29',
      '2024-04-31',
    ])
      expect(convert(input)).toBe(input);
  });

  it.each([en.yearMonth, koreanYearMonth])('preserves non-year-month input', (convert) => {
    expect(convert('')).toBe('');
    expect(convert('unknown')).toBe('unknown');
  });

  it('validates English year-month boundaries', () => {
    expect(en.yearMonth('2024-00')).toBe('2024-00');
    expect(en.yearMonth('2024-13')).toBe('2024-13');
    expect(en.yearMonth('2024-01 onward')).toBe('January twenty twenty-four onward');
  });
});

describe('number readings', () => {
  it.each([digitToEnglish, digitToPhoneEnglish, digitToPhoneticEnglish])(
    'validates single digits',
    (convert) => {
      for (const input of ['x', '-1', '10']) expect(convert(input)).toBe(input);
      expect(convert('0')).toBe('zero');
    }
  );

  it('supports phonetic niner', () => expect(digitToPhoneticEnglish('9')).toBe('niner'));

  it.each([
    [0, 'zero'],
    [-1, 'minus one'],
    [0.5, 'zero point five'],
    [1.5, 'one point five'],
    [1000000000000000, 'one quadrillion'],
  ])('reads number %s', (input, expected) => expect(numberToEnglish(input)).toBe(expected));

  it.each([
    [0, 'zero'],
    [-1, 'minus one'],
    [11, 'eleventh'],
    [20, 'twentieth'],
    [21, 'twenty-first'],
    [100, 'one hundredth'],
    [111, 'one hundred and eleventh'],
    [1000, 'one thousandth'],
    [1000000, 'one millionth'],
    [1000000000, 'one billionth'],
    [101, 'one hundred first'],
  ])('reads ordinal %s', (input, expected) => expect(numberToOrdinal(input)).toBe(expected));

  it.each([
    [1, 'st'],
    [2, 'nd'],
    [3, 'rd'],
    [4, 'th'],
    [11, 'th'],
    [12, 'th'],
    [13, 'th'],
    [-21, 'st'],
  ] as const)('formats ordinal suffix %s', (input, suffix) => {
    expect(getOrdinalSuffix(input)).toBe(suffix);
    expect(formatOrdinal(input)).toBe(`${input}${suffix}`);
  });

  it('reads twelve-hour and twenty-four-hour boundaries', () => {
    expect(hourToEnglish(0)).toBe('twelve');
    expect(hourToEnglish(13)).toBe('one');
    expect(hourToEnglish24(0)).toBe('zero');
    expect(hourToEnglish24(23)).toBe('twenty-three');
    expect(hourToEnglish24(-1)).toBe('');
    expect(hourToEnglish24(24)).toBe('');
  });
});

describe('alternate English output options', () => {
  it.each(['1st floor', 'floor 1', '1층'])('supports cardinal floor labels for %s', (input) => {
    expect(en.floor(input)).toBe('first floor');
    expect(en.floor(input, { format: 'cardinal' })).toBe('floor one');
  });
  it.each(['0th floor', 'floor 0', '0층'])('reads ground floor %s', (input) =>
    expect(en.floor(input)).toBe('ground floor')
  );
  it.each([
    [NaN, 'NaN'],
    [Infinity, 'Infinity'],
    [-Infinity, '-Infinity'],
    [0, 'ground floor'],
    [-1, 'basement one'],
    [1.5, 'first floor'],
  ] as const)('handles numeric floor %s', (input, expected) =>
    expect(en.floor(input)).toBe(expected)
  );
  it('supports numeric cardinal floors', () =>
    expect(en.floor(2, { format: 'cardinal' })).toBe('floor two'));
  it.each([
    ['', ''],
    [' ', ' '],
    ['unknown', 'unknown'],
    ['Chapter IV', 'Chapter four'],
    ['Part VI', 'Part six'],
    ['0강', 'zeroth lecture'],
    [',강', ',강'],
  ])('reads lecture boundaries %s', (input, expected) => expect(en.lecture(input)).toBe(expected));
  it('supports cardinal lecture labels', () =>
    expect(en.lecture('2강', { format: 'cardinal' })).toBe('lecture two'));
  it.each([
    ['', ''],
    [' ', ' '],
    ['unknown', 'unknown'],
    [',℃', ',℃'],
    ['0℃', 'zero degrees Celsius'],
    ['-0.5℃', 'minus zero point five degrees Celsius'],
    ['1.5℃', 'one point five degrees Celsius'],
    ['+5c', 'five Celsius'],
  ])('reads temperature boundaries %s', (input, expected) =>
    expect(en.temperature(input)).toBe(expected)
  );
  it('supports temperature spacing and ranges', () => {
    expect(en.temperature('5℃', { includeSpace: false })).toBe('fivedegrees Celsius');
    expect(en.temperatureRange('5℃ to 10℃')).toBe('five degrees Celsius to ten degrees Celsius');
    expect(en.temperatureRange('5℃')).toBe('5℃');
    expect(en.temperatureRange('')).toBe('');
  });
  it.each([
    ['오전 12시', 'twelve AM'],
    ['오후 2시 5분 1초', 'two oh five and one second PM'],
    ['오후 12시', 'twelve PM'],
    ['3시', 'three AM'],
    ['12 AM', 'twelve AM'],
    ['12 PM', 'twelve PM'],
    ['2:05:01 PM', 'two oh five and one second PM'],
    ['093001', 'nine thirty and one second AM'],
    ['09:30:60', '09:30:60'],
  ])('reads time boundary %s', (input, expected) => expect(en.time(input)).toBe(expected));
  it('supports explicit zero seconds and 24-hour singular seconds', () => {
    expect(en.time('09:00', { includeSeconds: true })).toBe('nine and zero seconds AM');
    expect(en.time('09:00', { use24Hour: true, includeSeconds: true })).toBe(
      'oh nine hundred and zero seconds'
    );
    expect(en.time('09:05:01', { use24Hour: true })).toBe('oh nine oh five and one second');
    expect(en.time('14:30:02', { use24Hour: true })).toBe('fourteen thirty and two seconds');
  });
  it.each([
    [NaN, 'not a number'],
    [Infinity, 'infinity'],
    [-Infinity, 'minus infinity'],
    [-2, 'minus two'],
    [0, 'zero'],
    [',', ','],
    ['Number ,', 'Number ,'],
    ['Number 0', 'Number zero'],
    ['No. 0', 'Number zero'],
    ['no. 0', 'number zero'],
    ['#0', 'number zero'],
  ] as const)('reads numeric labels and exceptional values %s', (input, expected) =>
    expect(en.numberTag(input)).toBe(expected)
  );
  it('supports custom suffix spacing', () => {
    expect(en.numberTag(2, { suffix: '번', includeSpace: false })).toBe('two번');
    expect(en.numberTag(2, { suffix: 'items' })).toBe('two items');
  });
});

describe('year formats and Korean fraction context', () => {
  it.each(['year 2024', '2024', '2024-2025'])('supports full year readings for %s', (input) => {
    const expected =
      input === 'year 2024'
        ? 'year two thousand twenty-four'
        : input === '2024'
          ? 'two thousand twenty-four'
          : 'two thousand twenty-four to two thousand twenty-five';
    expect(en.year(input, { style: 'full' })).toBe(expected);
  });
  it.each([
    [NaN, 'NaN'],
    [Infinity, 'Infinity'],
    [-1, '-1'],
    [10000, 'ten thousand'],
    [1000, 'one thousand'],
    [1001, 'one thousand one'],
    [999, 'nine hundred and ninety-nine'],
    [5, 'five'],
    [',', ','],
    ['year ,', 'year ,'],
    [',-2024', ',-2024'],
    ['2024-,', '2024-,'],
  ] as const)('handles year boundary %s', (input, expected) =>
    expect(en.year(input)).toBe(expected)
  );
  it('supports attached year suffix', () =>
    expect(en.year(2024, { includeSuffix: true, includeSpace: false })).toBe(
      'twenty twenty-fouryear'
    ));
  it('supports fractions with context and explicit spacing', () => {
    expect(koreanFraction('0/4')).toBe('사 분의 영');
    expect(koreanFraction('1/4', { includeSpace: false })).toBe('사분의일');
    expect(koreanFractionWithContext('0/4 잔량')).toBe('사 분의 영 잔량');
    expect(koreanFractionWithContext('1/4', { includeSpace: false })).toBe('사분의일');
    for (const input of ['', ' ', 'invalid', '1/0 잔량'])
      expect(koreanFractionWithContext(input)).toBe(input);
  });
});
