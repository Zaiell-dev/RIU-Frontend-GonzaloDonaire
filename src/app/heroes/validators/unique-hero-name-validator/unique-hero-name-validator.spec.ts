import { FormControl, FormGroup } from '@angular/forms';
import { Hero } from '../../interfaces/hero';
import { uniqueHeroNameValidator } from './unique-hero-name-validator';

describe('uniqueHeroNameValidator', () => {
  const heroes: Hero[] = [
    { id: 1, name: 'Superman', power: 'Flight', universe: 'DC' },
    { id: 2, name: 'Iron Man', power: 'Armor', universe: 'Marvel' },
  ];

  const createForm = (id: number) => {
    const form = new FormGroup({
      id: new FormControl(id),
      name: new FormControl(''),
    });
    form.controls.name.addValidators(uniqueHeroNameValidator(() => heroes));

    return form;
  };

  it('should detect a duplicate name ignoring spaces and letter case', () => {
    const form = createForm(0);

    form.controls.name.setValue('  SUPERMAN  ');

    expect(form.controls.name.hasError('duplicateName')).toBeTrue();
  });

  it('should allow the current hero to keep its name when editing', () => {
    const form = createForm(1);

    form.controls.name.setValue('Superman');

    expect(form.controls.name.hasError('duplicateName')).toBeFalse();
  });

  it('should reject the name of another hero when editing', () => {
    const form = createForm(2);

    form.controls.name.setValue('Superman');

    expect(form.controls.name.hasError('duplicateName')).toBeTrue();
  });
});
