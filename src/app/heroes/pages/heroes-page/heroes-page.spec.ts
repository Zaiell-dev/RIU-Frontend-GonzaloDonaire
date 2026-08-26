import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { signal } from '@angular/core';
import { HeroesPage } from './heroes-page';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HeroesService } from '../../services/heroes-service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Hero } from '../../interfaces/hero';
import { ConfirmDelete } from '../../components/confirm-delete/confirm-delete';

describe('HeroesPage', () => {
  type HeroesServiceMock = jasmine.SpyObj<
    Pick<HeroesService, 'deleteHero' | 'onChangeSearchString'>
  > & Pick<HeroesService, 'heroesFiltered' | 'searchString'>;

  let component: HeroesPage;
  let fixture: ComponentFixture<HeroesPage>;

  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockHeroesService: HeroesServiceMock;
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
      heroesFiltered: signal<Hero[]>([]).asReadonly(),
      searchString: signal(''),
      onChangeSearchString: jasmine.createSpy('onChangeSearchString'),
    };
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

  it('should debounce search input and ignore consecutive duplicates', fakeAsync(() => {
    const searchInput = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;

    searchInput.value = 'Bat';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    tick(200);

    searchInput.value = 'Batman';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    tick(299);

    expect(mockHeroesService.onChangeSearchString).not.toHaveBeenCalled();

    tick(1);

    expect(
      mockHeroesService.onChangeSearchString,
    ).toHaveBeenCalledOnceWith('Batman');

    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    tick(300);

    expect(mockHeroesService.onChangeSearchString).toHaveBeenCalledTimes(1);
  }));

  it('should clear the input and cancel a pending search', fakeAsync(() => {
    const searchInput = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    searchInput.value = 'Batman';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    tick(100);

    component.clearSearch(searchInput);

    expect(searchInput.value).toBe('');
    tick(299);
    expect(mockHeroesService.onChangeSearchString).not.toHaveBeenCalled();

    tick(1);

    expect(mockHeroesService.onChangeSearchString).toHaveBeenCalledOnceWith(
      '',
    );
  }));

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
    mockHeroesService.deleteHero.and.returnValue(deleteResult$);

    component.onDeleteButton(hero);

    const dialogConfig = mockDialog.open.calls.mostRecent()
      .args[1] as MatDialogConfig<ConfirmDelete['data']>;
    const onConfirmAsync = dialogConfig.data!.onConfirmAsync;

    expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDelete, {
      data: { hero, onConfirmAsync: jasmine.any(Function) },
    });
    expect(mockHeroesService.deleteHero).not.toHaveBeenCalled();

    const result$ = onConfirmAsync();

    expect(mockHeroesService.deleteHero).toHaveBeenCalledOnceWith(hero.id);
    expect(result$).toBe(deleteResult$);
  });
});
