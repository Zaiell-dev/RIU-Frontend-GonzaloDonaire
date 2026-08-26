import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { isWritableSignal } from '@angular/core';
import { HeroesService } from './heroes-service';
import { HEROES } from '../data/heroesdb';
import { EMPTY } from 'rxjs';
import { Hero } from '../interfaces/hero';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('HeroesService', () => {
  let service: HeroesService;
  let getHeroesSpy: jasmine.Spy;

  beforeEach(() => {
    getHeroesSpy = spyOn(
      HeroesService.prototype,
      'getHeroes',
    ).and.returnValue(EMPTY);
    TestBed.configureTestingModule({
      providers: [HeroesService],
    });
    localStorage.clear();
    service = TestBed.inject(HeroesService);
  });

  function loadHeroesFromStorage(heroes: Hero[]): void {
    localStorage.setItem('heroes', JSON.stringify(heroes));
    getHeroesSpy.and.callThrough();
    service.getHeroes().subscribe();
    tick(1000);
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose heroes as a readonly signal', () => {
    expect(isWritableSignal(service.heroes)).toBeFalse();
  });

  it('should initialize with HEROES if localStorage is empty', fakeAsync(() => {
    getHeroesSpy.and.callThrough();

    service.getHeroes().subscribe();
    tick(1000);

    expect(service.heroes().length).toBe(HEROES.length);
  }));

  it('should filter heroes by search string', fakeAsync(() => {
    loadHeroesFromStorage(HEROES);
    service.onChangeSearchString('man');
    const filtered = service.heroesFiltered();
    expect(
      filtered.every((h) => h.name.toLowerCase().includes('man')),
    ).toBeTrue();
  }));

  it('should get hero by id', fakeAsync(() => {
    loadHeroesFromStorage(HEROES);
    const hero = service.getHeroById(1);
    expect(hero).toEqual(jasmine.objectContaining({ id: 1 }));
  }));

  it('should create a new hero', fakeAsync(() => {
    loadHeroesFromStorage([]);
    service
      .createHero({
        id: 0,
        name: 'Test',
        power: 'Test',
        universe: 'Test',
      })
      .subscribe();

    tick(1000);

    expect(service.heroes().length).toBe(1);
  }));

  it(
    'should update an existing hero without mutating the original state',
    fakeAsync(() => {
      const originalHeroes = [
        { id: 1, name: 'A', power: 'X', universe: 'U' },
      ];
      const updatedHero = { id: 1, name: 'B', power: 'Y', universe: 'V' };

      loadHeroesFromStorage(originalHeroes);
      const originalState = service.heroes();
      service.updateHero(updatedHero).subscribe();

      tick(1000);

      const currentHeroes = service.heroes();

      expect(currentHeroes).not.toBe(originalState);
      expect(originalState[0]).toEqual({
        id: 1,
        name: 'A',
        power: 'X',
        universe: 'U',
      });
      expect(currentHeroes[0]).toEqual(updatedHero);
    }),
  );

  it('should delete a hero', fakeAsync(() => {
    loadHeroesFromStorage([
      { id: 1, name: 'A', power: 'X', universe: 'U' },
    ]);

    service.deleteHero(1).subscribe();
    tick(1000);

    expect(service.heroes().length).toBe(0);
  }));
});
