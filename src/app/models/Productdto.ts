export interface ProductDto {
//   map(arg0: (product: ProductDto) => { images: string[]; _id: string; name: string; description: string; price: number; stock: number; selected?: boolean; }): ProductDto[];
  _id: string;             
  name: string;
  description: string;
  price: number;
  images: string[];      
  stock: number;   
  selected?: boolean;
   
}

export interface ProductResponse {
 message: string;
  product: ProductDto;
  error: string;
}

export interface Image {
  url: string;
  description: string;
}