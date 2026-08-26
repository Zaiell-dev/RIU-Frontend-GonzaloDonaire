import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesFormPage } from './heroes-form-page';
import { HeroesService } from '../../services/heroes-service';
import { ActivatedRoute, Router } from '@angular/router';
import { defer, of } from 'rxjs';

describe('HeroesFormPage', () => {
  let component: HeroesFormPage;
  let fixture: ComponentFixture<HeroesFormPage>;
  let mockHeroesService: any;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockHeroesService = {
      getHeroById: jasmine.createSpy('getHeroById'),
      createHero: jasmine
        .createSpy('createHero')
        .and.returnValue(of(void 0)),
      updateHero: jasmine
        .createSpy('updateHero')
        .and.returnValue(of(void 0)),
    } as any;
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockActivatedRoute = { queryParamMap: of(new Map()) };

    await TestBed.configureTestingModule({
      imports: [HeroesFormPage],
      providers: [
        { provide: HeroesService, useValue: mockHeroesService },
        { provide: Router, useValue: mockRouter },
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

  it('should call and subscribe to createHero on save in create mode', () => {
    const subscribed = jasmine.createSpy('createHero subscription');
    mockHeroesService.createHero.and.returnValue(
      defer(() => {
        subscribed();
        return of(void 0);
      }),
    );
    component.mode.set('create');
    component.form.setValue({ id: 0, name: 'A', power: 'X', universe: 'U' });
    spyOnProperty(component.form, 'invalid', 'get').and.returnValue(false);

    component.onSaveHero();

    expect(mockHeroesService.createHero).toHaveBeenCalledWith(
      component.form.value
    );
    expect(subscribed).toHaveBeenCalled();
  });

  it('should call and subscribe to updateHero on save in edit mode', () => {
    const subscribed = jasmine.createSpy('updateHero subscription');
    mockHeroesService.updateHero.and.returnValue(
      defer(() => {
        subscribed();
        return of(void 0);
      }),
    );
    component.mode.set('edit');
    component.form.setValue({ id: 1, name: 'A', power: 'X', universe: 'U' });
    spyOnProperty(component.form, 'invalid', 'get').and.returnValue(false);

    component.onSaveHero();

    expect(mockHeroesService.updateHero).toHaveBeenCalledWith(
      component.form.value
    );
    expect(subscribed).toHaveBeenCalled();
  });

  it('should not call createHero or updateHero if form is invalid', () => {
    spyOnProperty(component.form, 'invalid', 'get').and.returnValue(true);
    component.mode.set('create');
    component.onSaveHero();
    component.mode.set('edit');
    component.onSaveHero();
    expect(mockHeroesService.createHero).not.toHaveBeenCalled();
    expect(mockHeroesService.updateHero).not.toHaveBeenCalled();
  });

  it('should navigate to / on cancel', () => {
    component.onCancel();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
