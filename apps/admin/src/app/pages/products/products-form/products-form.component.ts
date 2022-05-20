import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductsService, Product, CategoriesService, Category } from '@itns/products';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html'
})
export class ProductsFormComponent implements OnInit, OnDestroy {
  editMode = false;
  form!: FormGroup;
  isSubmitted = false;
  categories: Category[] = [];
  imageDisplay!: string | ArrayBuffer;
  currentProductId!: string;
  subscription!: Subscription;

  @ViewChild('imageInput') imageInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private categoryService: CategoriesService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._getCategories();
    this._checkEditMode();
  }

  private _initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: ['', Validators.required],
      isFeatured: [false],
    })
  }

  private _getCategories() {
    this.subscription = this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    })
  }

  get productForm() {
    return this.form.controls;
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ image: file });
      this.form.get('image')?.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result as string;
      }
      fileReader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return
    }
    const productFormData = new FormData();
    Object.keys(this.productForm).map((key) => {
      productFormData.append(key, this.productForm[key].value);
    })
    if (this.editMode) {
      this._updateProduct(productFormData);
    } else {
      this._addProduct(productFormData);
      this.productForm['image'].setValidators([]);
      this.productForm['image'].updateValueAndValidity();
    }
  }

  private _addProduct(productData: FormData) {
    this.productsService.createProduct(productData)
      .subscribe({
        next: (product: Product) =>
          this.messageService.add({
            severity: 'success', summary: 'Success', detail: `${product.name} is created`
          }),
        error: (product: Product) => this.messageService.add({ severity: 'error', summary: 'Error', detail: `${product.name} is not created` }),
        complete: () => console.info('complete')
      })
  }

  private _updateProduct(productData: FormData) {
    this.productsService.updateProduct(productData, this.currentProductId)
      .subscribe({
        next: (product: Product) => {
          this.messageService.add({
            severity: 'success', summary: 'Success', detail: `${product.name} is updated`
          }),
            setTimeout(() => {
              this.goBack();
            }, 1500);
        },
        error: (product: Product) => this.messageService.add({
          severity: 'error', summary: 'Error', detail: `${product.name} is not updated`
        }),
        complete: () => console.info('complete')
      });
  }

  private _checkEditMode() {
    this.subscription = this.route.params.subscribe(param => {
      if (param['id']) {
        this.editMode = true;
        this.currentProductId = param['id'];
        this.productsService.getProduct(param['id']).subscribe((res: any) => {
          this.productForm['name'].setValue(res.name);
          this.productForm['brand'].setValue(res.brand);
          this.productForm['price'].setValue(res.price);
          this.productForm['category'].setValue(res.category.id);
          this.productForm['countInStock'].setValue(res.countInStock);
          this.productForm['description'].setValue(res.description);
          this.productForm['richDescription'].setValue(res.richDescription);
          this.productForm['isFeatured'].setValue(res.isFeatured);
          this.imageDisplay = res.image as string;
          this.productForm['image'].setValidators([]);
          this.productForm['image'].updateValueAndValidity();
        })
      }
    });
  }

  resetForm() {
    this.imageDisplay = "";
    this.imageInput.nativeElement.value = "";
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
