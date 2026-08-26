import { Hero } from '../interfaces/hero';

export const mapHeroes = (heroesFromStorage: Partial<Hero>[]): Hero[] => {
  if (!heroesFromStorage || !Array.isArray(heroesFromStorage)) {
    return [];
  }
  return heroesFromStorage
    .map((hero: Partial<Hero>) => ({
      id: hero.id || 0,
      name: hero.name || '',
      power: hero.power || '',
      universe: hero.universe || '',
    }))
    .filter((hero: Hero) => hero.id > 0);
};
