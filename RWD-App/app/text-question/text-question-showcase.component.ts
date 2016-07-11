import { Component, Input, OnInit } from '@angular/core';
import { QuestionDataService, Question, Answer, Survey } from '../questions.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'test-question-show',
  moduleId: module.id,
  templateUrl: 'text-question.template.html'
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
