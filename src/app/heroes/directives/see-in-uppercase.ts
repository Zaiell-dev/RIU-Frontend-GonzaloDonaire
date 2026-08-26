import { Directive, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appSeeInUppercase]',
  host: {
    '(input)': 'onInput($event)',
  },
})
export class SeeInUppercase {
  private readonly ngControl = inject(NgControl, { self: true });

  onInput(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;

    const uppercaseValue = target.value.toUpperCase();
    if (target.value !== uppercaseValue) {
      this.ngControl.control?.setValue(uppercaseValue, { emitEvent: false });
    }
  }
}
