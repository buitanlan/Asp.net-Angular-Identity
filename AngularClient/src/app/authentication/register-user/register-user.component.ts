import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { PasswordConfirmationValidatorService } from 'src/app/shared/services/password-confirmation-validator.service';
import { UserForRegistrationDto } from 'src/app/_interfaces/userForRegistrationDto.model';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
})
export class RegisterUserComponent implements OnInit {
  public registerForm: FormGroup;
  public errorMessage = '';
  public showError: boolean;

  constructor(private authService: AuthenticationService, private passConfValidator: PasswordConfirmationValidatorService) {}
  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl(''),
    });
    this.registerForm.get('confirm').setValidators([Validators.required,
      this.passConfValidator.validateConfirmPassword(this.registerForm.get('password'))]);
  }
  public validateControl = (controlName: string) => {
    return (
      this.registerForm.controls[controlName].invalid &&
      this.registerForm.controls[controlName].touched
    );
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  }
  public registerUser = (registerFormValue) => {
    this.showError = false;
    const formValues = { ...registerFormValue };
    const user: UserForRegistrationDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirm,
    };
    this.authService.registerUser('api/accounts/registration', user).subscribe(
      (_) => {
        console.log('Successful registration');
      },
      (error) => {
        this.errorMessage = error;
        this.showError = true;
      }
    );
  }
}
