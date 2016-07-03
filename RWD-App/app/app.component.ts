import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { QuestionDataService, Question, Answer, Survey } from './questions.service';


@Component({
  selector: 'navigation',
  template: `
                <ul>
                  <!--Course and Send Link coded in manually-->
                  <li><a [routerLink]="['/course']" routerLinkActive="active">Choose Course</a></li>
                  <!--insert new question link for every fetched question in init -->
                  <li *ngFor="let question of questions.multipleChoiceQuestionDTOs; let i=index"><a [routerLink]="['/question']"> Frage {{i + 1}}</a></li>
                  <li *ngFor="let question of questions.textQuestions; let i=index"><a [routerLink]="['/question']"> Frage {{i + 1 + questions.multipleChoiceQuestionDTOs.length}}</a></li>
                  <li><a [routerLink]="['/send']" routerLinkActive="active">Send</a></li>
                </ul>
            <router-outlet></router-outlet>
            `,
directives: [ROUTER_DIRECTIVES],
providers: [QuestionDataService]
})
export class AppComponent implements OnInit {
  //Variable for storing survey data
  questions: any;
  ngOnInit() {
  //get survey data on initialization
  this.questions = JSON.parse(this.dataService.getQuestionTest());
  }
  constructor(private dataService: QuestionDataService){
  }
}
