import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../Service/service.service';
import { Router, Navigation } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userdata!:FormGroup;
  register!:FormGroup
  storedata: any;
  storelogindata: any;
 
  constructor(private service:ServiceService,private router:Router)
  {
     console.log("Yes Constructor called...!"); 
  }
  ngOnInit(): void {

     this.userdata=new FormGroup({
      "email":new FormControl(null),
      "password":new FormControl(null)
     });

      this.register=new FormGroup({
      "name":new FormControl(null),
      "email":new FormControl(null),
      "password":new FormControl(null),
      "role":new FormControl(null)
     });
     console.log("Yes Oninit called...!"); 
  }
  getdata()
{
  console.log("I got the Responces:",this.userdata.value);
  this.storelogindata=this.userdata.value;
  this.service.postreqlogin(this.storelogindata).subscribe((res:any)=>
  {
    if(res)
    {
      const token = res.token
      localStorage.setItem('authToken', token);
    }
    console.log("Succesfully Login...!",res);
     this.sendLoginEmail(this.storelogindata);
    // this.router.navigate(['/product']);
  });
}

getdatareg()
{
  console.log("Responces2:",this.register.value);
  this.storedata=this.register.value;
  this.service.postrequest(this.storedata).subscribe((res:any)=>
  {
    if(res) 
      {
        console.log("Successfully Registered...!",res);
        this.Sendregistermail(this.storedata);
         
      }
      

  })
  
}

sendLoginEmail(data: { email: string; password: string }) {
  console.log("mail sample",data)
  const emailData = {
    to: data.email,
    subject: "Login Notification...!",
    text: `Hello! You have successfully logged in. Your password is: ${data.password}`
  };
  this.service.sendMail(emailData).subscribe((res)=>
  {
    if(res)
    {
      console.log("Email succefully send..!");
      this.router.navigate(['/home']);  
    }
  })
}
Sendregistermail(storedata:{email:string})
{
   console.log("Register mail:",storedata);
    const  registerdata = {
    to: storedata.email,
    subject: "Register  Notification...!",
    text: `Hello! You have successfully Registered...!`
  };
  this.service.sendMail(registerdata).subscribe((res)=>
  {
    if(res)
    {
      console.log("Register Email succefully send..!");
    }
  })
}

}
