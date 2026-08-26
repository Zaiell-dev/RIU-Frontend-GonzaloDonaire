import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { LoadingService } from './heroes/services/loading-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, MatProgressSpinner],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly loadingService = inject(LoadingService);
}
