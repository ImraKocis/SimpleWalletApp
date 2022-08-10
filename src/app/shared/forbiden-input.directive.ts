import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function addressInputValidator(inputRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = inputRe.test(control.value);
    return forbidden ? { forbiddenInput: { value: control.value } } : null;
  };
}
