import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { inject } from '@angular/core';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
   private translate = inject(TranslateService);
constructor() {
  this.translate.addLangs(['en', 'fr','hi']); 
  this.translate.use('en');    
            
}

switchLanguage(lang: string) {
    this.translate.use(lang); 
  }
}
