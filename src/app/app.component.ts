import { Component } from '@angular/core';
import { DwLanguageService } from '@webdpt/framework/language';

@Component({
  selector: '#dmdqt app-root',
  template: `
  <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(langService: DwLanguageService) {
    const data = localStorage.getItem('store')
    const store = JSON.parse(data);
    const userInfo = { "isLoggedin": true, "userId": store ? store.userinfo.userId : "", "userName": store ? store.userinfo.userName : "", "token": store ? store.token : "a65a550d-f66b-43d7-b4e8-a43581b5ce6e" }
    localStorage.setItem('DwUserInfo', JSON.stringify(userInfo));
    sessionStorage.setItem('DwUserInfo', JSON.stringify(userInfo));
  }
  ngOnInit() { }
}
