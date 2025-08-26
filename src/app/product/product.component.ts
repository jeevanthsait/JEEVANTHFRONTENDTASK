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
  storepostdata: any[] = [];
  selected: any;
  newarray: any[] = [];
  extraid: any;
  count: any
  storenewsingledata: any;
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
      "images": new FormControl(null),
    });
  }

  getproduct() {
    this.service.getproductdata().subscribe((res: any) => {
      if (res) {
        console.log("productdaa", res);
        this.storeproduct = res;
        this.applyFilterAndSort();
      }
    })
  }

  // !-----fileterd array----!


  applyFilterAndSort() 
  {
    // 1️⃣ Filter example: price > 150
    
    this.filteredProducts = this.storeproduct.filter((p: any) => p.price > 100)
      //  console.log("Filtered array length:", this.filteredProducts.length);
      //  console.log("Filterd by price:😎",this.filteredProducts);
    // 2️⃣ Sort ascending by price
       this.filteredProducts.sort((a, b) => a.price - b.price);

    // 3️⃣ Save filtered & sorted data to session storage
    sessionStorage.setItem('filteredProductIds', JSON.stringify(this.filteredProducts));

    console.log("Filtered & Sorted Products:", this.filteredProducts);
  }

  // sendpostadd()
  // {
  //   console.log("newproductdata:🐼",this.addproductform.value);
  //   this.storepostdata=this.addproductform.value;
  //   this.service.postproductdata(this.storepostdata).subscribe((res:any)=>
  //   {
  //     console.log("Succesfully Added data..!🤞",res);
  //   });
  // }

  sendpostadd() {
    console.log("newproductdata 🐼", this.addproductform.value);

    const formData = new FormData();
    formData.append("name", this.addproductform.value.name);
    formData.append("description", this.addproductform.value.description);
    formData.append("price", this.addproductform.value.price);

    // If you allow multiple images
    for (let file of this.addproductform.value.images) {
      formData.append("images", file);
    }

    this.service.postproductdata(formData).subscribe((res: any) => {
      console.log("Succesfully Added data..! 🤞", res);
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
      // add if not already there
      if (!this.newarray.some((p: any) => p._id === product._id)) {
        this.extraid = product._id;   // ✅ correct assignment
        this.newarray.push({ _id: this.extraid });
      }
    } else {
      // remove if unchecked
      this.newarray = this.newarray.filter((p: any) => p._id !== product._id);
    }
    // if any one is unchecked, turn off SelectAll
    this.selectedAll = this.storeproduct.every((p: any) => p.selected);

    console.log("Child Changed ->", this.newarray);

  }
  Editdata() {
    console.log("Extra id:", this.extraid);
    this.service.getsingledata(this.extraid).subscribe((res: any) => {
      console.log("Successfully fetched...!", res);
      if (res) {
        this.addproductform.patchValue({
          "name": res.name,
          "description": res.description,
          "price": res.price,
          "images": res.images,
        })
      }
    })
  }
  r() {
    console.log("Reset called...!");
    this.addproductform.reset();
  }
  

  Update() {
  console.log("Extra id:", this.extraid);
  const formData = new FormData();
  formData.append("name", this.addproductform.get("name")?.value);
  formData.append("description", this.addproductform.get("description")?.value);
  formData.append("price", this.addproductform.get("price")?.value);

 
  const fileInput = (document.getElementById("filesup") as HTMLInputElement);
  if (fileInput.files && fileInput.files.length > 0) {
    formData.append("images", fileInput.files[0]);
  }

  this.service.updatesingledata(this.extraid, formData).subscribe((res:any) => {
    console.log("Updated Successfully!", res);
  });
}
show()
{
  const savedIds = JSON.parse(sessionStorage.getItem('filteredProductIds') || '[]');

   console.log("REsponces From sessiong storage",savedIds); 
}
}




