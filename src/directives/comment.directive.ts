import { Directive, Input, OnChanges, Self } from '@angular/core';
import {AbstractControl, NgControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

const commentRequiredValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = String(control.value ?? '').trim();
  return value ? null : { commentRequired: true };
};

@Directive({
  selector: '[appCommentValidators]',
  standalone: true,
})
export class CommentDirective implements OnChanges {
  @Input({required: true}) appCommentValidators = false;
  constructor(@Self() private readonly ngControl: NgControl) {}

  ngOnChanges(): void {
    const control = this.ngControl.control;
    if (!control) return;

    if (this.appCommentValidators) {
      control.setValidators([commentRequiredValidator, Validators.maxLength(100)]);
    } else {
      control.clearValidators();
    }

    control.updateValueAndValidity({emitEvent: false});
}
}
