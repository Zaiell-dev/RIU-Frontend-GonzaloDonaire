import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDelete } from './confirm-delete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoadingService } from '../../services/loading-service';
import { Hero } from '../../interfaces/hero';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { signal, WritableSignal } from '@angular/core';

describe('ConfirmDelete', () => {
  let component: ConfirmDelete;
  let fixture: ComponentFixture<ConfirmDelete>;

  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmDelete>>;
  let mockOnConfirmAsync: jasmine.Spy<() => Observable<void>>;
  let loadingDelete: WritableSignal<boolean>;
  let mockLoadingService: Pick<LoadingService, 'loadingDelete'>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  const hero: Hero = {
    id: 1,
    name: 'Test Hero',
    power: 'test',
    universe: 'Marvel',
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockOnConfirmAsync = jasmine
      .createSpy('onConfirmAsync')
      .and.returnValue(of(void 0));
    loadingDelete = signal(false);
    mockLoadingService = {
      loadingDelete: loadingDelete.asReadonly(),
    };
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    await TestBed.configureTestingModule({
      imports: [ConfirmDelete],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { hero, onConfirmAsync: mockOnConfirmAsync },
        },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the name of the hero to delete', () => {
    const content: HTMLElement = fixture.nativeElement.querySelector(
      'mat-dialog-content',
    );

    expect(content.textContent).toContain(hero.name);
  });

  it('should call onConfirmAsync and close dialog on confirm', () => {
    component.onConfirmDelete();

    expect(mockOnConfirmAsync).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Héroe eliminado correctamente!',
      'Cerrar',
      { duration: 2000 },
    );
  });

  it('should disable buttons when loadingDelete is true', () => {
    loadingDelete.set(true);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].disabled).toBeTrue();
    expect(buttons[1].disabled).toBeTrue();
  });

  it('should enable buttons when loadingDelete is false', () => {
    loadingDelete.set(false);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].disabled).toBeFalse();
    expect(buttons[1].disabled).toBeFalse();
  });

  it('should show spinner when loadingDelete is true', () => {
    loadingDelete.set(true);
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should show "Si, eliminar" when loadingDelete is false', () => {
    loadingDelete.set(false);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelectorAll('button')[1];
    expect(button.textContent).toContain('Si, eliminar');
  });
});
