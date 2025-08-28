import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  implements OnInit{

  
  ngOnInit(): void {
    
    console.log("Yes called...!");
  }

  toggleDropdown() {
  const dropdown = document.getElementById('c');
  if(dropdown) {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  }
}
onKeydown(event: KeyboardEvent): void {
  console.log("Check Keyevent:",event);
  if (event.key === 'Enter' || event.key === ' ') {
    this.toggleDropdown(); 
  }
}
}
