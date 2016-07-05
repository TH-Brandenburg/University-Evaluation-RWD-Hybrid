import { Component, Input, OnInit } from '@angular/core';
import { QuestionDataService, Question, Answer, Survey } from './questions.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'test-question-show',
  template: `
            <h1>{{currentQuestion[id].questionText}}</h1>
            <form #formData='ngForm' (ngSubmit)="onSubmit(formData.value)">
                   <textarea type="text" ngControl="name" value="{{inputText}}"></textarea>
                    <button block (click)="onSubmit()">Weiter</button>
            </form>

            `,
  providers: [QuestionDataService]
})

export class TextQuestionComponent implements OnInit {
  private currentQuestion: any;
  private sub: any;
  private id: any;
  private textFirst: any;
  ngOnInit() {
    this.currentQuestion = JSON.parse(this.dataService.getQuestionTest());
    this.textFirst = this.currentQuestion.textQuestionsFirst;
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
  onSubmit(value: any) {
    this.dataService.addTextAnswer(this.currentQuestion[this.id].questionID,this.currentQuestion[this.id].questionText, value);
    if ( this.id + 1 > this.currentQuestion.length) {
      if (this.textFirst == true) {
      this.router.navigate(['/question', 0])
      }
      else {
        this.router.navigate(['/send'])
      }
    }
    else this.router.navigate(['/text-question', this.id + 1]);
  }
}
