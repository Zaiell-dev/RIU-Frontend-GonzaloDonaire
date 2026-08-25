import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SeeInUppercase } from './see-in-uppercase';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  template: `<input appSeeInUppercase [formControl]="nameControl" />`,
  imports: [SeeInUppercase, ReactiveFormsModule],
})
class TestHostComponent {
  nameControl = new FormControl('');
}

describe('SeeInUppercase Directive', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.query(By.directive(SeeInUppercase));
    expect(directive).not.toBeNull();
  });

  it('should convert the form control value to uppercase on input', () => {
    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    input.value = 'texto de prueba';
    input.dispatchEvent(new InputEvent('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.nameControl.value).toBe('TEXTO DE PRUEBA');
    expect(input.value).toBe('TEXTO DE PRUEBA');
  });
});
