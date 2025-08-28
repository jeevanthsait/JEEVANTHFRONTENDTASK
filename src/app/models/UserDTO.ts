export interface UserDTO {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
 
export interface  UserloginDto {
  message:string;
  token:string;
   user:string;
  email:string;
  _id:string
  name:string,
  role:string
}