import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { QuestionDataService, Question, Answer } from './questions.service';

@Component({
  selector: 'navigation',
  template: `
                <ul>
                  <!--Course and Send Link coded in manually-->
                  <li><a [routerLink]="['/course']" routerLinkActive="active">Choose Course</a></li>
                  <!--insert new question link for every fetched question in init -->
                  <li *ngFor="let question of questions"><a [routerLink]="['/question']"> Frage {{question.id}}</a></li>
                  <li><a [routerLink]="['/send']" routerLinkActive="active">Send</a></li>
                </ul>
            <router-outlet></router-outlet>
            `,
directives: [ROUTER_DIRECTIVES],
providers: [QuestionDataService]
})
export class AppComponent implements OnInit {
  //Variable for storing survey data
  questions: Question[];
  ngOnInit() {
  //get survey data on initialization
  this.questions = this.dataService.getSurveyData();
  }
  constructor(private dataService: QuestionDataService){
  }
}
