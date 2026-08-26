import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HeroesService } from './heroes-service';
import { HEROES } from '../data/heroesdb';
import { EMPTY } from 'rxjs';

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
    service = TestBed.inject(HeroesService);
    localStorage.clear();
    service.heroes.set([]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with HEROES if localStorage is empty', fakeAsync(() => {
    getHeroesSpy.and.callThrough();

    service.getHeroes().subscribe();
    tick(1000);

    expect(service.heroes().length).toBe(HEROES.length);
  }));

  it('should filter heroes by search string', () => {
    service.heroes.set(HEROES);
    service.onChangeSearchString('man');
    const filtered = service.heroesFiltered();
    expect(
      filtered.every((h) => h.name.toLowerCase().includes('man'))
    ).toBeTrue();
  });

  it('should get hero by id', () => {
    service.heroes.set(HEROES);
    const hero = service.getHeroById(1);
    expect(hero).toEqual(jasmine.objectContaining({ id: 1 }));
  });

  it('should create a new hero', fakeAsync(() => {
    service.heroes.set([]);
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

      service.heroes.set(originalHeroes);
      service.updateHero(updatedHero).subscribe();

      tick(1000);

      const currentHeroes = service.heroes();

      expect(currentHeroes).not.toBe(originalHeroes);
      expect(originalHeroes[0]).toEqual({
        id: 1,
        name: 'A',
        power: 'X',
        universe: 'U',
      });
      expect(currentHeroes[0]).toEqual(updatedHero);
    }),
  );

  it('should delete a hero', fakeAsync(() => {
    service.heroes.set([{ id: 1, name: 'A', power: 'X', universe: 'U' }]);

    service.deleteHero(1).subscribe();
    tick(1000);

    expect(service.heroes().length).toBe(0);
  }));
});
