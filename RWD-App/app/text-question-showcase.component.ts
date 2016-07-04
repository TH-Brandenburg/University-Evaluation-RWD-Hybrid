import { Component, Input, OnInit } from '@angular/core';
import { QuestionDataService, Question, Answer, Survey } from './questions.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'test-question-show',
  template: `
            <h1>{{currentQuestion[id].questionText}}</h1>
                <form action="onClick(text)">
                  <textarea cols="50" rows="10" placeholder="Hier bitte eintragen"></textarea>
                </form>

            `,
  providers: [QuestionDataService]
})

export class TextQuestionComponent implements OnInit {
  currentQuestion: any;
  private sub: any;
  private id: any;
  ngOnInit() {
    this.currentQuestion = JSON.parse(this.dataService.getQuestionTest());
    this.currentQuestion = this.currentQuestion.textQuestions;
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
  onClickAnswer(answer: string) {}
}
