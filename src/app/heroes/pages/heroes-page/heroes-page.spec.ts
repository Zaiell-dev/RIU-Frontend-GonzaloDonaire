import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesPage } from './heroes-page';
import { MatDialog } from '@angular/material/dialog';
import { HeroesService } from '../../services/heroes-service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Hero } from '../../interfaces/hero';
import { ConfirmDelete } from '../../components/confirm-delete/confirm-delete';

describe('HeroesPage', () => {
  let component: HeroesPage;
  let fixture: ComponentFixture<HeroesPage>;

  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockHeroesService: jasmine.SpyObj<HeroesService>;
  let mockRouter: jasmine.SpyObj<Router>;
  const hero: Hero = {
    id: 1,
    name: 'Test Hero',
    power: 'test',
    universe: 'Marvel',
  };

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockHeroesService = {
      deleteHero: jasmine.createSpy('deleteHero'),
      loading: () => false,
      loadingDelete: () => false,
      loadingCreateOrEdit: () => false,
      heroesFiltered: () => [],
      onChangeSearchString: jasmine.createSpy('onChangeSearchString'),
    } as any;
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    await TestBed.configureTestingModule({
      imports: [HeroesPage],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: HeroesService, useValue: mockHeroesService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should call onChangeSearchString("") on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(mockHeroesService.onChangeSearchString).toHaveBeenCalledWith('');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to form on edit', () => {
    component.onEditButton(hero);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
      `/form?id=${hero.id}`
    );
  });

  it('should navigate to form on create', () => {
    component.onCreateButton();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/form');
  });

  it('should open dialog and call deleteHero if confirmed', () => {
    let onConfirmAsyncFn: Function | undefined;
    const afterClosed$ = of(true);
    mockDialog.open.and.callFake((component: any, config: any) => {
      onConfirmAsyncFn = config.data.onConfirmAsync;
      if (onConfirmAsyncFn) {
        onConfirmAsyncFn();
      }
      return { afterClosed: () => afterClosed$ } as any;
    });
    component.onDeleteButton(hero);
    expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDelete, {
      data: { hero, onConfirmAsync: jasmine.any(Function) },
    });
    expect(mockHeroesService.deleteHero).toHaveBeenCalledWith(hero.id);
  });

  it('should open dialog and NOT call deleteHero if not confirmed', () => {
    const afterClosed$ = of(false);
    mockDialog.open.and.returnValue({ afterClosed: () => afterClosed$ } as any);
    component.onDeleteButton(hero);
    expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDelete, {
      data: { hero, onConfirmAsync: jasmine.any(Function) },
    });
    expect(mockHeroesService.deleteHero).not.toHaveBeenCalled();
  });

  it('should open dialog and NOT call deleteHero if result is undefined', () => {
    const afterClosed$ = of(undefined);
    mockDialog.open.and.returnValue({ afterClosed: () => afterClosed$ } as any);
    component.onDeleteButton(hero);
    expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDelete, {
      data: { hero, onConfirmAsync: jasmine.any(Function) },
    });
    expect(mockHeroesService.deleteHero).not.toHaveBeenCalled();
  });
});
