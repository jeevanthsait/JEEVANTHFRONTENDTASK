import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
    constructor(private translate: TranslateService) {
  translate.addLangs(['en', 'fr','hi']); 
  translate.use('en');    
            
}

switchLanguage(lang: string) {
    this.translate.use(lang); 
  }
}
