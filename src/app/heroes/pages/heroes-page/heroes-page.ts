import {
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewChild,
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
})
export class HeroesPage {
  readonly dialog = inject(MatDialog);
  heroesService = inject(HeroesService);
  router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
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
    effect(() => {
      this.dataSource.data = this.heroesService.heroesFiltered();
    });
    window.addEventListener('resize', this.resizeHandler);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.heroesService.onChangeSearchString('');
    window.removeEventListener('resize', this.resizeHandler);
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
