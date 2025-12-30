import { convertScript, autoConvert } from '../src/index';

describe('convertScript', () => {
  describe('when input has no tags', () => {
    it('should return the input unchanged', () => {
      const input = '안녕하세요, 고객님.';
      expect(convertScript(input)).toBe(input);
    });
  });

  // TODO: Add tests for each tag type
  describe('name tag', () => {
    it.todo('should convert name to character-by-character format');
  });

  describe('phone tag', () => {
    it.todo('should convert phone number to speech-friendly format');
  });

  describe('month tag', () => {
    it.todo('should convert month number to Korean month format');
  });

  describe('day tag', () => {
    it.todo('should convert day number to Korean day format');
  });

  describe('date tag', () => {
    it.todo('should convert date to Korean birth date format');
  });

  describe('minsec tag', () => {
    it.todo('should convert minutes and seconds to waiting time format');
  });

  describe('digits tag', () => {
    it.todo('should convert digits to digit-by-digit format');
  });
});

describe('autoConvert', () => {
  describe('when input has no patterns', () => {
    it('should return the input unchanged', () => {
      const input = '안녕하세요, 고객님.';
      expect(autoConvert(input)).toBe(input);
    });
  });

  // TODO: Add tests for automatic pattern detection
  describe('phone pattern detection', () => {
    it.todo('should detect and convert phone number patterns');
  });

  describe('date pattern detection', () => {
    it.todo('should detect and convert date patterns');
  });
});
