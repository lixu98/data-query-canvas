import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';

/**
 * 範例- 自定驗證器 - 同步
 *
 */
export function customValidator(param: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    if ((control.value as string).startsWith('abc')) {
      return {customValidator: true};
    }

    return null;
  };
}


/**
 * 範例- 自定驗證器 - 非同步
 *
 */
export function customAsyncValidator(param: any): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    if ((control.value as string).startsWith('bcde')) {
      return of({customAsyncValidator: true});
    }

    return of(null);
  };
}


