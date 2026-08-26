import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesPage } from './heroes-page';
import { MatDialog } from '@angular/material/dialog';
import { HeroesService } from '../../services/heroes-service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
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
      deleteHero: jasmine
        .createSpy('deleteHero')
        .and.returnValue(of(void 0)),
      heroesFiltered: () => [],
      searchString: () => '',
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

  it('should show an empty state when there are no heroes', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'Todavía no hay superhéroes registrados'
    );
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

  it('should provide the delete action when opening the dialog', () => {
    const deleteResult$ = of(void 0);
    let onConfirmAsync: (() => Observable<void>) | undefined;
    mockHeroesService.deleteHero.and.returnValue(deleteResult$);
    mockDialog.open.and.callFake((_component: any, config: any) => {
      onConfirmAsync = config.data.onConfirmAsync;
      return {} as any;
    });

    component.onDeleteButton(hero);

    expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDelete, {
      data: { hero, onConfirmAsync: jasmine.any(Function) },
    });
    expect(mockHeroesService.deleteHero).not.toHaveBeenCalled();

    const result$ = onConfirmAsync!();

    expect(mockHeroesService.deleteHero).toHaveBeenCalledOnceWith(hero.id);
    expect(result$).toBe(deleteResult$);
  });
});
