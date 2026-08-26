import {
  Component,
  inject,
  signal,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroesService } from '../../services/heroes-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SeeInUppercase } from '../../directives/see-in-uppercase';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { LoadingService } from '../../services/loading-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-heroes-form-page',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinner,
    SeeInUppercase,
  ],
  templateUrl: './heroes-form-page.html',
  styleUrl: './heroes-form-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesFormPage {
  private readonly snackBar = inject(MatSnackBar);

  mode = signal<'create' | 'edit'>('create');
  form: FormGroup = new FormGroup({
    id: new FormControl<number>(0),
    name: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    power: new FormControl<string>('', [Validators.required]),
    universe: new FormControl<string>('', [Validators.required]),
  });
  heroesService = inject(HeroesService);
  loadingService = inject(LoadingService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  idHero = toSignal(
    this.activatedRoute.queryParamMap.pipe(map((params) => params.get('id'))),
    { initialValue: null },
  );

  constructor() {
    effect(() => {
      this.populateForm();
    });
  }

  populateForm(): void {
    const heroId = this.idHero();
    this.form.reset();
    this.form.markAsPristine();
    if (heroId) {
      this.mode.set('edit');
      const hero = this.heroesService.getHeroById(Number(heroId));
      if (hero) {
        this.form.patchValue({ ...hero });
      }
    } else {
      this.mode.set('create');
    }
  }

  onSaveHero() {
    if (this.form.invalid) return;
    const isCreating = this.mode() === 'create';

    const operationToExecute$ = isCreating
      ? this.heroesService.createHero(this.form.value)
      : this.heroesService.updateHero(this.form.value);

    const messageSnackbar = isCreating
      ? 'Héroe creado correctamente!'
      : 'Héroe actualizado correctamente!';

    operationToExecute$.subscribe({
      next: () => {
        this.snackBar.open(messageSnackbar, 'Cerrar', {
          duration: 2000,
        });
        void this.router.navigateByUrl('/');
      },
    });
  }

  onCancel(): void {
    this.router.navigateByUrl('/');
  }
}
