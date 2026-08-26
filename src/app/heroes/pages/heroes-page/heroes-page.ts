import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HeroesService } from '../../services/heroes-service';
import { MatButtonModule } from '@angular/material/button';
import { Hero } from '../../interfaces/hero';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDelete } from '../../components/confirm-delete/confirm-delete';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-heroes-page',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './heroes-page.html',
  styleUrl: './heroes-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesPage implements OnDestroy {
  readonly dialog = inject(MatDialog);
  private readonly searchTerms = new Subject<string>();
  heroesService = inject(HeroesService);
  router = inject(Router);

  readonly paginator = viewChild(MatPaginator);
  dataSource = new MatTableDataSource<Hero>([]);
  windowWidth = signal(window.innerWidth);
  displayedColumns = computed(() => {
    const width = this.windowWidth();
    return width < 768
      ? ['name', 'actions']
      : ['id', 'name', 'power', 'universe', 'actions'];
  });
  private resizeHandler = () => {
    this.windowWidth.set(window.innerWidth);
  };

  constructor() {
    this.searchTerms
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((searchTerm) => {
        this.heroesService.onChangeSearchString(searchTerm);
      });

    effect(() => {
      this.dataSource.data = this.heroesService.heroesFiltered();
      this.dataSource.paginator = this.paginator() ?? null;
    });
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy(): void {
    this.heroesService.onChangeSearchString('');
    window.removeEventListener('resize', this.resizeHandler);
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerms.next(searchTerm);
  }

  clearSearch(searchInput: HTMLInputElement): void {
    searchInput.value = '';
    this.searchTerms.next('');
  }

  onCreateButton(): void {
    this.router.navigateByUrl('/form');
  }

  onEditButton(hero: Hero) {
    this.router.navigateByUrl(`/form?id=${hero.id}`);
  }
  onDeleteButton(hero: Hero) {
    this.dialog.open(ConfirmDelete, {
      data: {
        hero,
        onConfirmAsync: () => this.heroesService.deleteHero(hero.id),
      },
    });
  }
}
