import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-gallery',
  templateUrl: './gallery.component.html',
  styles: [
  ]
})
export class GalleryComponent implements OnInit {
  selectedImage!: string;

  @Input()
  images!: any;

  ngOnInit(): void {
    if (this.images.length) {
      this.selectedImage = this.images[0];
    }
  }

  changeSelectedImage(imageUrl: string) {
    console.log(imageUrl);

    this.selectedImage = imageUrl;
  }

  get hasImages() {
    return this.images?.length > 0;
  }

}
