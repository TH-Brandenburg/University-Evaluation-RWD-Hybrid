import { Component, Input, OnInit } from '@angular/core';
import { QuestionDataService, Question, Answer, Survey } from './questions.service';

@Component({
  selector: 'question-show',
  template: `
            <h1>{{currentQuestion.multipleChoiceQuestionDTOs[0].question}}</h1>
            <!--<div name="multiQuestion" [ngSwitch]="currentQuestion.type">
              <template [ngSwitchCase]="'text'">Hier wird Text eingefügt</template>
              <template ngSwitchDefault>-->
                <button *ngFor="let answer of currentQuestion.multipleChoiceQuestionDTOs[0].choices" (click)=onClickAnswer()>{{ answer.choiceText }}</button>
                {{ questions }}
              <!--</template>
            </div>-->
            `,
  providers: [QuestionDataService]
})

export class QuestionComponent implements OnInit {
  currentQuestion: Question;
  questions;
  ngOnInit() {
    this.currentQuestion = JSON.parse(this.dataService.getQuestionTest());
  }
  constructor(private dataService: QuestionDataService) {
  }
  onClickAnswer(answer: string) {}
}
