import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { QuestionDataService, Question, Answer, Survey } from './questions.service';


@Component({
  selector: 'navigation',
  template: `
              <div [ngSwitch]="questions.textQuestionsFirst">
                <ul *ngSwitchCase="true">
                  <!--Course and Send Link coded in manually-->
                  <li><a [routerLink]="['/course']" routerLinkActive="active">Choose Course</a></li>
                  <li *ngFor="let question of questions.textQuestions; let i=index"><a [routerLink]="['/text-question', i]"> Textfrage {{question.questionID}}</a></li>
                  <!--insert new question link for every fetched question in init -->
                  <li *ngFor="let question of questions.multipleChoiceQuestionDTOs; let i=index"><a [routerLink]="['/question', i]"> Frage {{i + 1}}</a></li>
                  <li><a [routerLink]="['/send']" routerLinkActive="active">Send</a></li>
                </ul>
                <ul *ngSwitchDefault>
                  <li><a [routerLink]="['/course']" routerLinkActive="active">Choose Course</a></li>
                  <!--insert new question link for every fetched question in init -->
                  <li *ngFor="let question of questions.multipleChoiceQuestionDTOs; let i=index"><a [routerLink]="['/question', i]"> Frage {{i + 1}}</a></li>
                  <li *ngFor="let question of questions.textQuestions; let i=index"><a [routerLink]="['/text-question', i]"> Textfrage {{question.questionID}}</a></li>
                  <li><a [routerLink]="['/send']" routerLinkActive="active">Send</a></li>
                </ul>
              </div>
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
