import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesFormPage } from './heroes-form-page';
import { HeroesService } from '../../services/heroes-service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { signal } from '@angular/core';
import { Hero } from '../../interfaces/hero';

describe('HeroesFormPage', () => {
  let component: HeroesFormPage;
  let fixture: ComponentFixture<HeroesFormPage>;
  let mockHeroesService: any;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockHeroesService = {
      heroes: signal<Hero[]>([]),
      getHeroById: jasmine.createSpy('getHeroById'),
      createHero: jasmine
        .createSpy('createHero')
        .and.returnValue(of(void 0)),
      updateHero: jasmine
        .createSpy('updateHero')
        .and.returnValue(of(void 0)),
    } as any;
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockActivatedRoute = { queryParamMap: of(new Map()) };

    await TestBed.configureTestingModule({
      imports: [HeroesFormPage],
      providers: [
        { provide: HeroesService, useValue: mockHeroesService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set mode to create if no id param', () => {
    component.mode.set('edit');
    spyOn(component, 'idHero').and.returnValue(null);
    component.populateForm();
    expect(component.mode()).toBe('create');
  });

  it('should set mode to edit and patch form if id param and hero found', () => {
    const hero = { id: 1, name: 'A', power: 'X', universe: 'U' };
    mockHeroesService.getHeroById.and.returnValue(hero);
    spyOn(component, 'idHero').and.returnValue('1');
    const patchSpy = spyOn(component.form, 'patchValue');
    component.populateForm();
    expect(component.mode()).toBe('edit');
    expect(patchSpy).toHaveBeenCalledWith(hero);
  });

  it('should set mode to edit and not patch form if id param and hero not found', () => {
    mockHeroesService.getHeroById.and.returnValue(undefined);
    spyOn(component, 'idHero').and.returnValue('1');
    const patchSpy = spyOn(component.form, 'patchValue');
    component.populateForm();
    expect(component.mode()).toBe('edit');
    expect(patchSpy).not.toHaveBeenCalled();
  });

  it('should handle a successful hero creation', () => {
    component.mode.set('create');
    component.form.setValue({
      id: 0,
      name: 'Superman',
      power: 'Flight',
      universe: 'DC',
    });

    component.onSaveHero();

    expect(mockHeroesService.createHero).toHaveBeenCalledWith(
      component.form.value,
    );
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Héroe creado correctamente!',
      'Cerrar',
      { duration: 2000 },
    );
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should handle a successful hero update', () => {
    component.mode.set('edit');
    component.form.setValue({
      id: 1,
      name: 'Superman',
      power: 'Flight',
      universe: 'DC',
    });

    component.onSaveHero();

    expect(mockHeroesService.updateHero).toHaveBeenCalledWith(
      component.form.value,
    );
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Héroe actualizado correctamente!',
      'Cerrar',
      { duration: 2000 },
    );
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should not call createHero or updateHero if form is invalid', () => {
    component.form.reset();
    component.mode.set('create');
    component.onSaveHero();
    component.mode.set('edit');
    component.onSaveHero();

    expect(mockHeroesService.createHero).not.toHaveBeenCalled();
    expect(mockHeroesService.updateHero).not.toHaveBeenCalled();
  });

  it('should not save a hero when its name belongs to another hero', () => {
    mockHeroesService.heroes.set([
      { id: 1, name: 'Superman', power: 'Flight', universe: 'DC' },
    ]);
    component.form.setValue({
      id: 2,
      name: '  SUPERMAN  ',
      power: 'Strength',
      universe: 'DC',
    });

    component.mode.set('create');
    component.onSaveHero();
    component.mode.set('edit');
    component.onSaveHero();

    expect(component.form.get('name')?.hasError('duplicateName')).toBeTrue();
    expect(mockHeroesService.createHero).not.toHaveBeenCalled();
    expect(mockHeroesService.updateHero).not.toHaveBeenCalled();
  });

  it('should navigate to / on cancel', () => {
    component.onCancel();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
