import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { LocalstorageService } from '../../services/localstorage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'users-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup;
  isSubmitted = false;
  authError = false;
  passwordErrorAlert!: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private messageService: MessageService,
    private localstorageService: LocalstorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this._initLoginForm();
  }

  private _initLoginForm() {
    this.loginFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.loginFormGroup.invalid) {
      return;
    }

    this.auth.login(this.loginForm['email'].value, this.loginForm['password'].value)
      .subscribe({
        next: (user) => {
          this.authError = false;
          this.localstorageService.setToken(user.token as string);
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', detail: error.error });
          this.passwordErrorAlert = error.error;
          this.authError = true;
        },
        complete: () => console.info('complete')
      })
  }

  get loginForm() {
    return this.loginFormGroup.controls;
  }

}
