import { autoLecture } from '../../../src/english/auto-tag';

describe('autoTag - lecture (lesson/chapter auto-tagging)', () => {
  describe('lesson format', () => {
    it('converts Lesson N', () => {
      expect(autoLecture('Lesson 5')).toContain('Lesson');
      expect(autoLecture('Lesson 5')).toContain('five');
    });

    it('converts lesson N', () => {
      expect(autoLecture('lesson 10')).toContain('ten');
    });
  });

  describe('chapter format', () => {
    it('converts Chapter N', () => {
      expect(autoLecture('Chapter 3')).toContain('Chapter');
      expect(autoLecture('Chapter 3')).toContain('three');
    });
  });

  describe('episode format', () => {
    it('converts Episode N', () => {
      expect(autoLecture('Episode 12')).toContain('Episode');
      expect(autoLecture('Episode 12')).toContain('twelve');
    });
  });

  describe('part format', () => {
    it('converts Part N', () => {
      expect(autoLecture('Part 2')).toContain('Part');
      expect(autoLecture('Part 2')).toContain('two');
    });
  });

  describe('unit/section format', () => {
    it('converts Unit N', () => {
      expect(autoLecture('Unit 7')).toContain('seven');
    });

    it('converts Section N', () => {
      expect(autoLecture('Section 4')).toContain('four');
    });
  });

  describe('lectures in context', () => {
    it('converts lectures in sentences', () => {
      expect(autoLecture('Start with Lesson 1')).toContain('one');
    });
  });

  describe('multiple lectures', () => {
    it('converts all lectures', () => {
      const result = autoLecture('Chapter 1 and Chapter 2');
      expect(result).toContain('one');
      expect(result).toContain('two');
    });
  });
});
