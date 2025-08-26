import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
constructor(private translate: TranslateService) {
  translate.addLangs(['en', 'fr','hi']); 
  translate.use('en');              
}

  switchLanguage(lang: string) {
    this.translate.use(lang); 
  }
}
