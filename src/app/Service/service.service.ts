import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private url="http://localhost:3000/auth/register";
  private loginurl="http://localhost:3000/auth/login";
  private prourl="http://localhost:3000/api/products";
  constructor(private http:HttpClient)
   { }

   postrequest(data:any)
   {
    console.log("Service data:",data);
    return  this.http.post(this.url,data);
   }
   postreqlogin(data:any):Observable<any>
   {
    
    console.log("login data👍:",data);
    return this.http.post(this.loginurl,data);
   }

   getproductdata()
   {
    return this.http.get(this.prourl);
   }
   postproductdata(data:any)
   {
    return  this.http.post(this.prourl,data);
   }
    deleteproduct(id: string) {
  return this.http.delete(`${this.prourl}/${id}`);
   }
   getsingledata(id:string)
   {
    return this.http.get(`${this.prourl}/${id}`)
   }

   updatesingledata(id: string, formData: FormData)
   {
    return this.http.get(`${this.prourl}/${id}`)
   }

}
