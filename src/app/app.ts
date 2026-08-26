import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeroesService } from './heroes/services/heroes-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { LoadingService } from './heroes/services/loading-service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    Header,
    MatProgressSpinner,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('RIU-Frontend-GonzaloDonaire');
  loadingService = inject(LoadingService);
  heroesService = inject(HeroesService);
}
