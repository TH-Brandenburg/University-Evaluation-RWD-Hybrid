import { Component, Input, OnInit } from '@angular/core';
import { QuestionDataService, Question, Answer, Survey } from './questions.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'question-show',
  template: `
            <h1>{{currentQuestion[id].question}}</h1>
                <button *ngFor="let answer of currentQuestion[id].choices" (click)=onClickAnswer()>{{ answer.choiceText }}</button>
            `,
  providers: [QuestionDataService]
})

export class QuestionComponent implements OnInit {
  currentQuestion: any;
  private sub: any;
  private id: any;
  ngOnInit() {
    this.currentQuestion = JSON.parse(this.dataService.getQuestionTest());
    this.currentQuestion = this.currentQuestion.multipleChoiceQuestionDTOs;
    this.sub = this.route.params.subscribe(params => {let id = +params['id'];
    this.id = id;
  });

  }
  ngOnDestroy() {
  this.sub.unsubscribe();
  }

  constructor(private dataService: QuestionDataService,
    private route: ActivatedRoute,
    private router: Router) {
  }
  onClickAnswer(answer: string) {

  }
}
