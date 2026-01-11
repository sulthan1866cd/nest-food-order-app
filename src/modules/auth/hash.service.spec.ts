import { Test } from '@nestjs/testing';
import { HashService } from './hash.service';
import { getMockUser } from 'src/mocks/mockDatas/users.stub';

describe('HashService', () => {
  let hashService: HashService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    hashService = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(hashService).toBeDefined();
  });

  describe('hash()', () => {
    it('should return a hashed password', async () => {
      const password = getMockUser().password;

      const actual = await hashService.hash(password);
      expect(actual).not.toEqual(password);
      expect(typeof actual).toBe('string');
    });
  });

  describe('compare()', () => {
    it('should return true for matching password and hash', async () => {
      const password = getMockUser().password;
      const hashedPassword = await hashService.hash(password);

      const actual = await hashService.compare(password, hashedPassword);
      expect(actual).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = getMockUser().password;
      const wrongPassword = 'gutvcfrcyhjk1';
      const hashedPassword = await hashService.hash(password);

      const actual = await hashService.compare(wrongPassword, hashedPassword);
      expect(actual).toBe(false);
    });
  });
});
