import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { addressInputValidator } from './forbiden-input.directive';

@Directive({
  selector: '[appCustomInputAddressValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: ValidateAddressInput, multi: true },
  ],
})
export class ValidateAddressInput implements Validator {
  @Input('appCustomInputAddressValidator') addressInput = '';

  validate(control: AbstractControl): ValidationErrors | null {
    return this.addressInput
      ? addressInputValidator(new RegExp(this.addressInput))(control)
      : null;
  }
}
