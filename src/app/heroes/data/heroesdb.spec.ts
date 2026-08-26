import { HEROES } from './heroesdb';

describe('HEROES data', () => {
  it('should be an array of heroes with required properties', () => {
    expect(Array.isArray(HEROES)).toBeTrue();
    expect(HEROES.length).toBeGreaterThan(0);
    for (const hero of HEROES) {
      expect(hero).toEqual(
        jasmine.objectContaining({
          id: jasmine.any(Number),
          name: jasmine.any(String),
          power: jasmine.any(String),
          universe: jasmine.any(String),
        }),
      );
    }
  });
});
