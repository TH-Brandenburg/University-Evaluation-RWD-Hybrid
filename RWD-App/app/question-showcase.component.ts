import { Component, Input, OnInit } from '@angular/core';
import { QuestionDataService } from './questions.service';
import { Question, Answer } from './questions.service';

@Component({
  selector: 'question-show',
  template: `
            <h1>{{currentQuestion.text}}</h1>
            <!--<div name="multiQuestion" [ngSwitch]="currentQuestion.type">
              <template [ngSwitchCase]="'text'">Hier wird Text eingefügt</template>
              <template ngSwitchDefault>-->
                <button *ngFor="let answer of currentQuestion.answers" (click)=onClickAnswer()>{{ answer.text }}</button>
              <!--</template>
            </div>-->
            `,
  providers: [QuestionDataService]
})

export class QuestionComponent implements OnInit {
  currentQuestion: Question;
  ngOnInit() {
    //get currentQuestion on init, currently fixed fetch till I add query options to navigation
    this.currentQuestion = this.surveyService.getQuestion(0);
  }
  constructor(private surveyService: QuestionDataService) {
  }
  onClickAnswer(answer: string) {}
}
