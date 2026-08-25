import { TestBed } from '@angular/core/testing';
import { HeroesService } from './heroes-service';
import { Router } from '@angular/router';
import { HEROES } from '../data/heroesdb';

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
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    spyOn(HeroesService.prototype, 'getHeroes');
    TestBed.configureTestingModule({
      providers: [HeroesService, { provide: Router, useValue: routerSpy }],
    });
    service = TestBed.inject(HeroesService);
    localStorage.clear();
    service.heroes.set([]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with HEROES if localStorage is empty', (done) => {
    (service.getHeroes as any).and.callThrough();
    service.getHeroes();
    setTimeout(() => {
      expect(service.heroes().length).toBe(HEROES.length);
      done();
    }, 1100);
  });

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

  it('should create a new hero', (done) => {
    service.heroes.set([]);
    service.createHero({
      id: 0,
      name: 'Test',
      power: 'Test',
      universe: 'Test',
    });
    setTimeout(() => {
      expect(service.heroes().length).toBe(1);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
      done();
    }, 1100);
  });

  it('should update an existing hero without mutating the original state', (done) => {
    const originalHeroes = [
      { id: 1, name: 'A', power: 'X', universe: 'U' },
    ];
    const updatedHero = { id: 1, name: 'B', power: 'Y', universe: 'V' };

    service.heroes.set(originalHeroes);
    service.updateHero(updatedHero);

    setTimeout(() => {
      const currentHeroes = service.heroes();

      expect(currentHeroes).not.toBe(originalHeroes);
      expect(originalHeroes[0]).toEqual({
        id: 1,
        name: 'A',
        power: 'X',
        universe: 'U',
      });
      expect(currentHeroes[0]).toEqual(updatedHero);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
      done();
    }, 1100);
  });

  it('should delete a hero', async () => {
    service.heroes.set([{ id: 1, name: 'A', power: 'X', universe: 'U' }]);
    await service.deleteHero(1);
    expect(service.heroes().length).toBe(0);
  });
});
