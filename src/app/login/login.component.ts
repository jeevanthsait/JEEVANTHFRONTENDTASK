import { LoginDTO ,EmailData} from './../models/logindto';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ServiceService } from '../Service/service.service';
import { Router } from '@angular/router';
import { RegisterDTO } from '../models/registerdto';
import { UserDTO ,UserloginDto} from '../models/UserDTO';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userdata!:FormGroup;
  register!:FormGroup
   storelogindata: LoginDTO | null = null;  
   storedata: RegisterDTO | null = null; 
   private service = inject(ServiceService);
  private router = inject(Router);
  constructor()
  {
     console.log("Yes Constructor called...!"); 
  }
  ngOnInit(): void {

     this.userdata = new FormGroup({
      "email": new FormControl(null, [Validators.required, Validators.email]),
      "password": new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
      this.register=new FormGroup({
      "name":new FormControl(null, Validators.required),
      "email":new FormControl(null, [Validators.required, Validators.email]),
      "password":new FormControl(null, [Validators.required, Validators.minLength(6)]),
      "role": new FormControl(null, Validators.required)
     });
     console.log("Yes Oninit called...!"); 
  }
 getdata() {
  console.log("I got the Responses:", this.userdata.value);

  // Cast form values to DTO
  this.storelogindata = this.userdata.value as LoginDTO;
  console.log("Responses in DTO:", this.storelogindata);

  // Call service
  this.service.postreqlogin(this.storelogindata).subscribe({
    next: (res: UserloginDto) => {
      const token = res.token;
      localStorage.setItem('authToken', token);
      this.sendLoginEmail(this.storelogindata as LoginDTO);
      console.log("Successfully Logged In...!", res);
      this.router.navigate(['/']);
    },
    error: (err) => {
      console.error("Login failed:", err);
    }
  });
}


getdatareg() {
  console.log("Responses2:", this.register.value);
  this.storedata = this.register.value as RegisterDTO;
  console.log("Sending Registration Data:", this.storedata);

  this.service.postrequest(this.storedata).subscribe({
    next: (res: UserDTO) => {
      console.log("Successfully Registered:", res);
      this.Sendregistermail(this.storedata as RegisterDTO);
      
    },
    error: (err) => {
      console.error("Registration failed:", err);
    }
  });
}


sendLoginEmail(data: { email: string; password: string }) {
  console.log("mail sample====",data)
  const emailData:EmailData = {
    to: data.email,
    subject: "Login Notification...!",
    text: `Hello! You have successfully logged in.`
  };
  this.service.sendMail(emailData).subscribe((res:unknown)=>
  {
    if(res)
    {
      console.log("Email succefully send..!");  
    }
  })
}
Sendregistermail(storedata:{email:string})
{
   console.log("Register mail:",storedata);
    const  registerdata:EmailData = {
    to: storedata.email,
    subject: "Register  Notification...!",
    text: `Hello! You have successfully Registered...!`
  };
  this.service.sendMail(registerdata).subscribe((res:unknown)=>
  {
    if(res)
    {
      console.log("Register Email succefully send..!",res);
    }
  })
}

}
