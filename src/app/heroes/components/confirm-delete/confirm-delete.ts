import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Hero } from '../../interfaces/hero';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../services/loading-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-confirm-delete',
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title>Eliminar Héroe</h2>
    <mat-dialog-content>
      ¿Estás seguro de que deseas eliminar este héroe?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button
        mat-button
        [disabled]="loadingService.loadingDelete()"
        mat-dialog-close
      >
        Cancelar
      </button>
      <button
        mat-button
        [disabled]="loadingService.loadingDelete()"
        (click)="onConfirmDelete()"
        cdkFocusInitial
      >
        @if (loadingService.loadingDelete()) {
          <mat-spinner [diameter]="20" color="white"></mat-spinner>
        } @else {
          Si, eliminar
        }
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDelete {
  readonly dialogRef = inject(MatDialogRef<ConfirmDelete>);
  data = inject<{ hero: Hero; onConfirmAsync: () => Observable<void> }>(
    MAT_DIALOG_DATA,
  );

  loadingService = inject(LoadingService);

  onConfirmDelete(): void {
    this.data.onConfirmAsync().subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
