import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { QuestionDataService, Question, Answer, Survey } from './questions.service';
import { NavigationComponent } from './navigation/navigation.component';


@Component({
  selector: 'body',
  template: `
            <navigation *ngIf="appStarted"></navigation>
            <img src="app/img/fh-logo.jpg" alt="TH Brandenburg Logo" class="startImage" *ngIf="!appStarted" />
            <button class="startButton" *ngIf="!appStarted" (click)="startApp()">Start App</button>
            <router-outlet></router-outlet>
            `,
directives: [ROUTER_DIRECTIVES, NavigationComponent],
providers: [QuestionDataService]
})
export class AppComponent {
  //Variable for storing survey data
  appStarted: boolean = false;
  ngOnInit() {
  //get survey data on initialization
  }
  constructor(){
  }
  startApp() {
    this.appStarted = true;
    //this.router.navigate(['/scan']);
  }
}
