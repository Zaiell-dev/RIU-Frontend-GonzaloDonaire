import { computed, inject, Injectable, signal } from '@angular/core';
import { Hero } from '../interfaces/hero';
import { HEROES } from '../data/heroesdb';
import { mapHeroes } from '../mappers/heroes-mapper';
import { LoadingService } from './loading-service';
import { defer, delay, finalize, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private readonly HEROES_KEY = 'heroes';
  private readonly heroesState = signal<Hero[]>([]);
  readonly heroes = this.heroesState.asReadonly();
  searchString = signal<string>('');

  loadingService = inject(LoadingService);

  heroesFiltered = computed(() => {
    const searchString = this.searchString().toLowerCase();
    if (!searchString) return this.heroesState();

    return this.heroesState().filter((hero) =>
      hero.name.toLowerCase().includes(searchString),
    );
  });

  constructor() {
    this.getHeroes().subscribe();
  }
  private getHeroesFromStorage(): Hero[] {
    const stored = localStorage.getItem(this.HEROES_KEY);
    if (stored) {
      return mapHeroes(JSON.parse(stored));
    } else {
      localStorage.setItem(this.HEROES_KEY, JSON.stringify(HEROES));
      return HEROES;
    }
  }

  getHeroes(): Observable<void> {
    return defer(() => {
      this.loadingService.updateLoadingList(true);
      return of(void 0).pipe(
        delay(1000),
        tap(() => {
          this.heroesState.set(this.getHeroesFromStorage());
        }),
        finalize(() => {
          this.loadingService.updateLoadingList(false);
        }),
      );
    });
  }

  getHeroById(id: number): Hero | undefined {
    return this.heroesState().find((hero) => hero.id === id);
  }

  onChangeSearchString(searchString: string): void {
    this.searchString.set(searchString);
  }
  createHero(hero: Hero): Observable<void> {
    return defer(() => {
      this.loadingService.updateLoadingSave(true);
      return of(void 0).pipe(
        delay(1000),
        tap(() => {
          const heroes = this.heroesState();
          const newHero = {
            ...hero,
            id:
              heroes.length > 0 ? Math.max(...heroes.map((h) => h.id)) + 1 : 1,
          };
          const newHeroes = [...heroes, newHero];
          localStorage.setItem(this.HEROES_KEY, JSON.stringify(newHeroes));
          this.heroesState.set(newHeroes);
        }),
        finalize(() => {
          this.loadingService.updateLoadingSave(false);
        }),
      );
    });
  }

  updateHero(hero: Hero): Observable<void> {
    return defer(() => {
      this.loadingService.updateLoadingSave(true);
      return of(void 0).pipe(
        delay(1000),
        tap(() => {
          const heroes = this.heroesState();

          const heroExists = heroes.some((heroItem) => heroItem.id === hero.id);
          if (heroExists) {
            const updatedHeroes = heroes.map((heroItem) =>
              heroItem.id === hero.id ? hero : heroItem,
            );
            localStorage.setItem(
              this.HEROES_KEY,
              JSON.stringify(updatedHeroes),
            );
            this.heroesState.set(updatedHeroes);
          }
        }),
        finalize(() => {
          this.loadingService.updateLoadingSave(false);
        }),
      );
    });
  }

  deleteHero(id: number): Observable<void> {
    return defer(() => {
      this.loadingService.updateLoadingDelete(true);
      return of(void 0).pipe(
        delay(1000),
        tap(() => {
          const heroes = this.heroesState();
          const updatedHeroes = heroes.filter((hero) => hero.id !== id);
          localStorage.setItem(this.HEROES_KEY, JSON.stringify(updatedHeroes));
          this.heroesState.set(updatedHeroes);
        }),
        finalize(() => {
          this.loadingService.updateLoadingDelete(false);
        }),
      );
    });
  }
}
