import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../Service/service.service';
import { FormControl, FormGroup } from '@angular/forms';
import { elementAt } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  storeproduct: any;
  selectedAll: boolean = false;
  filteredProducts: any[] = [];
  addproductform!: FormGroup;
  searchControl = new FormControl('');
  nameFilter = new FormControl('');
descriptionFilter = new FormControl('');
priceFilter = new FormControl('');
  storepostdata: any[] = [];
  selected: any;
  newarray: any[] = [];
  extraid: any;
  selectedFiles: File[] = [];
  storenewsingledata: any;
  fb: any;
  existingImages: any;
  constructor(private service: ServiceService) {
    console.log("Yes Constructor called....!");

  }
  ngOnInit(): void {
    console.log("Oninit is called....!");
    this.getproduct();
    this.addproductform = new FormGroup({
      "name": new FormControl(null),
      "description": new FormControl(null),
      "price": new FormControl(null),
      "images": new FormControl([])
    });

     this.nameFilter.valueChanges.subscribe(() => this.applyFilterAndSort());
     this.descriptionFilter.valueChanges.subscribe(() => this.applyFilterAndSort());
     this.priceFilter.valueChanges.subscribe(() => this.applyFilterAndSort());
  }


  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = Array.from(files);
    console.log("Selected Files:", this.selectedFiles);
    if (this.selectedFiles.length > 5) {
      alert('You can upload a maximum of 5 images');
      this.selectedFiles = this.selectedFiles.slice(0, 5);
    }
  }

  getproduct() {
    this.service.getproductdata().subscribe((res: any) => {
      if (res) {
        console.log("productdaa", res);
        this.storeproduct = res.map((p: any) => {
          return {
            ...p,
            images: p.images.map((img: string) => `http://localhost:3000/uploads/${img}`)
          };
        });

        const savedSearch = sessionStorage.getItem('productSearch');
        // if (savedSearch) {
        //   console.log("yes saved called when refresh");
        //   this.searchControl.setValue(savedSearch, { emitEvent: false });
        // }
        this.applyFilterAndSort();
      }
    })
  }

  // !-----fileterd array----!


  applyFilterAndSort() {
  const nameText = this.nameFilter.value?.toLowerCase() || '';
  console.log("nameflter==========?",this.nameFilter);
  const desText = this.descriptionFilter.value?.toLowerCase() || '';
  const priceText = this.priceFilter.value?.toString() || '';

  this.filteredProducts = this.storeproduct.filter((p: any) => {
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





  // sendpostadd() {
  //   console.log("newproductdata 🐼", this.addproductform.value);

  //   const formData = new FormData();
  //   formData.append("name", this.addproductform.value.name);
  //   formData.append("description", this.addproductform.value.description);
  //   formData.append("price", this.addproductform.value.price);

  //   for (let file of this.addproductform.value.images) {
  //     formData.append("images", file);
  //   }

  //   this.service.postproductdata(formData).subscribe((res: any) => {
  //     console.log("Succesfully Added data..! ", res);
  //   });
  // }

  sendpostadd() {
    console.log("newproductdata 🐼", this.addproductform.value);

    const formData = new FormData();
    formData.append("name", this.addproductform.get('name')?.value);
    formData.append("description", this.addproductform.get('description')?.value);
    formData.append("price", this.addproductform.get('price')?.value);

    // Append each selected file with the same key "images"
    for (const file of this.selectedFiles) {
      formData.append("images", file, file.name);
    }

    this.service.postproductdata(formData).subscribe((res: any) => {
      console.log("Successfully Added data..! ", res);
      this.getproduct();
    }, err => {
      console.error('Upload error', err);
    });
  }
  CheckboxChange() {
    this.newarray = [];
    this.storeproduct.forEach((value: any) => {
      value.selected = this.selectedAll;
      console.log("statement:", value.selected);  // update each child
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
      }
    });
  }


  change(product: any) {
    if (product.selected) {
      if (!this.newarray.some((p: any) => p._id === product._id)) {
        this.extraid = product._id;
        this.newarray.push({ _id: this.extraid });
      }
    } else {

      this.newarray = this.newarray.filter((p: any) => p._id !== product._id);
    }

    this.selectedAll = this.storeproduct.every((p: any) => p.selected);

    console.log("Child Changed ->", this.newarray);

  }
  Editdata() {
  if (!this.extraid) return;
  this.service.getsingledata(this.extraid).subscribe((res: any) => {
    console.log("Successfully fetched...!", res);
    if (res) {
      // Patch form values
      this.addproductform.patchValue({
        name: res.name,
        description: res.description,
        price: res.price,
      });
      // Map existing images; prepend only if it is a filename
      this.existingImages = res.images.map((img: string) =>
        img.startsWith('http') ? img : `http://localhost:3000/uploads/${img}`
      );
    }
  });
}

  r() {
    console.log("Reset called...!");
    this.addproductform.reset();
  }


  Update() {
  if (!this.extraid) return;

  const formData = new FormData();
  formData.append("name", this.addproductform.get("name")?.value);
  formData.append("description", this.addproductform.get("description")?.value);
  formData.append("price", this.addproductform.get("price")?.value);

  for (const file of this.selectedFiles) {
      formData.append("images", file, file.name);
    }

 

  this.service.updatesingledata(this.extraid, formData).subscribe((res: any) => {
    console.log("Updated Successfully!", res);

    if (res.product) {
      // Patch updated form values
      this.addproductform.patchValue({
        name: res.product.name,
        description: res.product.description,
        price: res.product.price
      });

      // Update existingImages array for display
      this.existingImages = res.product.images.map((img: string) =>
        img.startsWith('http') ? img : `http://localhost:3000/uploads/${img}`
      );

      // Refresh the product list
      this.getproduct();
    }
  });
}


  show() {
    const savedIds = JSON.parse(sessionStorage.getItem('filteredProductIds') || '[]');

    console.log("REsponces From sessiong storage", savedIds);
  }
}




