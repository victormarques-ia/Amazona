import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SignUpService } from '../sign-up.service';
import ValidatorsPattern from '../../../shared/utils/validators-pattern';
import InputMask from '../../../shared/utils/input-mask';
import { ApiMessageCodes } from '../../../shared/utils/api-message-codes';

@Component({
  selector: 'app-sign-up-form-personal-data',
  templateUrl: './sign-up-form-personal-data.component.html',
  styleUrls: ['./sign-up-form-personal-data.component.css'],
})
export class SignUpFormPersonalDataComponent implements OnInit {
  signUpPersonalDataForm!: FormGroup;
  cpfMask = InputMask.CPF;
  cellphoneMask = InputMask.CELLPHONE;
  passwordPattern = ValidatorsPattern.PASSWORD;

  constructor(private signUpService: SignUpService) {}

  ngOnInit() {
    this.signUpPersonalDataForm = this.signUpService.signUpPersonalDataForm;

    this.signUpService.signUpPersonalDataValidateStatus$.subscribe((status) => {
      status.maybeMap({
        failed: (error) => {
          if (Array.isArray(error.msgCode)) {
            this.handleValidateError(error.msgCode);
          }
        },
      });
    });
  }

  private handleValidateError(errorCodes: string[]) {
    errorCodes.forEach((errorCode: string) => {
      const control = this.getFieldControl(errorCode);

      if (control) {
        const msg = ApiMessageCodes.codeToMessage(errorCode);

        control.setErrors({
          required: msg,
        });
      }
    });

    this.signUpPersonalDataForm.markAllAsTouched();
  }

  private getFieldControl(errorCode: string) {
    if (
      [
        ApiMessageCodes.email_unavailable,
        ApiMessageCodes.email_invalid_format,
      ].includes(errorCode)
    ) {
      return this.signUpPersonalDataForm.get('email');
    }

    if ([ApiMessageCodes.CPF_invalid_format].includes(errorCode)) {
      return this.signUpPersonalDataForm.get('CPF');
    }

    if ([ApiMessageCodes.username_unavailable].includes(errorCode)) {
      return this.signUpPersonalDataForm.get('username');
    }

    if ([ApiMessageCodes.password_invalid_format].includes(errorCode)) {
      return this.signUpPersonalDataForm.get('password');
    }

    return null;
  }

  onSubmit(): void {
    this.signUpService.submitPersonalData();
  }
}
