import { mapHeroes } from './heroes-mapper';

describe('mapHeroes', () => {
  it('should return an empty array if input is undefined', () => {
    expect(mapHeroes(undefined as any)).toEqual([]);
  });

  it('should return an empty array if input is not an array', () => {
    expect(mapHeroes({} as any)).toEqual([]);
  });

  it('should map valid heroes and filter out those with id <= 0', () => {
    const input = [
      { id: 1, name: 'A', power: 'X', universe: 'U' },
      { id: 0, name: 'B', power: 'Y', universe: 'V' },
      { name: 'C', power: 'Z', universe: 'W' },
      { id: 2 },
    ];
    const result = mapHeroes(input);
    expect(result).toEqual([
      { id: 1, name: 'A', power: 'X', universe: 'U' },
      { id: 2, name: '', power: '', universe: '' },
    ]);
  });

  it('should fill missing properties with default values', () => {
    const input = [{ id: 3 }];
    const result = mapHeroes(input);
    expect(result[0]).toEqual({ id: 3, name: '', power: '', universe: '' });
  });

  it('should return empty array if all heroes have id <= 0', () => {
    const input = [{ id: 0 }, { id: -1 }];
    expect(mapHeroes(input)).toEqual([]);
  });
});
