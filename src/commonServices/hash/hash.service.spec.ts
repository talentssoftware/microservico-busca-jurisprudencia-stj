import { HashService } from './hash.service';
import { ConfigService } from '@nestjs/config';

describe('HashService', () => {
  let hashService: HashService;

  beforeEach(async () => {
    hashService = new HashService(
      new ConfigService({
        ARGON_SALT:
          '107393a9543b5b1598560faf4212519de4807f6597105f5065bf35ffcd2647aa',
      }),
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(hashService).toBeDefined();
    });

    it('should hash password', async () => {
      // deve retornar uma string não nula
      expect(await hashService.hashPassword('test')).toContain('$argon2id');
    });

    it('should compare password', async () => {
      const hash = await hashService.hashPassword('test');
      // deve retornar true
      expect(await hashService.comparePassword(hash, 'test')).toBe(true);
      // deve retornar false
      expect(await hashService.comparePassword(hash, 'test2')).toBe(false);
    });
  });
});
