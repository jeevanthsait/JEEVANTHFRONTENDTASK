import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../Service/service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { ProductDto, ProductResponse } from '../models/Productdto';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  storeproduct: ProductDto[] = [];
  selectedAll = false;
  filteredProducts: ProductDto[] = [];
  addproductform!: FormGroup;
  searchControl = new FormControl('');
  nameFilter = new FormControl('');
  descriptionFilter = new FormControl('');
  priceFilter = new FormControl('');
  storepostdata: ProductDto[] = [];
  newarray: { _id: string }[] = [];
  extraid!: string;
  selectedFiles: File[] = [];
  storenewsingledata: ProductDto | undefined;
  existingImages: string[] = [];
  selectedProduct: ProductDto | null = null;
  // private service=Inject(ServiceService)
  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private service: ServiceService
  ) {
    console.log("Yes Constructor called....!");

  }
  ngOnInit(): void {
    console.log("Oninit is called....!");
    this.addproductform = new FormGroup({
      "name": new FormControl(null),
      "description": new FormControl(null),
      "price": new FormControl(null, ([Validators.required, Validators.min(0)])),
      "images": new FormControl([])
    });
    this.getproduct();
    this.nameFilter.valueChanges.subscribe(() => this.applyFilterAndSort());
    this.descriptionFilter.valueChanges.subscribe(() => this.applyFilterAndSort());
    this.priceFilter.valueChanges.subscribe(() => this.applyFilterAndSort());
  }




  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files: FileList | null = input.files;

    if (files) {
      this.selectedFiles = Array.from(files);
      console.log("Selected Files:", this.selectedFiles);

      if (this.selectedFiles.length > 5) {
        alert('You can upload a maximum of 5 images');
        this.selectedFiles = this.selectedFiles.slice(0, 5);
      }
    }
  }

  getproduct() {
    console.log("Get product called...!");
    this.service.getproductdata().subscribe({
      next: (res: ProductDto[]) => {
        console.log("Product data:", res);
        this.storeproduct = res.map((product: ProductDto) => {
          return {
            ...product,
            images: product.images?.map((img: string) => `http://localhost:3000/uploads/${img}`) || []
          };
        });
        this.applyFilterAndSort();
      },
      error: (error: unknown) => {
        console.error("Error fetching products:", error);
      }
    });

  }



  // !-----fileterd array----!


  applyFilterAndSort() {
    const nameText = this.nameFilter.value?.toLowerCase() || '';
    console.log("nameflter==========?", this.nameFilter);
    const desText = this.descriptionFilter.value?.toLowerCase() || '';
    const priceText = this.priceFilter.value?.toString() || '';

    this.filteredProducts = this.storeproduct.filter((p: ProductDto) => {
      let match = true;

      if (nameText) {
        match = match && p.name?.toLowerCase().includes(nameText);
      }

      if (desText) {
        match = match && p.description?.toLowerCase().includes(desText);
      }

      if (priceText) {
        match = match && p.price?.toString().includes(priceText);
      }

      return match;
    });

    console.log("Filtered Products:", this.filteredProducts);
  }



  sendpostadd() {
    console.log("newproductdata ", this.addproductform.value);
    const formData = new FormData();
    formData.append("name", this.addproductform.get('name')?.value);
    formData.append("description", this.addproductform.get('description')?.value);
    formData.append("price", this.addproductform.get('price')?.value);

    for (const file of this.selectedFiles) {
      formData.append("images", file, file.name);
    }
    this.service.postproductdata(formData).subscribe((res: ProductResponse) => {
      console.log("Successfully Added data..! ", res.message);
      this.getproduct();
    });

  }

  CheckboxChange() {
    this.newarray = [];
    this.storeproduct.forEach((value: ProductDto) => {
      value.selected = this.selectedAll;
      console.log("statement:", value.selected);
      if (this.selectedAll && value.selected) {
        console.log("false called");
        this.newarray.push({ _id: value._id });
      }
    });
    console.log("new Responces:", this.newarray);
  }

  delete() {
    console.log("Extra id:", this.extraid);
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result) {
        this.service.deleteproduct(this.extraid).subscribe(() => {
          Swal.fire(
            'Deleted!',
            'Your product has been deleted.',
            'success'
          );
        });
        this.getproduct();
      }
    });
  }


  change(product: ProductDto) {
    if (product.selected) {
      if (!this.newarray.some((p) => p._id === product._id)) {
        this.extraid = product._id;
        this.newarray.push({ _id: this.extraid });
      }
    } else {

      this.newarray = this.newarray.filter((p) => p._id !== product._id);
    }

    this.selectedAll = this.storeproduct.every((p) => p.selected);

    console.log("Child Changed ->", this.newarray);

  }

  EditData() {
    if (!this.extraid) return;
    console.log("Id:", this.extraid);

    this.service.getsingledata(this.extraid).subscribe({
      next: (res: ProductDto) => {
        console.log("Single Product data:", res);


        this.existingImages = (res.images || []).map((img: string) =>
          img.startsWith('http') ? img : `http://localhost:3000/uploads/${img}`
        );


        this.addproductform.patchValue({
          name: res.name,
          description: res.description,
          price: res.price
        });
      },
      error: (error: unknown) => {
        console.error("Error fetching single product:", error);
      }
    });
  }

  r() {
    console.log("Reset called...!");
    this.addproductform.reset();
  }

  Update() {
    if (!this.extraid) return;
    // 🔹 First fetch existing product by ID (like EditData does)
    // Now create FormData
    const formData = new FormData();
    formData.append("name", this.addproductform.get('name')?.value);
    console.log("Testing",this.addproductform.value);
    formData.append("description", this.addproductform.get('description')?.value);
    formData.append("price", this.addproductform.get('price')?.value);

    // Append new files if user selected
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (const file of this.selectedFiles) {
        formData.append("images", file);
      }
    }

    // Call update API
    this.service.updatesingledata(this.extraid, formData).subscribe({
      next: (res) => {
        console.log("✅ Product updated:", res.product);
        this.getproduct();
      },
      error: (err) => {
        console.error("❌ Update failed:", err);
      }
    });

    this.service.getsingledata(this.extraid).subscribe({
      next: (res: ProductDto) => {
        console.log("Fetched for update:", res);
           
        this.existingImages = (res.images || []).map((img: string) =>
          img.startsWith('http') ? img : `http://localhost:3000/uploads/${img}`
        );
        // Patch form with existing data
        this.addproductform.patchValue({
          name: res.name || "",
          description: res.description || "",
          price: res.price || ""
        });
      },
      error: (err) => {
        console.error("❌ Failed to fetch product before update:", err);
      }
    });
  }




  show() {
    const savedIds = JSON.parse(sessionStorage.getItem('filteredProductIds') || '[]');

    console.log("REsponces From sessiong storage", savedIds);
  }
}




