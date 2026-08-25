import { computed, inject, Injectable, signal } from '@angular/core';
import { Hero } from '../interfaces/hero';
import { HEROES } from '../data/heroesdb';
import { HeroesMapper } from '../mappers/HeroesMapper';
import { Router } from '@angular/router';
import { LoadingService } from './loading-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private readonly HEROES_KEY = 'heroes';
  private _snackBar = inject(MatSnackBar);
  heroes = signal<Hero[]>([]);
  searchString = signal<string>('');

  loadingService = inject(LoadingService);
  router = inject(Router);

  heroesFiltered = computed(() => {
    const searchString = this.searchString().toLowerCase();
    if (!searchString) return this.heroes();

    return this.heroes().filter((hero) =>
      hero.name.toLowerCase().includes(searchString),
    );
  });

  constructor() {
    this.getHeroes();
  }
  private getHeroesFromStorage(): Hero[] {
    const stored = localStorage.getItem(this.HEROES_KEY);
    if (stored) {
      return HeroesMapper(JSON.parse(stored));
    } else {
      localStorage.setItem(this.HEROES_KEY, JSON.stringify(HEROES));
      return HEROES;
    }
  }

  getHeroes(): Promise<void> {
    this.loadingService.updateLoadingList(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        this.heroes.set(this.getHeroesFromStorage());
        this.loadingService.updateLoadingList(false);
        resolve();
      }, 1000);
    });
  }

  getHeroById(id: number): Hero | undefined {
    return this.heroes().find((hero) => hero.id === id);
  }

  onChangeSearchString(searchString: string): void {
    this.searchString.set(searchString);
  }
  createHero(hero: Hero): Promise<void> {
    this.loadingService.updateLoadingSave(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const heroes = this.heroes();
        const newHero = {
          ...hero,
          id: heroes.length > 0 ? Math.max(...heroes.map((h) => h.id)) + 1 : 1,
        };
        const newHeroes = [...heroes, newHero];
        localStorage.setItem(this.HEROES_KEY, JSON.stringify(newHeroes));
        this.heroes.set(newHeroes);
        this.router.navigateByUrl('/');
        this.loadingService.updateLoadingSave(false);
        this._snackBar.open('Heroe creado correctamente!', 'Cerrar', {
          duration: 2000,
        });
        resolve();
      }, 1000);
    });
  }

  updateHero(hero: Hero): Promise<void> {
    this.loadingService.updateLoadingSave(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        const heroes = this.heroes();

        const heroExists = heroes.some((heroItem) => heroItem.id === hero.id);
        if (heroExists) {
          const updatedHeroes = heroes.map((heroItem) =>
            heroItem.id === hero.id ? hero : heroItem,
          );
          localStorage.setItem(this.HEROES_KEY, JSON.stringify(updatedHeroes));
          this.heroes.set(updatedHeroes);
        }

        this.router.navigateByUrl('/');
        this.loadingService.updateLoadingSave(false);
        this._snackBar.open('Heroe actualizado correctamente!', 'Cerrar', {
          duration: 2000,
        });
        resolve();
      }, 1000);
    });
  }

  deleteHero(id: number): Promise<void> {
    return new Promise((resolve) => {
      this.loadingService.updateLoadingDelete(true);
      setTimeout(() => {
        const heroes = this.heroes();
        const updatedHeroes = heroes.filter((hero) => hero.id !== id);
        localStorage.setItem(this.HEROES_KEY, JSON.stringify(updatedHeroes));
        this.heroes.set(updatedHeroes);
        this.loadingService.updateLoadingDelete(false);
        this._snackBar.open('Heroe eliminado correctamente!', 'Cerrar', {
          duration: 2000,
        });
        resolve();
      }, 1000);
    });
  }
}
