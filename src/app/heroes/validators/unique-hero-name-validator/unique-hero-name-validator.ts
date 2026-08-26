import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Hero } from '../../interfaces/hero';

export function uniqueHeroNameValidator(
  getHeroes: () => readonly Hero[],
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const normalizedName = String(control.value ?? '')
      .trim()
      .toLowerCase();

    if (!normalizedName) return null;

    const currentHeroId = control.parent?.get('id')?.value;

    const isDuplicate = getHeroes().some(
      (hero) =>
        hero.id !== currentHeroId &&
        hero.name.trim().toLowerCase() === normalizedName,
    );

    return isDuplicate ? { duplicateName: true } : null;
  };
}
