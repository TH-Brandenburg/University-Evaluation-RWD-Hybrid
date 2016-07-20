import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { QuestionDataService, Question, Answer, Survey } from './questions.service';
import { NavigationComponent } from './navigation/navigation.component';


@Component({
  selector: 'body',
  template: `
            <img src="app/img/fh-logo.jpg" alt="TH Brandenburg Logo" class="startImage" *ngIf="!appStarted" />
            <button class="startButton" *ngIf="!appStarted" (click)="startApp()">Start App</button>
            <router-outlet *ngIf="appStarted"></router-outlet>
            `,
directives: [ROUTER_DIRECTIVES, NavigationComponent],
providers: [QuestionDataService]
})
export class AppComponent {
  //Variable for storing survey data
  appStarted: boolean = false;
  ngOnInit() {
    let scannerData = JSON.parse(localStorage.getItem('appStarted'));
    this.appStarted = scannerData;
    localStorage.removeItem('appStarted');
  }
  constructor(private dataService: QuestionDataService){
  }
  startApp() {
    this.appStarted = true;
    window.location.href = '/app/scanner/scanner.template.html';
    //this.router.navigate('/app/scanner/scanner.template.html');
  }
}
