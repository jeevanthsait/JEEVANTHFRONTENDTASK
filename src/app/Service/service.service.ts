import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmailData, LoginDTO } from '../models/logindto';
import { RegisterDTO } from '../models/registerdto';
import { Observable } from 'rxjs';
import { UserDTO, UserloginDto } from '../models/UserDTO';
import { ProductDto, ProductResponse } from '../models/Productdto';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private url="http://localhost:3000/auth/register";
  private loginurl="http://localhost:3000/auth/login";
  private prourl="http://localhost:3000/api/products";


  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private http : HttpClient
  )
   { 
    console.log("Constructor is called in Services")
   }

   postrequest(data: RegisterDTO): Observable<UserDTO> {
  console.log("Service data:", data);
  return this.http.post<UserDTO>(this.url, data);
}
postreqlogin(data: LoginDTO): Observable<UserloginDto> {
  console.log("Login data Services:", data);
  return this.http.post<UserloginDto>(this.loginurl, data);
}

getproductdata(): Observable<ProductDto[]> {
  return this.http.get<ProductDto[]>(this.prourl);
}

postproductdata(data: FormData): Observable<ProductResponse> {
  return this.http.post<ProductResponse>(this.prourl, data); 
}
    deleteproduct(id: string) {
  return this.http.delete(`${this.prourl}/${id}`);
   }

 getsingledata(id: string): Observable<ProductDto> {
  return this.http.get<ProductDto>(`http://localhost:3000/api/products/${id}`);
}

updatesingledata(id: string, formData: FormData): Observable<{ product: ProductDto }> {
  console.log("Yes called...! in services");
  return this.http.put<{ product: ProductDto }>(`${this.prourl}/${id}`, formData);
}

   sendMail(data:EmailData) 
   {
    console.log("Services email check data:",data)
   return this.http.post('http://localhost:3000/api/mail/send', data);
  }

}
