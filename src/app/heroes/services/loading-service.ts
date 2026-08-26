import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly loadingListState = signal<boolean>(false);
  private readonly loadingSaveState = signal<boolean>(false);
  private readonly loadingDeleteState = signal<boolean>(false);
  readonly loadingList = this.loadingListState.asReadonly();
  readonly loadingSave = this.loadingSaveState.asReadonly();
  readonly loadingDelete = this.loadingDeleteState.asReadonly();

  updateLoadingList(isLoading: boolean): void {
    this.loadingListState.set(isLoading);
  }
  updateLoadingSave(isLoading: boolean): void {
    this.loadingSaveState.set(isLoading);
  }
  updateLoadingDelete(isLoading: boolean): void {
    this.loadingDeleteState.set(isLoading);
  }
}
