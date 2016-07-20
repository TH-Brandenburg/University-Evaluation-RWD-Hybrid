import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { QuestionDataService, Question, Answer, Survey } from './questions.service';
import { NavigationComponent } from './navigation/navigation.component';


@Component({
  selector: 'body',
  template: `
            <navigation *ngIf="appStarted"></navigation>
            <router-outlet></router-outlet>
            `,
directives: [ROUTER_DIRECTIVES, NavigationComponent],
providers: [QuestionDataService]
})
export class AppComponent {
  appStarted:boolean = false;
  constructor(private router:Router){
    this.router.events.subscribe(path => {
      if(path.url == "/"){
        this.appStarted = false;
      }else{
        this.appStarted = true;
      }
        }
    );
  }
}
