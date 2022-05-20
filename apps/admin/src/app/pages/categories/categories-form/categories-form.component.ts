import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@itns/products';
import { Location } from '@angular/common';

import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';


@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html'
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentCategoryId!: string;
  color!: string;
  subscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private categoryService: CategoriesService,
    private messageService: MessageService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['#000', Validators.required],
    })
    this._checkEditMode();
  }

  get categoryForm() {
    return this.form.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return
    }
    const category: Category = {
      id: this.currentCategoryId,
      name: this.form.value.name,
      icon: this.form.value.icon,
      color: this.form.value.color,
    }
    this.form.reset();
    if (this.editMode) {
      this._updateCatergory(category);
    } else {
      this._addCatergory(category);
      console.log(Category);
    }
  }

  goBack() {
    this.location.back();
  }

  private _checkEditMode() {
    this.subscription = this.route.params.subscribe(param => {
      if (param['id']) {
        this.editMode = true;
        this.currentCategoryId = param['id'];
        this.categoryService.getCategory(param['id']).subscribe(res => {
          this.categoryForm['name'].setValue(res.name);
          this.categoryForm['icon'].setValue(res.icon);
        })
      }
    });
  }

  private _addCatergory(category: Category) {
    this.categoryService.createCategory(category)
      .subscribe({
        next: () => this.messageService.add({
          severity: 'success', summary: 'Success', detail: `${category.name} is created`
        }),
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: `${category.name} is not created` }),
        complete: () => console.info('complete')
      })
  }

  private _updateCatergory(category: Category) {
    this.categoryService.updateCategory(category)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success', summary: 'Success', detail: `${category.name} is updated`
          }),
            setTimeout(() => {
              this.goBack();
            }, 1500);
        },
        error: () => this.messageService.add({
          severity: 'error', summary: 'Error', detail: `${category.name} is not updated`
        }),
        complete: () => console.info('complete')
      });
  }


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
