import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { User, UsersService } from '@itns/users';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-users-form',
  templateUrl: './users-form.component.html'
})
export class UsersFormComponent implements OnInit, OnDestroy {
  editMode = false;
  form!: FormGroup;
  isSubmitted = false;
  users: User[] = [];
  countries: any[] = [];
  subscription!: Subscription;

  currentuserId!: string;

  @ViewChild('imageInput') imageInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._getUsers();
    this._getCountries();
    this._checkEditMode();
  }


  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  private _initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      isAdmin: [false],
      street: [''],
      apartment: [''],
      zip: [''],
      city: [''],
      country: [''],
    })
  }

  private _getUsers() {
    this.subscription = this.usersService.getUsers().subscribe(users => {
      this.users = users;
    })
  }

  get userForm() {
    return this.form.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return
    }

    const user: User = {
      id: this.currentuserId,
      name: this.userForm['name'].value,
      email: this.userForm['email'].value,
      isAdmin: this.userForm['isAdmin'].value,
      street: this.userForm['street'].value,
      apartment: this.userForm['apartment'].value,
      zip: this.userForm['zip'].value,
      city: this.userForm['city'].value,
      country: this.userForm['country'].value,
      password: this.userForm['password'].value,
      phone: this.userForm['phone'].value,
    }

    if (this.editMode) {
      this._updateUser(user);
    } else {
      this._addUser(user);
    }
  }

  private _addUser(user: User) {
    this.usersService.createUser(user)
      .subscribe({
        next: (user: User) =>
          this.messageService.add({
            severity: 'success', summary: 'Success', detail: `${user.name} is created`
          }),

        error: (user: User) => this.messageService.add({ severity: 'error', summary: 'Error', detail: `${user.name} is not created` }),
        complete: () => console.info('complete')
      })
  }

  private _updateUser(user: User) {
    this.usersService.updateUser(user)
      .subscribe({
        next: (user: User) => {
          this.messageService.add({
            severity: 'success', summary: 'Success', detail: `${user.name} is updated`
          }),
            setTimeout(() => {
              this.goBack();
            }, 1500);
        },
        error: (user: User) => this.messageService.add({
          severity: 'error', summary: 'Error', detail: `${user.name} is not updated`
        }),
        complete: () => console.info('complete')
      });
  }

  private _checkEditMode() {
    this.subscription = this.route.params.subscribe(param => {
      if (param['id']) {
        this.editMode = true;
        this.currentuserId = param['id'];
        this.usersService.getUser(param['id']).subscribe((res: any) => {
          this.userForm['name'].setValue(res.name);
          this.userForm['email'].setValue(res.email);
          this.userForm['isAdmin'].setValue(res.isAdmin);
          this.userForm['street'].setValue(res.street);
          this.userForm['apartment'].setValue(res.apartment);
          this.userForm['zip'].setValue(res.zip);
          this.userForm['city'].setValue(res.city);
          this.userForm['country'].setValue(res.country);
          this.userForm['phone'].setValue(res.phone);
          this.userForm['password'].setValidators([]);
          this.userForm['password'].updateValueAndValidity();
        })
      }
    });
  }

  resetForm() {
    this.form.reset();
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
